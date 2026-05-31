## 2024-05-31 - Array Bypass XSS in Utils.escapeHtml
**Vulnerability:** XSS array bypass vulnerability due to lack of explicit type conversion.
**Learning:** The `Utils.escapeHtml` implementation checked `if (typeof unsafe !== "string") return unsafe;`. This allowed an array such as `["<script>alert(1)</script>"]` to bypass the string check without being escaped. If the array is later coerced to string during HTML template rendering, it introduces an XSS vector.
**Prevention:** `Utils.escapeHtml` should strictly enforce string coercion `String(unsafe)` prior to applying string `replace()`, returning original values only for exact match on `null` or `undefined`.
