## 2024-05-21 - Removed Hardcoded API Key

**Vulnerability:** A hardcoded `TINYTOKEN` API secret was committed directly in `src/app-settings.js`, exposing the key to anyone with access to the source code.
**Learning:** Hardcoded secrets are a critical security risk as they can be easily extracted from the frontend code or repository history.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) to manage secrets, and never commit API keys or sensitive credentials into the codebase.
