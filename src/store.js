export const listeners = new Set();

const initialState = {
	step: 0,
	mode: "psy",
	psy: {},
	quiz: {},
	duel: {},
	answers: [],
	questions: [],
	blueprint: null,
	quizScore: 0,
	duelHostName: null,
	duelHostScore: null,
	duelHostResultName: null,
};

export const store = new Proxy(
	{ ...initialState },
	{
		set(target, prop, value) {
			// Performance Optimization: Short-circuit on redundant state assignments
			// Prevents O(N) listener executions and subsequent expensive UI render tree
			// rebuilds when a value hasn't actually changed.
			if (target[prop] === value) return true;
			target[prop] = value;
			listeners.forEach((fn) => {
				fn(prop, value, target);
			});
			return true;
		},
	},
);

export function subscribe(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
