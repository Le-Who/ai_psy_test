
## 2024-05-18 - [CRITICAL] Hardcoded API Token Vulnerability
**Vulnerability:** A hardcoded TinyURL API Token (`TINYTOKEN`) was present directly in `app-settings.js`. This is a critical security vulnerability as it leaked sensitive credentials to the client.
**Learning:** Hardcoded secrets in client-side code will be exposed.
**Prevention:** Replace hardcoded secrets with a "Bring Your Own Key" (BYOK) system where users are prompted to enter their API token, and the key is securely saved locally in `localStorage`.
