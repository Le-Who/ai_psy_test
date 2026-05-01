## 2024-05-01 - Hardcoded API Secret (TINYTOKEN)
**Vulnerability:** A hardcoded API token (`TINYTOKEN`) for the TinyURL service was found directly in `src/app-settings.js`, exposing it to all users via client-side code.
**Learning:** Storing secrets in client-side code is a critical vulnerability as the code is fully visible in the browser, allowing attackers to extract and abuse the token for the external service.
**Prevention:** Always use environment variables for sensitive tokens (e.g. `import.meta.env.VITE_TINYTOKEN`) injected at build time, or prefer "Bring Your Own Key" (BYOK) approaches using `localStorage` for external services in client-side apps. Never commit secrets into source code.
