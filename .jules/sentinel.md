## 2026-07-16 - Hardcoded API Secret
**Vulnerability:** A hardcoded API token (`TINYTOKEN`) for the TinyURL service was found directly in `src/app-settings.js`, exposing it to anyone with access to the source code or anyone inspecting the frontend bundle.
**Learning:** Hardcoding secrets in source files, especially in client-side applications, leads to credential exposure. Even if it's "just" a URL shortener, it can lead to quota exhaustion or abuse under our account.
**Prevention:** Always use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN` in Vite) to inject secrets at build time or fetch them from a secure backend, ensuring they are not committed to version control.
