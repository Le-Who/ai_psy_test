import { expect, test } from "@playwright/test";

test.describe("Psychometric Test Flow", () => {
	test("User can generate and complete a test successfully", async ({
		page,
	}) => {
		// Mock the AI Backend (Architect & Generator)
		let apiCallCount = 0;

		await page.route("**/chat/completions", async (route) => {
			apiCallCount++;
			if (apiCallCount === 1) {
				// Architect response
				const blueprint = {
					testType: "dimensional",
					constructDefinition: {
						name: "E2E Test Construct",
						theoreticalBackground: "N/A",
						targetPopulation: "E2E Testers",
					},
					outcomes: [
						{ id: "o1", name: "Outcome 1", description: "High Outcome 1" },
						{ id: "o2", name: "Outcome 2", description: "High Outcome 2" },
					],
				};
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						choices: [{ message: { content: JSON.stringify(blueprint) } }],
					}),
				});
			} else {
				// Generator response
				const questions = {
					scaleProfile: {},
					questions: [
						{
							text: "Question 1?",
							mapping: [{ outcomeId: "o1", weight: 1.0 }],
							polarity: "direct",
							facetId: "f1",
						},
						{
							text: "Question 2?",
							mapping: [{ outcomeId: "o1", weight: -1.0 }],
							polarity: "reverse",
							facetId: "f2",
						},
					],
				};
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						choices: [{ message: { content: JSON.stringify(questions) } }],
					}),
				});
			}
		});

		// 1. Visit App
		await page.goto("/");

		// 2. Setup Phase
		// Test accessibility of labels
		await page.locator('label[for="themeInput"]').click({ force: true });
		await expect(page.locator("#themeInput")).toBeFocused();

		await page.fill("#themeInput", "Testing E2E");
		await page.fill("#apiKeyInput", "sk-fake-key");
		await page.click('button[type="submit"]');

		// 3. Test Phase
		const errorBox = page.locator("#errorBox");
		if (await errorBox.isVisible()) {
			console.error("AI Generation Error:", await errorBox.textContent());
		}
		await expect(page.locator("#testView")).toBeVisible({ timeout: 10000 });
		await expect(page.locator("#qNum")).toHaveText("1/2");
		await expect(page.locator("#qText")).toHaveText("Question 1?");

		// Answer Q1 (Wait for click and transition)
		await page.click('button.likert-opt[data-value="5"]');

		// Check Q2
		await expect(page.locator("#qNum")).toHaveText("2/2");
		await expect(page.locator("#qText")).toHaveText("Question 2?");

		// Answer Q2
		await page.click('button.likert-opt[data-value="1"]');

		// 4. Results Phase
		await expect(page.locator("#resultsView")).toBeVisible();
		await expect(page.locator("#resContent")).toContainText("Outcome 1");
		await expect(page.locator("#resContent")).toContainText("100%");
	});
});
