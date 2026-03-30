## 2025-02-14 - Removed hardcoded TinyURL Token
**Vulnerability:** A hardcoded `TINYTOKEN` API key was found in `src/app-settings.js` and used in `src/app.js` for URL shortening via TinyURL API. This leaked a secret to the client bundle.
**Learning:** Hardcoding API keys exposes them in client-side applications. The application already relies on a Bring Your Own Key (BYOK) model for other integrations.
**Prevention:** Rely on users providing their own API keys via prompts and storing them securely in `localStorage`, or proxy requests through a secure backend that holds the key.
