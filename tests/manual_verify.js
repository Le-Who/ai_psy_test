
function originalLogic(mapping, q) {
    const hasPos = mapping.some((m) => m.weight > 0);
    const hasNeg = mapping.some((m) => m.weight < 0);
    let polarity = "direct";
    if (hasPos && hasNeg) polarity = "mixed";
    else if (hasNeg && !hasPos) polarity = "reverse";
    q.polarity = polarity;
}

function optimizedLogic(mapping, q) {
    let hasPos = false;
    let hasNeg = false;
    for (const m of mapping) {
        if (m.weight > 0) hasPos = true;
        else if (m.weight < 0) hasNeg = true;
        if (hasPos && hasNeg) break;
    }
    let polarity = "direct";
    if (hasPos && hasNeg) polarity = "mixed";
    else if (hasNeg && !hasPos) polarity = "reverse";
    q.polarity = polarity;
}

const testCases = [
    { mapping: [{ weight: 1.0 }, { weight: -1.0 }], expected: "mixed" },
    { mapping: [{ weight: 1.0 }, { weight: 0.5 }], expected: "direct" },
    { mapping: [{ weight: -1.0 }, { weight: -0.5 }], expected: "reverse" },
    { mapping: [{ weight: 1.0 }], expected: "direct" },
    { mapping: [{ weight: -1.0 }], expected: "reverse" },
    { mapping: [], expected: "direct" }
];

testCases.forEach((tc, i) => {
    const q1 = {};
    originalLogic(tc.mapping, q1);
    const q2 = {};
    optimizedLogic(tc.mapping, q2);
    if (q1.polarity !== tc.expected || q2.polarity !== tc.expected || q1.polarity !== q2.polarity) {
        console.error(`Test Case ${i} failed: expected ${tc.expected}, got ${q1.polarity} (orig) and ${q2.polarity} (opt)`);
        process.exit(1);
    }
});

console.log("All manual correctness tests passed!");
