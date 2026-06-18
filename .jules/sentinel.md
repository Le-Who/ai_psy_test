## 2025-02-27 - Remove hardcoded API key from config
**Vulnerability:** A hardcoded API key (`TINYTOKEN`) was present in `src/app-settings.js`, posing a critical security risk by exposing the token to anyone with access to the source code or frontend client.
**Learning:** Hardcoded credentials can easily end up in version control and client bundles. It's crucial to pull these values from environment variables at build or runtime.
**Prevention:** Never commit API keys or sensitive tokens directly in code. Always use environment configurations like `.env` and retrieve them via `import.meta.env` in Vite or similar mechanisms.
