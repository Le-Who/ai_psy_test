## 2025-05-18 - Remove Hardcoded API Key
**Vulnerability:** Hardcoded TinyURL API key (`TINYTOKEN`) found globally scoped in `src/app-settings.js`, exposing secret to the version control system and public frontend client.
**Learning:** Hardcoded keys for client-side API integrations without user-facing input UIs should be retrieved from environment variables rather than source code to prevent leakage.
**Prevention:** Always use secure environment variables via Vite (`import.meta.env`) mapped dynamically during build, and ensure `.env` is ignored by git.
