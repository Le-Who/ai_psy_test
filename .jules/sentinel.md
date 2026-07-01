## 2024-05-24 - Hardcoded API Token Exposure
**Vulnerability:** A hardcoded `TINYTOKEN` API token was exposed in `src/app-settings.js`. The application used it to authenticate to `api.tinyurl.com/create`.
**Learning:** Hardcoded credentials should never be committed into the repository, particularly in client-side code where it's exposed to all users. Even if the service (like TinyURL) provides an API, its token should be protected or the backend should be responsible for making authenticated requests.
**Prevention:** Avoid hardcoding secrets. Migrate to unauthenticated public endpoints where appropriate, or use an environment variable via a backend proxy for authenticated endpoints.
