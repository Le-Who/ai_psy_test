## 2024-06-07 - Hardcoded API Secret Removal
**Vulnerability:** A hardcoded API token (`TINYTOKEN`) was embedded directly into the frontend source code (`src/app-settings.js`), which exposed a secret that could be trivially extracted.
**Learning:** Third-party integration keys for non-user-facing actions should never be hardcoded. Even though the application uses BYOK for AI providers, it failed to extend this security practice to the TinyURL integration.
**Prevention:** Always use environment variables (e.g., Vite's `import.meta.env`) mapped during build or runtime configuration to inject secrets instead of committing them to the repository.
