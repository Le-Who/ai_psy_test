
## 2024-04-14 - Fix hardcoded TinyURL API Token
**Vulnerability:** A hardcoded `TINYTOKEN` API secret was exposed globally in `src/app-settings.js`, creating a critical security risk for the client-side single-page application.
**Learning:** External integration secrets (like TinyURL tokens) were committed directly into the source code, exposing sensitive data to anyone who views the client side bundles.
**Prevention:** Implement a Bring Your Own Key (BYOK) model storing user-supplied keys in `localStorage` rather than hardcoding them in configuration files.
