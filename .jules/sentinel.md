## 2024-05-19 - XSS Array Bypass Vulnerability in escapeHtml
**Vulnerability:** XSS array bypass vulnerability in `Utils.escapeHtml`.
**Learning:** Passing an array instead of a string bypassed the `typeof unsafe !== "string"` check, returning the raw unescaped payload.
**Prevention:** Explicitly handle `null`/`undefined` and coerce the input to string using `String(unsafe)` before applying the regex replace to ensure all inputs are securely escaped.
