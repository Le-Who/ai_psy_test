import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppStorage } from "../src/storage.js";

// Mock localStorage
const localStorageMock = (() => {
	let store = {};
	return {
		getItem: vi.fn((key) => store[key] || null),
		setItem: vi.fn((key, value) => {
			store[key] = value.toString();
		}),
		removeItem: vi.fn((key) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

vi.stubGlobal("localStorage", localStorageMock);

describe("AppStorage", () => {
	beforeEach(() => {
		localStorageMock.clear();
		AppStorage._cache = null;
		AppStorage._htmlItems = null;
		AppStorage._renderedHtmlCache = null;
		AppStorage._themesCache = null;
	});

	it("should start empty", () => {
		const all = AppStorage.getAll();
		expect(all).toEqual([]);
		expect(AppStorage.renderLibraryHTML()).toContain("Библиотека пуста");
	});

	it("should save a test and return renamed theme if duplicate", () => {
		const blueprint = { testType: "psy" };
		const questions = [];

		const initialName = AppStorage.save(blueprint, questions, "Test", null);
		expect(initialName).toBe("Test");

		const duplicateName = AppStorage.save(blueprint, questions, "Test", null);
		expect(duplicateName).toBe("Test (2)");

		const all = AppStorage.getAll();
		expect(all.length).toBe(2);
		expect(all[0].theme).toBe("Test (2)");
	});

	it("should delete a test by id", () => {
		AppStorage.save({}, [], "To Delete", null);
		const all = AppStorage.getAll();
		const id = all[0].id;

		AppStorage.delete(id);
		expect(AppStorage.getAll().length).toBe(0);
	});
});
