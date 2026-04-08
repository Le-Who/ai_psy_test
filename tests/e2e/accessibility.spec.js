import { expect, test } from "@playwright/test";

test.describe("Form Label Accessibility", () => {
	test("Labels should focus their respective inputs when clicked", async ({
		page,
	}) => {
		await page.goto("/");

		// Focus testing logic
		const labelInputPairs = [
			{ label: "label[for='themeInput']", input: "#themeInput" },
			{ label: "label[for='notesInput']", input: "#notesInput" },
			{ label: "label[for='audienceInput']", input: "#audienceInput" },
			{ label: "label[for='qCountInput']", input: "#qCountInput" },
			{ label: "label[for='apiKeyInput']", input: "#apiKeyInput" },
		];

		for (const { label, input } of labelInputPairs) {
			await page.locator(label).click();
			await expect(page.locator(input)).toBeFocused();
		}

		// Switch to quiz mode to reveal the difficulty input and test it specifically
		await page.evaluate(() => {
			window.app.setMode("quiz");
		});

		// wait for difficulty input to be visible
		await expect(page.locator("#difficultyInput")).toBeVisible();

		await page.locator("label[for='difficultyInput']").click();
		await expect(page.locator("#difficultyInput")).toBeFocused();
	});
});
