## 2024-05-12 - Fix XSS Array Bypass Vulnerability in escapeHtml
**Vulnerability:** XSS array bypass vulnerability.
**Learning:** Returning input directly when `typeof unsafe !== "string"` allows malicious HTML payloads wrapped in arrays (e.g., `["<script>...</script>"]`) to bypass the XSS filter and execute on the client.
**Prevention:** Always enforce string coercion (e.g., `String(unsafe)`) after explicitly handling `null` and `undefined` in sanitization functions to prevent unexpected object types from bypassing string-based filters.
