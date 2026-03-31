## 2024-05-31 - Hardcoded API Key in Global Settings
**Vulnerability:** A hardcoded TinyURL API key (`TINYTOKEN`) was exposed globally in `src/app-settings.js`, allowing anyone viewing the source code to potentially misuse the API quota.
**Learning:** Hardcoded secrets should never be placed in source files, especially not in front-end client code which is inherently public.
**Prevention:** Implement a 'Bring Your Own Key' (BYOK) model where users are prompted for their own API tokens, which are then securely stored client-side in `localStorage`.
