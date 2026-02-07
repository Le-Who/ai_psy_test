## 2025-05-20 - Hardcoded TinyURL Token
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was found in `app-settings.js`. This allows anyone with access to the client-side code to use the developer's TinyURL account.
**Learning:** Client-side JavaScript is public. Storing secrets in variables, even in separate settings files, is insecure as they are delivered to the user's browser.
**Prevention:** Never embed secrets in client-side code. Use `localStorage` to store user-provided keys, or use a backend proxy to handle API requests that require secrets.
