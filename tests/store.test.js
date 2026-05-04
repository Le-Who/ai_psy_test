import { beforeEach, describe, expect, it, vi } from "vitest";
import { store, subscribe } from "../src/store.js";

describe("Store", () => {
	it("should call the listener when a store property changes", () => {
		const listener = vi.fn();
		const unsubscribe = subscribe(listener);

		store.step = 1;

		expect(listener).toHaveBeenCalledWith("step", 1, expect.any(Object));
		unsubscribe();
	});

	it("should call multiple listeners when a store property changes", () => {
		const listener1 = vi.fn();
		const listener2 = vi.fn();
		const unsub1 = subscribe(listener1);
		const unsub2 = subscribe(listener2);

		store.mode = "duel";

		expect(listener1).toHaveBeenCalledWith("mode", "duel", expect.any(Object));
		expect(listener2).toHaveBeenCalledWith("mode", "duel", expect.any(Object));

		unsub1();
		unsub2();
	});

	it("should unsubscribe correctly", () => {
		const listener = vi.fn();
		const unsubscribe = subscribe(listener);

		unsubscribe();

		store.step = 2;
		expect(listener).not.toHaveBeenCalled();
	});

	it("should pass the target object to the listener", () => {
		const listener = vi.fn();
		const unsubscribe = subscribe(listener);

		store.quizScore = 10;

		expect(listener).toHaveBeenCalledWith(
			"quizScore",
			10,
			expect.objectContaining({ quizScore: 10 }),
		);
		unsubscribe();
	});

	it("should not call the listener when setting a property to its identical existing value", () => {
		const listener = vi.fn();

		// Reset state and attach listener
		store.step = 0;
		const unsubscribe = subscribe(listener);

		// Ensure clear mock functions before assertion
		listener.mockClear();

		// Set to identical value
		store.step = 0;

		expect(listener).not.toHaveBeenCalled();
		unsubscribe();
	});
});
