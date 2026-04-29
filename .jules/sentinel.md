## 2024-04-29 - Hardcoded TinyURL API Token
**Vulnerability:** A hardcoded production secret (`TINYTOKEN`) for the TinyURL API was found exposed in the codebase within `src/app-settings.js`, accessible globally.
**Learning:** Storing API keys directly in client-side code exposes them to anyone who can view the source, leading to potential abuse of the associated API quota or account. The app architecture relies on Vite, which has built-in mechanisms for environment variables, making hardcoded secrets unnecessary.
**Prevention:** Never commit API tokens or secrets directly into the repository. Use environment variables (e.g., `import.meta.env.VITE_TINYTOKEN`) and manage them securely outside of source control.
