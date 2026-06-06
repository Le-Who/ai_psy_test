## 2024-06-06 - XSS Array Bypass in escapeHtml
**Vulnerability:** The `Utils.escapeHtml` function returned inputs immediately if they were not of type "string". This allowed arrays containing malicious strings (like `["<script>alert(1)</script>"]`) to bypass HTML escaping completely, leading to XSS vulnerabilities when the array was later implicitly coerced to a string during template rendering.
**Learning:** Checking `typeof input !== "string"` is insufficient for XSS prevention because arrays of strings bypass the check but are still rendered as strings when interpolated into HTML.
**Prevention:** Explicitly coerce inputs to strings (e.g., using `String(unsafe)`) before performing regex replacements, while carefully handling `null` and `undefined` to maintain backward compatibility.
