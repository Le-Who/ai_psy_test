## 2024-07-02 - Hardcoded TINYTOKEN API key
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was found directly in the client-side JavaScript (`src/app-settings.js`).
**Learning:** Hardcoded secrets in client-side code are fully exposed to the end-user and can be extracted, leading to unauthorized use of the associated API (in this case, TinyURL URL creation). The project incorrectly relies on this secret to generate sharing links.
**Prevention:** Never hardcode API keys or secrets in client-side JavaScript. Instead, securely load them via environment variables at build time, or delegate sensitive API calls to a secure backend proxy server.
