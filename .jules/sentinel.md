## 2024-05-24 - Hardcoded Secret Removal
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was present in `src/app-settings.js`.
**Learning:** Hardcoding API keys exposes them in source control and client-side bundles, leading to unauthorized API usage.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) and inject them during build/deployment, never committing them directly into source code.
