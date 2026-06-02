## 2024-06-02 - Fix XSS Array Bypass
**Vulnerability:** XSS array bypass vulnerability in `Utils.escapeHtml` where passing an array like `["<script>alert(1)</script>"]` bypassed the `typeof unsafe !== "string"` check and returned the array unescaped, allowing it to be implicitly converted to a string and injected into the DOM as HTML.
**Learning:** Checking for `typeof === "string"` to decide whether to escape inputs is insufficient, as other types (like arrays) can bypass the check but still be implicitly cast to strings later during template interpolation.
**Prevention:** Enforce string coercion using `String(unsafe)` on inputs intended for HTML contexts, and explicitly return `null`/`undefined` to prevent unexpected output like `"null"` or `"undefined"`.
