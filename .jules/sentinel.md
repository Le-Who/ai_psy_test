## 2025-05-16 - Hardcoded API Token Leakage
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was embedded directly into `src/app-settings.js`, exposing the secret to the client bundle and source control.
**Learning:** Hardcoded secrets in frontend configuration files indicate a failure to use modern environment variable injections (like Vite's `import.meta.env`) and present a critical credential exposure risk in public and distributed codebases.
**Prevention:** Never commit API tokens, passwords, or cryptographic keys to source control. Use environment variables injected at build time or fetched dynamically at runtime. For client-side code, always restrict the exposed key's permissions and monitor its usage.
