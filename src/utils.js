/**
 * Shared Utilities
 * Includes security helpers
 */
export const Utils = {
	/**
	 * Escapes HTML special characters to prevent XSS
	 * @param {string} unsafe
	 * @returns {string}
	 */
	escapeHtml: (unsafe) => {
		if (unsafe == null) return unsafe;
		if (typeof unsafe !== "string") return unsafe;
		const str = String(unsafe);

		// ⚡ Bolt: Fast path to avoid overhead on safe strings using single pass regex test
		if (!/[&<>"']/.test(str)) {
			return str;
		}

		// ⚡ Bolt: Single-pass character code loop instead of regex and switch for O(n) complexity.
		const len = str.length;
		let escaped = "";
		let lastMatchIndex = 0;

		for (let i = 0; i < len; i++) {
			const char = str.charCodeAt(i);
			let replacement = null;

			if (char === 38) replacement = "&amp;";
			else if (char === 60) replacement = "&lt;";
			else if (char === 62) replacement = "&gt;";
			else if (char === 34) replacement = "&quot;";
			else if (char === 39) replacement = "&#039;";

			if (replacement !== null) {
				if (lastMatchIndex !== i) {
					escaped += str.substring(lastMatchIndex, i);
				}
				escaped += replacement;
				lastMatchIndex = i + 1;
			}
		}

		if (lastMatchIndex !== len) {
			escaped += str.substring(lastMatchIndex);
		}

		return escaped;
	},
};

/**
 * Toggles password visibility for a given input ID
 * @param {string} id - The ID of the password input
 * @param {HTMLElement} btn - The toggle button element
 */
export const togglePasswordVisibility = (
	/** @type {string} */ id,
	/** @type {HTMLElement} */ btn,
) => {
	const input = /** @type {HTMLInputElement | null} */ (
		document.getElementById(id)
	);
	if (!input) return;

	const isPassword = input.type === "password";
	input.type = isPassword ? "text" : "password";
	btn.innerHTML = isPassword ? "🙈" : "👁️";
	btn.setAttribute(
		"aria-label",
		isPassword ? "Скрыть API ключ" : "Показать API ключ",
	);
};

/**
 * Basic Observability Logger
 */
export const Logger = {
	init() {
		window.onerror = (message, source, lineno, colno, error) => {
			this.saveLog({
				type: "error",
				message,
				source,
				lineno,
				colno,
				stack: error?.stack,
			});
		};
		window.addEventListener("unhandledrejection", (event) => {
			this.saveLog({
				type: "unhandledrejection",
				reason: event.reason?.toString(),
			});
		});
	},
	saveLog(data) {
		try {
			const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
			logs.unshift({ ...data, time: new Date().toISOString() });
			if (logs.length > 50) logs.pop();
			localStorage.setItem("app_logs", JSON.stringify(logs));
		} catch (e) {}
	},
};
