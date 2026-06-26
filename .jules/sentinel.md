## 2024-05-15 - [Hardcoded secret in ES Module]
**Vulnerability:** A hardcoded API token (`TINYTOKEN`) was present in a client-side ES module (`src/app-settings.js`), which was undeclared and unexported.
**Learning:** Even if a secret is undeclared/unexported in an ES module (resulting in `typeof VARIABLE === "undefined"` in dependent files), the hardcoded string remains in the source code bundled for the client, posing a critical security risk.
**Prevention:** Never hardcode secrets in client-side code, regardless of whether the variables are actively exported or used. Use environment variables injected at build time or backend proxies.
