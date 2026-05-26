## 2024-05-27 - Remove hardcoded TinyURL API token
**Vulnerability:** A hardcoded API token (`TINYTOKEN`) was embedded directly in `src/app-settings.js`, exposing the secret in the source code.
**Learning:** Storing secrets as hardcoded strings in front-end client code (even if minified) is a critical security vulnerability.
**Prevention:** Always use environment variables (e.g. `import.meta.env.VITE_TINYTOKEN` in Vite) injected at build time, and add a safe fallback to prevent `ReferenceError` crashes in testing or non-module environments.
