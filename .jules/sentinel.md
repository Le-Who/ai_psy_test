## 2026-05-28 - Hardcoded External API Token in Frontend Code
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was found in `src/app-settings.js`, exposing a service account token to all application users.
**Learning:** Even when the primary application architecture relies on a 'Bring Your Own Key' (BYOK) model (e.g., storing LLM tokens in `localStorage`), auxiliary integrations like URL shorteners might still be implemented insecurely by hardcoding static keys directly into the client-side bundle.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) for static third-party integration keys in Vite projects, and ensure build tools do not embed the secret unless intentionally exposed (e.g., via backend proxy or temporary proxying).
