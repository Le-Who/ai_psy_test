## 2024-05-20 - [Fix Hardcoded Secret]
**Vulnerability:** A hardcoded API key (TINYTOKEN) was found in `src/app-settings.js`, exposing sensitive credentials in plain text.
**Learning:** External API keys must not be hardcoded directly into source files. This bypasses the intended BYOK model and exposes credentials directly.
**Prevention:** Use a Bring Your Own Key (BYOK) model for external integrations. Securely fetch configuration strings and keys from `localStorage` by dynamically prompting the user and caching the token.
