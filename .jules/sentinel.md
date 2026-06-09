## 2024-06-09 - Remove Hardcoded Token
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was present in `src/app-settings.js` and referenced globally.
**Learning:** Hardcoding secrets in client-side code exposes them to anyone who views the source code, potentially leading to unauthorized use of the associated service (in this case, TinyURL API limits could be exhausted by third parties).
**Prevention:** Always use environment variables for secrets, even in client-side apps. Provide them at build time (e.g., Vite `import.meta.env.VITE_*`) or use a backend proxy. Do not commit secrets to the repository.
