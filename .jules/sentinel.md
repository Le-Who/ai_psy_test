## 2024-03-24 - Hardcoded Secret Removal
**Vulnerability:** Hardcoded TinyURL API Token (`TINYTOKEN`) in `src/app-settings.js`
**Learning:** Client-side source code contained a plaintext API token for link shortening, exposing it to anyone viewing the source.
**Prevention:** Always use environment variables (e.g. `import.meta.env.VITE_TINYTOKEN`) for API keys or secrets in Vite-based frontends, ensuring they are injected securely at build-time or fetched from a secure backend.
