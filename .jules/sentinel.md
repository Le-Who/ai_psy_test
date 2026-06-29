## 2025-03-09 - Remove hardcoded TinyURL Token
**Vulnerability:** A hardcoded API token (TINYTOKEN) for TinyURL is exposed directly in `src/app-settings.js` and `src/app.js`, making it accessible to any client.
**Learning:** Hardcoding API secrets in a frontend application exposes them to anyone who inspects the source code. The project is completely serverless, meaning secrets cannot be securely hidden on a backend.
**Prevention:** Avoid hardcoding secrets. If a 3rd party API requires authentication, the user should provide the token via the UI or the feature shouldn't rely on sensitive tokens.
