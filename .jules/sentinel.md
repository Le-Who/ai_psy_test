## 2024-05-18 - [Fix hardcoded TINYTOKEN]
**Vulnerability:** A hardcoded token `TINYTOKEN` was found in `src/app-settings.js` and `src/app.js`, which could expose the TinyURL API key.
**Learning:** Hardcoded credentials should be replaced with environment variables like `VITE_TINYTOKEN` using `import.meta.env` in Vite projects to ensure secrets are not committed or leaked.
**Prevention:** Always verify that tokens, passwords, or secrets are not committed or hardcoded before submitting PRs.
