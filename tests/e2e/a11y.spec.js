import { expect, test } from "@playwright/test";

test.describe("Form Accessibility", () => {
	test("Labels should properly focus their associated inputs", async ({ page }) => {
		await page.goto("/");

        // Wait for setup view to be visible
        await page.waitForSelector('#setupView');

		// Test Theme Input
		await page.locator('label[for="themeInput"]').click({ force: true });
		await expect(page.locator("#themeInput")).toBeFocused();

		// Test Notes Input
		await page.locator('label[for="notesInput"]').click({ force: true });
		await expect(page.locator("#notesInput")).toBeFocused();

		// Test Audience Input
		await page.locator('label[for="audienceInput"]').click({ force: true });
		await expect(page.locator("#audienceInput")).toBeFocused();

        // difficultyInput is hidden by default, so we switch mode to 'quiz' to test it
        await page.evaluate(() => window.app.setMode('quiz'));

		// Test Difficulty Input
		await page.locator('label[for="difficultyInput"]').click({ force: true });
		await expect(page.locator("#difficultyInput")).toBeFocused();

		// Test Question Count Input
		await page.locator('label[for="qCountInput"]').click({ force: true });
		await expect(page.locator("#qCountInput")).toBeFocused();

		// Test API Key Input
		await page.locator('label[for="apiKeyInput"]').click({ force: true });
		await expect(page.locator("#apiKeyInput")).toBeFocused();
	});
});
