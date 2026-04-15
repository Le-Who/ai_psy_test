import { test, expect } from "@playwright/test";

test.describe("Form Label Accessibility", () => {
	test.beforeEach(async ({ page }) => {
		// Mock window.prompt and clipboard
		await page.addInitScript(() => {
			window.prompt = () => "mock-token";
			Object.defineProperty(navigator, "clipboard", {
				value: { writeText: async () => {} },
				configurable: true,
			});
		});

		await page.goto("http://localhost:5173/");
	});

	test("clicking labels focuses the associated inputs", async ({ page }) => {
		// Ensure we are in psy mode so audienceInput is visible, difficultyInput is hidden by default
		// but let's test the ones that are visible first.

		const labelsToTest = [
			{ id: "themeInput", forVal: "themeInput" },
			{ id: "notesInput", forVal: "notesInput" },
			{ id: "audienceInput", forVal: "audienceInput" },
			{ id: "qCountInput", forVal: "qCountInput" },
			{ id: "apiKeyInput", forVal: "apiKeyInput" },
		];

		for (const { id, forVal } of labelsToTest) {
			const label = page.locator(`label[for="${forVal}"]`);
			const input = page.locator(`#${id}`);

			await expect(label).toBeVisible();

			// Click the label
			await label.click({ force: true });

			// Verify input is focused
			await expect(input).toBeFocused();
		}

		// Switch to quiz mode to test difficultyInput visibility
		await page.evaluate(() => {
			if (window.app) {
				window.app.setMode("quiz");
			}
		});

		// Wait for difficultyInput to become visible
		const difficultyLabel = page.locator('label[for="difficultyInput"]');
		const difficultyInput = page.locator("#difficultyInput");

		await expect(difficultyLabel).toBeVisible();
		await difficultyLabel.click({ force: true });
		await expect(difficultyInput).toBeFocused();
	});
});
