## 2024-05-18 - XSS Array Bypass in escapeHtml
**Vulnerability:** The `escapeHtml` utility function returned non-string inputs as-is. If an array of malicious strings was passed (e.g., `['<script>alert(1)</script>']`), it bypassed the HTML escaping logic. When later interpolated into template literals, the array was implicitly stringified, resulting in raw HTML injection and XSS.
**Learning:** Checking `typeof unsafe !== "string"` in escaping functions is insufficient when the output is later implicitly stringified (e.g., in template literals).
**Prevention:** Always coerce inputs to string (`String(unsafe)`) after handling `null`/`undefined` to ensure all values, including arrays, are properly escaped.
