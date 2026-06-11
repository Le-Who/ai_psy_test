## 2024-06-11 - Removed Hardcoded TinyURL Token
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was found in `src/app-settings.js`.
**Learning:** Hardcoding secrets in source code is a critical security vulnerability because it exposes the credentials to anyone with access to the source code, potentially leading to unauthorized usage, abuse, or financial loss.
**Prevention:** Instead of hardcoding secrets, use environment variables. In a Vite project, environment variables prefixed with `VITE_` are exposed to the client-side code via `import.meta.env`.
