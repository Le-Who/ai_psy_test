## 2025-02-26 - XSS Array Bypass via Type Checking Flaw
**Vulnerability:** The `Utils.escapeHtml` function returned arrays unmodified because of a `typeof unsafe !== "string"` guard, allowing arrays of strings with malicious XSS payloads (e.g. `['<script>alert(1)</script>']`) to bypass the filter and later be concatenated into the DOM without escaping.
**Learning:** Type checking (`typeof unsafe !== "string"`) does not adequately defend against malicious payloads where arrays are coerced to strings elsewhere in the execution chain (such as when rendering elements to DOM via string interpolation/concatenation).
**Prevention:** Inputs to HTML-escaping functions must be strictly coerced to a string (e.g. `String(unsafe)`) after explicit `null`/`undefined` validation to guarantee safety.
