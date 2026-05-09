## 2026-05-09 - Hardcoded TinyURL API Token
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was present in `src/app-settings.js`, exposing it in the client-side code bundle.
**Learning:** External API keys, even for utility services like link shortening, should never be hardcoded in client-side code where they can be extracted and abused by anyone inspecting the source.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) for API keys that need to be injected during the build process, and ensure the application gracefully handles cases where the token is missing.
