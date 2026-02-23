# Sentinel's Journal

## 2025-05-19 - Hardcoded TinyURL Token
**Vulnerability:** A hardcoded TinyURL API token (`TINYTOKEN`) was found in `app-settings.js`, exposed to all users.
**Learning:** Client-side only applications often tempt developers to hardcode secrets because there is no backend to hold them.
**Prevention:** Use `localStorage` to store user-provided keys or backend-for-frontend pattern if possible. In this case, prompting the user for their own key is the secure alternative for a purely static site.
