## 2024-05-24 - Removed hardcoded API key (TINYTOKEN)
**Vulnerability:** Hardcoded TinyURL API token (`TINYTOKEN`) was present in `src/app-settings.js` in plaintext.
**Learning:** Hardcoding secrets directly in the source code leaks sensitive information, particularly in client-side repositories and version control, which could lead to API abuse and compromised quotas. The app uses Vite environment variables elsewhere, but this was missed.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_SECRET`) for API keys. For integrations without user-facing input UIs, retrieve keys via environment variables instead of hardcoding.
