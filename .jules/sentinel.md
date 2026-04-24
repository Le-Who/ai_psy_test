## 2024-05-24 - Hardcoded API Token
**Vulnerability:** Hardcoded `TINYTOKEN` API secret in `src/app-settings.js`.
**Learning:** Secrets should not be hardcoded in client-side JS files as they are easily visible to end users. Using environment variables like Vite env vars is the standard way to handle secrets securely for frontend build tools.
**Prevention:** Ensure all external API tokens and secrets are securely provided through environment variables.
