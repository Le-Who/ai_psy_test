## 2024-05-20 - XSS Array Bypass in escapeHtml
**Vulnerability:** XSS Array Bypass Vulnerability
**Learning:** Arrays passed to `escapeHtml` were bypassing the `typeof unsafe !== "string"` check and returned unescaped, because the check just returned `unsafe` if it was not a string. When an array of strings with malicious HTML is injected into the DOM, JavaScript implicitly converts it to a string by joining its elements, allowing XSS execution.
**Prevention:** Always enforce string coercion (e.g., `String(unsafe)`) for all inputs before attempting regex replacement, and explicitly check for `null` or `undefined` instead of relying on broad type checks to handle non-string objects safely.
