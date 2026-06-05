## 2026-06-05 - Hardcoded Secrets in Config
**Vulnerability:** A TinyURL API token (`TINYTOKEN`) was hardcoded directly in `src/app-settings.js` as a global constant, which would be exposed in plain text to anyone loading the application.
**Learning:** Client-side applications must never embed API keys directly in source code. Even though the repository didn't commit an explicit `.env` file, the token was merged into the settings file and used by `src/app.js` directly.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN` in Vite) injected at build time, and ensure that tokens with real privileges are kept out of client-side code whenever possible (or use short-lived, restricted tokens).
