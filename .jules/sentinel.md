## 2024-05-18 - [CRITICAL] Fix Hardcoded Secrets
**Vulnerability:** A hardcoded third-party API token (`TINYTOKEN`) was present in the source code (`src/app-settings.js`), which was shipped client-side.
**Learning:** Hardcoding secrets exposes sensitive credentials to any user who inspects the application's source code.
**Prevention:** Migrate to a Bring Your Own Key (BYOK) architecture where users must provide their own API token. These tokens should be dynamically requested from the user, and stored securely client-side via `localStorage`.
