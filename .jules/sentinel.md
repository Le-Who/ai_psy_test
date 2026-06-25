## 2024-05-24 - Hardcoded Secret in Config
**Vulnerability:** A hardcoded `TINYTOKEN` (TinyURL API key) was found in `src/app-settings.js`, exposing a critical secret in client-side code that is tracked by source control.
**Learning:** Secrets should never be hardcoded or committed, especially in client-facing or public repositories, as they can be easily extracted by bad actors to abuse services.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_TINYURL_TOKEN`) to manage secrets and ensure keys are injected during deployment rather than hardcoded.
