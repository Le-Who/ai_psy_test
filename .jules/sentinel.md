## 2024-05-22 - Hardcoded TinyURL Token
**Vulnerability:** Found a hardcoded `TINYTOKEN` API key in `app-settings.js`. This exposed the private API key to anyone viewing the source code, potentially leading to quota abuse or unauthorized link creation.
**Learning:** In client-side-only applications without a backend or build process, developers often resort to hardcoding secrets for convenience.
**Prevention:** Never commit secrets to the repo. For client-side apps, either use a backend proxy or require the user to provide their own API key (stored in `localStorage`), as implemented in this fix.
