import { expect, test } from "@playwright/test";

test.describe("Accessibility - Form Labels", () => {
	test("Clicking form labels should focus their associated inputs", async ({
		page,
	}) => {
		await page.goto("/");

		// Switch to 'quiz' mode so difficultyInput is visible
		await page.evaluate(() => {
			if (window.app) {
				window.app.setMode("quiz");
			} else {
				console.error("App not found on window");
			}
		});

		// A helper to click a label and verify the associated input is focused
		async function expectLabelToFocusInput(labelSelector, inputSelector) {
			const label = page.locator(labelSelector);
			const input = page.locator(inputSelector);

			// Click the label explicitly (using force: true since there might be nested spans)
			await label.click({ force: true });

			// The input should now have focus
			await expect(input).toBeFocused();
		}

		await expectLabelToFocusInput("label[for='themeInput']", "#themeInput");
		await expectLabelToFocusInput("label[for='notesInput']", "#notesInput");

		// Check audience input in 'psy' mode (default)
		// It might be hidden if app initializes in a different mode or state isn't ready
		await page.evaluate(() => {
			if (window.app) {
				window.app.setMode("psy");
			}
		});
		await expect(page.locator("#audienceInput")).toBeVisible();
		await expectLabelToFocusInput(
			"label[for='audienceInput']",
			"#audienceInput",
		);

		// Switch to 'quiz' mode so difficultyInput is visible and audienceInput is hidden
		await page.evaluate(() => {
			if (window.app) {
				window.app.setMode("quiz");
			} else {
				console.error("App not found on window");
			}
		});

		// Wait for difficultyInput to become visible after mode change
		await expect(page.locator("#difficultyInput")).toBeVisible();
		await expectLabelToFocusInput(
			"label[for='difficultyInput']",
			"#difficultyInput",
		);

		await expectLabelToFocusInput("label[for='qCountInput']", "#qCountInput");
		await expectLabelToFocusInput("label[for='apiKeyInput']", "#apiKeyInput");
	});
});
