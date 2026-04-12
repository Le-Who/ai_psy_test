## 2025-04-12 - [Critical] Hardcoded TinyURL API Token in Source Code
**Vulnerability:** A hardcoded `TINYTOKEN` constant containing a live API key was found in `src/app-settings.js`, exposing it to the public repository and client bundle.
**Learning:** Hardcoded credentials even for non-core features like link shortening pose significant risk of quota exhaustion and misuse. Client-side applications must use a Bring Your Own Key (BYOK) model or a backend proxy for external integrations.
**Prevention:** Always check for hardcoded strings that look like tokens or keys. Implement dynamic retrieval from `localStorage` (like `tiny_api_token`) with user prompts for missing keys, ensuring absence of tokens gracefully skips features instead of crashing.
