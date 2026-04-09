
## 2024-05-24 - [Hardcoded TINYTOKEN removal]
**Vulnerability:** Found a hardcoded global `TINYTOKEN` API key in `src/app-settings.js`, which is a critical security vulnerability that exposes API access directly in the codebase.
**Learning:** Hardcoded secrets in client-side code are inherently insecure as they are exposed to anyone who can view the source files. The application already implements a BYOK (Bring Your Own Key) pattern for other services, but missed it for this specific external service (TinyURL).
**Prevention:** Always rely on secure, dynamically retrieved environment variables, `localStorage` (for BYOK apps), or backend proxy services. Enforce automated checks using tools like `trufflehog` or `git-secrets` in CI/CD pipelines to prevent secrets from being committed.
