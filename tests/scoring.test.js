import { describe, it, expect } from "vitest";
import { Scoring } from "../src/scoring.js";

describe("Scoring Logic", () => {
	describe("getBaseScore", () => {
		it("should return correct base score without map", () => {
			expect(Scoring.getBaseScore(1)).toBe(0);
			expect(Scoring.getBaseScore(3)).toBe(5);
			expect(Scoring.getBaseScore(5)).toBe(10);
		});

		it("should respect baseScoreMap if provided", () => {
			const map = { 1: 10, 2: 8, 3: 5, 4: 2, 5: 0 };
			expect(Scoring.getBaseScore(1, map)).toBe(10);
			expect(Scoring.getBaseScore(5, map)).toBe(0);
			expect(Scoring.getBaseScore(3, map)).toBe(5);
		});

		it("should fallback to 3 (score 5) for invalid input", () => {
			expect(Scoring.getBaseScore(null)).toBe(5);
			expect(Scoring.getBaseScore(undefined)).toBe(5);
		});
	});

	describe("pickBandLabel", () => {
		const bandsArray = [
			{ min: 0, max: 30, label: "Low" },
			{ min: 31, max: 70, label: "Medium" },
			{ min: 71, max: 100, label: "High" },
		];

		it("should return correct band label from array", () => {
			expect(Scoring.pickBandLabel(bandsArray, 15)).toBe("Low");
			expect(Scoring.pickBandLabel(bandsArray, 50)).toBe("Medium");
			expect(Scoring.pickBandLabel(bandsArray, 90)).toBe("High");
		});

		it("should return null when out of bounds", () => {
			expect(Scoring.pickBandLabel(bandsArray, 105)).toBeNull();
		});
	});

	describe("calculatePsyScores", () => {
		it("should calculate correct percentages", () => {
			const state = {
				blueprint: {
					outcomes: [{ id: "ext", name: "Extraversion" }],
				},
				questions: [
					{ mapping: [{ outcomeId: "ext", weight: 1 }] },
					{ mapping: [{ outcomeId: "ext", weight: -1 }] },
				],
				answers: [
					5, // score: 10
					1, // score: reverse of 1 (0) -> 10
				],
			};

			const res = Scoring.calculatePsyScores(state);
			expect(res.scores["ext"]).toBe(20);
			expect(res.percentages["ext"]).toBe(100);
		});
	});
});
