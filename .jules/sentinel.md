## 2026-01-31 - [Manual HTML Construction XSS]
**Vulnerability:** DOM and Stored XSS vulnerabilities found in `app.js` and `storage.js` due to direct concatenation of user input into HTML strings (e.g., `innerHTML = ... ${input} ...`).
**Learning:** Vanilla JS apps without a framework (like React/Vue) often lack auto-escaping mechanisms, making manual sanitization critical. Inline event handlers (`onclick="..."`) are particularly dangerous when combined with dynamic data.
**Prevention:** Use a dedicated sanitization utility (`escapeHtml`) for all user input before rendering. Prefer `textContent` over `innerHTML` where possible. For event handlers, pass data via `data-*` attributes instead of injecting it into the JS string.

## 2026-01-31 - [Hardcoded API Credentials]
**Vulnerability:** `TINYTOKEN` (TinyURL API key) is hardcoded in `app.js`.
**Learning:** Client-side only applications struggle to hide secrets. Hardcoding keys enables functionality but exposes credentials.
**Prevention:** Require users to provide their own keys or use a backend proxy.
