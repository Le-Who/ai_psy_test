from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000")

    # Override api.call. Since api is a const object, we can modify its properties.
    page.evaluate("""
        console.log("Overriding api.call");
        api.call = async (task, prompt, schema, key) => {
            console.log("Mock api.call task:", task);
            if (!task) return null; // Handle initialization check
            if (task.includes('architect')) {
                return {
                    testType: "categorical",
                    constructDefinition: { name: "Mock Test" },
                    outcomes: [{ id: "o1", name: "Res1", "description": "Desc1" }]
                };
            }
            if (task.includes('generator')) {
                return {
                    questions: [{ id: "q1", text: "Mock Question 1", mapping: [{outcomeId:"o1", weight:1}] }]
                };
            }
        };
    """)

    # Fill Setup
    page.fill("#themeInput", "Test Theme")
    page.fill("#apiKeyInput", "mock-key") # Needs to be something to pass validation

    # Click Generate
    page.click("button[type='submit']")

    # Wait for test view
    try:
        page.wait_for_selector("#testView", state="visible", timeout=5000)
        print("Generated test, now on Test View.")
    except Exception as e:
        print(f"Failed to reach Test View: {e}")
        page.screenshot(path="failed_generation.png")
        # Check if error box is visible
        if page.is_visible("#errorBox"):
             print(f"Error Box: {page.inner_text('#errorBox')}")
        exit(1)

    # Setup dialog handler for the prompt
    def handle_dialog(dialog):
        print(f"Dialog message: {dialog.message}")
        if "TinyURL API Token" in dialog.message:
            dialog.accept("my-secret-tiny-token")
        elif "Твое имя" in dialog.message:
             dialog.accept("Tester")
        elif "Скопируй ссылку" in dialog.message:
             dialog.dismiss()
        else:
            dialog.dismiss()

    page.on("dialog", handle_dialog)

    # Click Share
    # The share button might be "inProgressShareBtn"
    page.click("#inProgressShareBtn")

    # Wait for a bit for the prompt to be handled and storage to be updated
    page.wait_for_timeout(2000)

    # Check localStorage
    token = page.evaluate("localStorage.getItem('tinyurl_token')")
    print(f"Token in localStorage: {token}")

    if token == "my-secret-tiny-token":
        print("SUCCESS: Token was saved.")
    else:
        print("FAILURE: Token was NOT saved.")
        exit(1)

    # Take screenshot
    page.screenshot(path="verification_frontend.png")

    browser.close()

with sync_playwright() as p:
    run(p)
