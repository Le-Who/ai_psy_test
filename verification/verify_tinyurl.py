from playwright.sync_api import sync_playwright
import json
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # 1. Mock API calls
    page.route("https://openrouter.ai/api/v1/chat/completions", lambda route: handle_ai_api(route))
    page.route("https://api.tinyurl.com/create", lambda route: handle_tinyurl(route))

    # 2. Go to app
    page.goto("http://localhost:3000")

    # 3. Fill setup form
    page.fill("#themeInput", "Test Theme")
    page.fill("#apiKeyInput", "sk-or-dummy-key")

    # Click generate
    page.click("button[type=submit]")

    # Wait for loading
    try:
        page.wait_for_selector("#loadingOverlay", state="hidden", timeout=15000)
    except:
        print("Timeout waiting for loading overlay to disappear")
        page.screenshot(path="verification/error_loading.png")
        raise

    # Verify questions loaded
    try:
        page.wait_for_selector("#qText", state="visible", timeout=5000)
    except:
        print("Timeout waiting for questions")
        page.screenshot(path="verification/error_questions.png")
        raise

    # Answer the single question
    # Psy mode uses .likert-opt
    page.click(".likert-opt[data-value='5']")

    # Wait for transition to results
    try:
        page.wait_for_selector("#resultsView", state="visible", timeout=5000)
    except:
        print("Timeout waiting for results view")
        page.screenshot(path="verification/error_results.png")
        raise

    # 4. Click Share

    def handle_dialog(dialog):
        print(f"Dialog message: {dialog.message}")
        if "TinyURL API Token" in dialog.message:
            print("Accepting TinyURL prompt with token")
            dialog.accept("my-secret-tiny-token")
        elif "Твое имя" in dialog.message:
            print("Accepting name prompt")
            dialog.accept("My Name")
        elif "Скопируй ссылку" in dialog.message:
            print("Dismissing copy fallback")
            dialog.dismiss()
        else:
            print("Accepting unknown dialog")
            dialog.accept()

    page.on("dialog", handle_dialog)

    # Click Share button
    page.click("#shareBtn")

    # Wait for success toast
    try:
        page.wait_for_selector("#toast.show", timeout=5000)
        print("Toast appeared!")
    except:
        print("Toast did not appear")
        page.screenshot(path="verification/error_toast.png")

    # Screenshot
    page.screenshot(path="verification/tinyurl_verified.png")

    # Also verify local storage has the token
    token = page.evaluate("localStorage.getItem('tinyurl_token')")
    print(f"Stored token: {token}")

    if token != "my-secret-tiny-token":
        print(f"ERROR: Token mismatch! Expected 'my-secret-tiny-token', got '{token}'")
    else:
        print("Token verification SUCCESS")

    browser.close()

def handle_ai_api(route):
    req = route.request
    try:
        data = req.post_data_json
    except:
        data = {}

    messages = data.get("messages", [])
    system_prompt = messages[0].get("content", "") if messages else ""

    print(f"AI Call: {system_prompt[:50]}...")

    response_body = {}

    if "Архитектор" in system_prompt or "Architect" in system_prompt:
        # Return blueprint
        blueprint = {
            "testType": "categorical",
            "constructDefinition": {"name": "Test Construct"},
            "outcomes": [
                {"id": "o1", "name": "Result A", "description": "Desc A"},
                {"id": "o2", "name": "Result B", "description": "Desc B"}
            ]
        }
        response_body = {
            "choices": [{
                "message": {
                    "content": json.dumps(blueprint)
                }
            }]
        }
    else:
        # Generator - return questions
        questions_resp = {
            "questions": [
                {
                    "id": "q1",
                    "text": "Question 1",
                    "mapping": [{"outcomeId": "o1", "weight": 1.0}],
                    "polarity": "direct",
                    "facetId": "f1"
                }
            ],
            "scaleProfile": {},
            "meta": {}
        }
        response_body = {
            "choices": [{
                "message": {
                    "content": json.dumps(questions_resp)
                }
            }]
        }

    route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps(response_body)
    )

def handle_tinyurl(route):
    req = route.request
    headers = req.headers
    auth = headers.get("authorization", "")

    print(f"TinyURL Auth Header: {auth}")

    if "Bearer my-secret-tiny-token" in auth:
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "data": {
                    "tiny_url": "https://tinyurl.com/test-short-link"
                }
            })
        )
    else:
        print("TinyURL Auth failed")
        route.fulfill(status=401, body="Unauthorized")

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
