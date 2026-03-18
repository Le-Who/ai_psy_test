## 2024-03-18 - [Fix Hardcoded API Key Vulnerability]
**Vulnerability:** A hardcoded `TINYTOKEN` API key was exposed in `src/app-settings.js`, enabling anyone with access to the source code to misuse the TinyURL API quota.
**Learning:** Even client-side, serverless applications should never bundle secret tokens inside the JavaScript bundle. API keys needed for external integrations like TinyURL should follow a "Bring Your Own Key" (BYOK) model when there is no backend server.
**Prevention:** Avoid defining keys natively as variables. Use `localStorage` prompts or `.env` injection at build time for secrets, dynamically fetching them when necessary.
