
## 2024-05-27 - XSS Array Bypass in escapeHtml
**Vulnerability:** The `escapeHtml` utility returned early for any non-string values (`typeof unsafe !== "string"`), allowing arrays containing malicious HTML (e.g., `["<script>alert(1)</script>"]`) to bypass sanitization. When coerced to strings later in template literals, these arrays rendered as valid HTML, leading to XSS.
**Learning:** Type checking like `typeof !== "string"` is insufficient for XSS sanitizers in JavaScript because objects or arrays can be implicitly cast to strings during template rendering, bypassing the check entirely.
**Prevention:** Sanitizers must handle type coercion explicitly by either converting all inputs to strings (e.g., using `String(unsafe)`) or throwing errors on unexpected types, while handling `null`/`undefined` gracefully.
