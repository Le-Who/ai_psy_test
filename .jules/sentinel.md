## 2024-05-20 - [XSS via errorBox]
**Vulnerability:** Cross-Site Scripting (XSS) vulnerability found in `app.js` where untrusted API error messages (`err.message`) were directly injected into the DOM using `errorBox.innerHTML`.
**Learning:** Even internal API error messages can be a vector for XSS if the API provider returns unescaped HTML content or if there is a Man-In-The-Middle attack returning crafted error payloads. Error messages should never be assumed safe for HTML parsing.
**Prevention:** Always use `textContent` (or `innerText`) to render untrusted strings, including error messages, to ensure they are treated as plain text and not parsed as HTML. Add CSS `white-space: pre-wrap` and `word-wrap: break-word` to format newlines correctly without relying on `<br>` tags.
