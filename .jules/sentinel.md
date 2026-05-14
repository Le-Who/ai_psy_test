## 2024-05-14 - Fix Hardcoded TinyURL API Token
**Vulnerability:** A hardcoded API token (`TINYTOKEN`) for the TinyURL service was embedded directly in `src/app-settings.js`, exposing it to source control and client-side inspection.
**Learning:** Hardcoded secrets in client-side code are easily extractable and can lead to unauthorized API usage or rate limiting from the third-party service. This codebase relies on a Bring Your Own Key (BYOK) model or Vite environment variables for safe credential management without user UI.
**Prevention:** Always retrieve non-user-facing keys via environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) with defensive checks to prevent crashes in non-module environments, rather than hardcoding secrets.
