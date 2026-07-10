## 2023-11-20 - Hardcoded API Token Vulnerability
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) is stored in plaintext directly in `src/app-settings.js`, exposing it to anyone who accesses the codebase or views the compiled client-side JavaScript.
**Learning:** In client-side (SPA) applications, secrets should never be embedded directly into the source code, as they are inherently public.
**Prevention:** Remove hardcoded secrets from client-side code. Instead, either require the user to provide their own token, proxy requests through a secure backend, or configure the application to run without the secret (if acceptable).
