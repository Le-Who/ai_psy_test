## 2025-02-14 - Fix XSS Array Bypass in escapeHtml
**Vulnerability:** XSS Array Bypass
**Learning:** `escapeHtml` was only escaping strings, which allowed arrays to bypass the check. When an array with a malicious payload like `["<script>alert(1)</script>"]` was later interpolated into HTML, it was implicitly converted to a string and injected without escaping.
**Prevention:** Ensure values are always properly typed or converted using `String()` before passing them to the replace function, especially in loosely typed languages like JS. Also handle `null` and `undefined` safely.
