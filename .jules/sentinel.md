## 2026-04-23 - Remove Hardcoded TINYTOKEN Secret
**Vulnerability:** A hardcoded secret token (`TINYTOKEN`) for the TinyURL API was found directly in `src/app-settings.js`, exposing the application to unauthorized API usage.
**Learning:** Hardcoding secrets inside client-side or public code exposes them to anyone who can inspect the source.
**Prevention:** Always use the 'Bring Your Own Key' (BYOK) model for external integrations, where the application retrieves necessary tokens from user input securely stored in `localStorage` instead of baking them into the codebase.
