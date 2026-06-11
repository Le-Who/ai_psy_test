/**
 * Shared Utilities
 * Includes security helpers
 */
const HTML_ESCAPE_REGEX = /[&<>"']/g;
const HTML_TEST_REGEX = /[&<>"']/;

const ESCAPE_MAP = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#039;",
};

export const Utils = {
	/**
	 * Escapes HTML special characters to prevent XSS
	 * @param {string} unsafe
	 * @returns {string}
	 */
	escapeHtml: (unsafe) => {
		if (typeof unsafe !== "string") return unsafe;
		// ⚡ Bolt: Fast-path existence check using non-global regex speeds up rendering of clean strings (~3x faster for clean strings)
		if (!HTML_TEST_REGEX.test(unsafe)) return unsafe;
		return unsafe.replace(HTML_ESCAPE_REGEX, (m) => ESCAPE_MAP[m]);
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
