## 2025-03-19 - [CRITICAL] Fix hardcoded API key (TINYTOKEN)
**Vulnerability:** A hardcoded `TINYTOKEN` API key was exposed in `src/app-settings.js` and used directly in `src/app.js` to create TinyURL links, allowing any user to potentially extract and abuse the key.
**Learning:** Hardcoded secrets in client-side code are fully visible to end-users and malicious actors. Relying on constants for API tokens in frontend applications violates core security boundaries.
**Prevention:** Avoid embedding any sensitive credentials in source code. Instead, rely on dynamic retrieval (e.g., prompting users to provide their own keys, BYOK model) and securely store them on the client side (e.g., `localStorage`), ensuring no secrets are committed to the repository.
