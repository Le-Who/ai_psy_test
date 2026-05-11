## 2024-05-11 - Hardcoded External Service Tokens
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was present in `src/app-settings.js`.
**Learning:** Even if it's not a primary authentication token for our backend, exposing third-party tokens (like URL shorteners) in client-side code can lead to abuse, rate limit exhaustion, or financial cost, and often gets leaked via version control. Test environments must be properly accounted for when loading secrets.
**Prevention:** Always rely on environment variables (`import.meta.env.VITE_TINYTOKEN` or similar) for third-party tokens, and use defensive checks (`typeof import.meta !== 'undefined'`) to prevent `ReferenceError` crashes in non-module test environments.
