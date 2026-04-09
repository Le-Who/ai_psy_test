## 2025-02-17 - [Hardcoded Secret Removal]
**Vulnerability:** A hardcoded TinyURL API Token (`TINYTOKEN`) was embedded in `src/app-settings.js` and actively used in `src/app.js` for external API requests, exposing it to anyone viewing the source code.
**Learning:** Hardcoded credentials are a critical risk, especially in client-side applications where all source code is publicly accessible. This required an architectural shift to prompt the user for their own key and store it securely in `localStorage`.
**Prevention:** Always use environment variables for secrets on the server-side, or use the "Bring Your Own Key" (BYOK) model for client-side applications where the user inputs their own API token.
