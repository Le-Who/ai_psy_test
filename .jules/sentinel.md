## 2024-05-24 - [Hardcoded TinyURL API Token]
**Vulnerability:** Hardcoded TinyURL API token (`TINYTOKEN`) found in `src/app-settings.js`.
**Learning:** Hardcoded credentials in client-side code are exposed to users and can be easily extracted, leading to unauthorized use of the API. This occurred likely for convenience during development but bypasses proper secret management.
**Prevention:** Use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) for API tokens and avoid committing secrets to version control. Let the build system inject them instead.
