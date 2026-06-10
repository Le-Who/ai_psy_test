## 2025-02-28 - [XSS Array Bypass in escapeHtml]
**Vulnerability:** The `escapeHtml` function checked `typeof unsafe !== "string"` to return early, ignoring array types. If an array containing malicious strings was passed in and implicitly stringified later in HTML, it bypassed escaping.
**Learning:** `JSON.stringify` does not escape HTML. If arrays are incorrectly passed to `escapeHtml` and then coerced to strings elsewhere, they bypass protection. Checking strictly for strings bypasses coercion.
**Prevention:** Explicitly coerce values to strings in HTML escaping functions (`String(unsafe)`) after checking for null/undefined to ensure arrays and other coercible types are safely escaped before rendering.
