/**
 * Shared Utilities
 * Includes security helpers
 */
const HTML_ESCAPE_REGEX = /[&<>"']/g;

const Utils = {
  /**
   * Escapes HTML special characters to prevent XSS
   * @param {string} unsafe
   * @returns {string}
   */
  escapeHtml: (unsafe) => {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe.replace(HTML_ESCAPE_REGEX, (m) => {
      switch (m) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#039;";
      }
    });
  },
};

/**
 * Toggles password visibility for a given input ID
 * @param {string} id - The ID of the password input
 * @param {HTMLElement} btn - The toggle button element
 */
/** @type {any} */ (window).togglePasswordVisibility = (
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
