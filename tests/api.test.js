import { describe, expect, it, vi } from "vitest";
import { api } from "../src/api.js";
import { Logger } from "../src/utils.js";

vi.mock("../src/utils.js", () => ({
	Logger: {
		saveLog: vi.fn(),
	},
}));

describe("api.safeParseJSON", () => {
	it("should parse valid JSON", () => {
		const json = '{"key": "value"}';
		expect(api.safeParseJSON(json)).toEqual({ key: "value" });
	});

	it("should parse JSON embedded in text with braces", () => {
		const text = 'Some text before {"key": "value"} some text after';
		expect(api.safeParseJSON(text)).toEqual({ key: "value" });
	});

	it("should parse JSON in markdown code blocks", () => {
		const text = '```json\n{"key": "value"}\n```';
		expect(api.safeParseJSON(text)).toEqual({ key: "value" });
	});

	it("should throw error and log if parsing fails", () => {
		const invalidJson = "invalid json";
		expect(() => api.safeParseJSON(invalidJson)).toThrow("JSON Parse Error");
	});

	it("should log errors when try-catch blocks fail in safeParseJSON", () => {
		// This text will trigger the second try-catch (substring with braces) but fail parsing
		const textWithBraces = "Invalid { json } here";
		expect(() => api.safeParseJSON(textWithBraces)).toThrow("JSON Parse Error");
		// We expect Logger.saveLog to be called for the failed JSON.parse within the catch
		expect(Logger.saveLog).toHaveBeenCalled();
	});

	it("should log errors when markdown JSON parsing fails", () => {
		const textWithMd = "```json\n{ invalid }\n```";
		expect(() => api.safeParseJSON(textWithMd)).toThrow("JSON Parse Error");
		expect(Logger.saveLog).toHaveBeenCalled();
	});
});
