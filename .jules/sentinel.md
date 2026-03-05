## 2024-05-24 - [Remove Hardcoded API Key]
**Vulnerability:** A hardcoded TinyURL API key (`TINYTOKEN`) was found in `app-settings.js`. This is a critical vulnerability as it exposes the API key to anyone who can view the source code.
**Learning:** Hardcoded secrets in client-side code are easily extracted by attackers. The application should not rely on a single hardcoded API key for external services.
**Prevention:** Implement a 'Bring Your Own Key' (BYOK) model where users provide their own API tokens, which are then securely stored client-side (e.g., in `localStorage`) rather than hardcoding them in the source code.
