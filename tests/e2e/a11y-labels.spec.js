import { expect, test } from "@playwright/test";

test.describe("Accessibility: Form Labels", () => {
	test("Clicking explicit labels should focus the corresponding inputs", async ({
		page,
	}) => {
		await page.goto("/");

		// Test themeInput label
		await page.locator("label[for='themeInput']").click();
		await expect(page.locator("#themeInput")).toBeFocused();

		// Test notesInput label
		await page.locator("label[for='notesInput']").click();
		await expect(page.locator("#notesInput")).toBeFocused();

		// Test audienceInput label
		await page.locator("label[for='audienceInput']").click();
		await expect(page.locator("#audienceInput")).toBeFocused();

		// difficultyInput is hidden by default (requires switching mode to quiz)
		await page.evaluate(() => app.setMode("quiz"));
		await page.locator("label[for='difficultyInput']").click();
		await expect(page.locator("#difficultyInput")).toBeFocused();

		// Test qCountInput label
		await page.locator("label[for='qCountInput']").click();
		await expect(page.locator("#qCountInput")).toBeFocused();

		// Test apiKeyInput label
		await page.locator("label[for='apiKeyInput']").click();
		await expect(page.locator("#apiKeyInput")).toBeFocused();
	});
});
