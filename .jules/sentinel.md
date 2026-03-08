## 2024-05-18 - Hardcoded Secret in Client App
**Vulnerability:** A hardcoded `TINYTOKEN` API key was embedded in `src/app-settings.js`, exposing the TinyURL service credentials in the client-side bundle.
**Learning:** For client-side single-page applications where secrets cannot be securely hidden, third-party integrations should follow a Bring Your Own Key (BYOK) model. Instead of embedding secrets, the app should dynamically retrieve them from `localStorage` or prompt the user.
**Prevention:** Never commit API keys or sensitive tokens directly into the source code (`app-settings.js`). Always use environment variables for build-time secrets or runtime user input stored securely via `localStorage` for external services.
