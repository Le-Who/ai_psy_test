function originalLogic(mapping, q) {
	if (!q.polarity) {
		const hasPos = mapping.some((m) => m.weight > 0);
		const hasNeg = mapping.some((m) => m.weight < 0);
		let polarity = "direct";
		if (hasPos && hasNeg) polarity = "mixed";
		else if (hasNeg && !hasPos) polarity = "reverse";
		q.polarity = polarity;
	}
}

function optimizedLogic(mapping, q) {
	if (!q.polarity) {
		let hasPos = false;
		let hasNeg = false;
		const len = mapping.length;
		for (let i = 0; i < len; i++) {
			const m = mapping[i];
			if (m.weight > 0) hasPos = true;
			else if (m.weight < 0) hasNeg = true;
			if (hasPos && hasNeg) break;
		}
		let polarity = "direct";
		if (hasPos && hasNeg) polarity = "mixed";
		else if (hasNeg && !hasPos) polarity = "reverse";
		q.polarity = polarity;
	}
}

const ITERATIONS = 1000000;
// Test with 2 items, which is common in normalizePsyQuestions
const mapping = [
	{ weight: 1.0, outcomeId: "a" },
	{ weight: -1.0, outcomeId: "b" },
];

function runBenchmark(name, fn) {
	const start = performance.now();
	for (let i = 0; i < ITERATIONS; i++) {
		const q = { polarity: null };
		fn(mapping, q);
	}
	const end = performance.now();
	console.log(`${name}: ${end - start}ms`);
}

console.log(
	`Running benchmark with ${ITERATIONS} iterations and 2 mapping items...`,
);
runBenchmark("Original Logic", originalLogic);
runBenchmark("Optimized Logic", optimizedLogic);
