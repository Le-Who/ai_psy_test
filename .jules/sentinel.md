## 2023-10-25 - Removed Hardcoded TinyURL API Token
**Vulnerability:** A hardcoded API token for TinyURL was present in src/app-settings.js, exposing it in source control.
**Learning:** Always use environment variables for secrets that should not be committed, even for frontend integrations where possible (BYOK model).
**Prevention:** Use import.meta.env for secrets and ensure they are loaded at runtime or build time instead of hardcoded.
