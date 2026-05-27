/**
 * Scoring logic for AI Psy Test
 */
export const Scoring = {
	getBaseScore(ans, baseScoreMap) {
		const a = ans !== undefined && ans !== null ? Number(ans) : 3;
		if (baseScoreMap && typeof baseScoreMap === "object") {
			const v = baseScoreMap[String(a)];
			if (typeof v === "number" && Number.isFinite(v)) return v;
		}
		return (a - 1) * 2.5; // fallback computation
	},

	pickBandLabel(bands, percent) {
		if (!bands) return null;
		if (Array.isArray(bands)) {
			for (const b of bands) {
				if (!b || typeof b !== "object") continue;
				const min =
					typeof b.min === "number"
						? b.min
						: typeof b.from === "number"
							? b.from
							: null;
				const max =
					typeof b.max === "number"
						? b.max
						: typeof b.to === "number"
							? b.to
							: null;
				if (min == null || max == null) continue;
				if (percent >= min && percent <= max)
					return b.label || b.name || b.title || null;
			}
			return null;
		}
		if (typeof bands === "object") {
			for (const key in bands) {
				if (!Object.hasOwn(bands, key)) continue;
				const b = bands[key];
				if (!b || typeof b !== "object") continue;
				const min =
					typeof b.min === "number"
						? b.min
						: typeof b.from === "number"
							? b.from
							: null;
				const max =
					typeof b.max === "number"
						? b.max
						: typeof b.to === "number"
							? b.to
							: null;
				if (min == null || max == null) continue;
				if (percent >= min && percent <= max)
					return b.label || b.name || key || null;
			}
		}
		return null;
	},

	calculatePsyScores(state) {
		const scaleProfile = state.blueprint.scaleProfile || null;
		const baseScoreMap = scaleProfile
			? scaleProfile.baseScoreMap || null
			: null;

		const scores = {};
		const potential = {};
		const structure = {};
		const outcomes = state.blueprint.outcomes || [];

		outcomes.forEach((o) => {
			scores[o.id] = 0;
			potential[o.id] = { minRaw: 0, maxRaw: 0 };
			structure[o.id] = {
				sumAbsWeight: 0,
				numItems: 0,
				numReverseItems: 0,
				numTwoOutcomeItems: 0,
			};
		});

		if (state.questions && state.answers) {
			state.questions.forEach((q, idx) => {
				const ans = state.answers[idx] !== undefined ? state.answers[idx] : 3;
				const baseScore = this.getBaseScore(ans, baseScoreMap);
				if (!q.mapping) return;

				const mappingLen = q.mapping.length;

				q.mapping.forEach((m) => {
					if (scores[m.outcomeId] === undefined) return;
					const weight = m.weight || 1;
					const absW = Math.abs(weight);
					const polarity = weight >= 0 ? 1 : -1;
					const finalScore = polarity === 1 ? baseScore : 10 - baseScore;

					scores[m.outcomeId] += finalScore * absW;
					potential[m.outcomeId].minRaw += 0 * absW;
					potential[m.outcomeId].maxRaw += 10 * absW;

					const s = structure[m.outcomeId];
					s.sumAbsWeight += absW;
					s.numItems += 1;
					if (weight < 0) s.numReverseItems += 1;
					if (mappingLen === 2) s.numTwoOutcomeItems += 1;
				});
			});
		}

		const percentages = {};
		outcomes.forEach((o) => {
			const minRaw = potential[o.id].minRaw;
			const maxRaw = potential[o.id].maxRaw;
			const denom = maxRaw - minRaw;
			if (denom > 0) {
				percentages[o.id] = Math.max(
					0,
					Math.min(100, Math.round(((scores[o.id] - minRaw) / denom) * 100)),
				);
			} else {
				percentages[o.id] = 0;
			}
		});

		return {
			scores,
			potential,
			structure,
			percentages,
			interpretationBands: scaleProfile
				? scaleProfile.interpretationBands
				: null,
		};
	},
};
