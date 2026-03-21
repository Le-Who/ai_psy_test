import { describe, expect, it, vi } from "vitest";

// Mock the global environment before importing app.js
if (typeof global.window === "undefined") {
	global.window = {};
}
if (typeof window === "undefined") {
	global.window = {};
}
if (typeof document === "undefined") {
	global.document = {
		addEventListener: vi.fn(),
	};
}

import { app } from "../src/app.js";

describe("normalizePsyQuestions", () => {
    it("should correctly set polarity to mixed for both positive and negative weights", () => {
        const questions = [{
            text: "Q1",
            mapping: [
                { weight: 1.0, outcomeId: "a" },
                { weight: -1.0, outcomeId: "b" }
            ]
        }];
        const normalized = app.normalizePsyQuestions(questions);
        expect(normalized[0].polarity).toBe("mixed");
    });

    it("should correctly set polarity to direct for positive weights only", () => {
        const questions = [{
            text: "Q1",
            mapping: [
                { weight: 1.0, outcomeId: "a" },
                { weight: 0.5, outcomeId: "b" }
            ]
        }];
        const normalized = app.normalizePsyQuestions(questions);
        expect(normalized[0].polarity).toBe("direct");
    });

    it("should correctly set polarity to reverse for negative weights only", () => {
        const questions = [{
            text: "Q1",
            mapping: [
                { weight: -1.0, outcomeId: "a" },
                { weight: -0.5, outcomeId: "b" }
            ]
        }];
        const normalized = app.normalizePsyQuestions(questions);
        expect(normalized[0].polarity).toBe("reverse");
    });

    it("should not override existing polarity", () => {
        const questions = [{
            text: "Q1",
            polarity: "custom",
            mapping: [
                { weight: 1.0, outcomeId: "a" }
            ]
        }];
        const normalized = app.normalizePsyQuestions(questions);
        expect(normalized[0].polarity).toBe("custom");
    });

    it("should handle mapping with more than 2 items by slicing and then determining polarity", () => {
        const questions = [{
            text: "Q1",
            mapping: [
                { weight: 2.0, outcomeId: "a" },
                { weight: -1.5, outcomeId: "b" },
                { weight: 0.5, outcomeId: "c" }
            ]
        }];
        const normalized = app.normalizePsyQuestions(questions);
        expect(normalized[0].mapping.length).toBe(2);
        // Sorted by abs weight: 2.0, -1.5. So it should be mixed.
        expect(normalized[0].polarity).toBe("mixed");
    });
});
