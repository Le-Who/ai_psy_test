## 2024-06-08 - Hardcoded API Secret
**Vulnerability:** The TINYTOKEN API secret was hardcoded into the source code (`src/app-settings.js`), posing a critical risk of token compromise and abuse if the repository is public or accessed by unauthorized users.
**Learning:** External API keys must not be hardcoded in client-side code or committed to version control.
**Prevention:** Use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) and inject them during the build process, or require users to provide their own keys in the UI (BYOK model).