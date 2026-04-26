## 2025-02-12 - Removed Hardcoded TinyURL Token
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was found in `src/app-settings.js`.
**Learning:** Hardcoding secrets in client-side code exposes them to anyone who inspects the source, leading to potential unauthorized API usage and quota exhaustion.
**Prevention:** Use environment variables (e.g., `import.meta.env`) to inject secrets during the build process, ensuring they are not committed to source control.
