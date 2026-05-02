## 2026-05-02 - Hardcoded Secrets
**Vulnerability:** Found a hardcoded TinyURL API token (`TINYTOKEN`) in `src/app-settings.js`.
**Learning:** Hardcoding API secrets in client-side code exposes them to anyone using the app or viewing the source code, leading to unauthorized use of the API.
**Prevention:** Always use environment variables (`import.meta.env.VITE_TINYTOKEN`) instead of hardcoding secrets in the codebase, especially in frontend apps.
