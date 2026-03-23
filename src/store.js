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
			// OPTIMIZATION: Prevent redundant listener callbacks and UI re-renders
			// when state properties are updated with identical values
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
