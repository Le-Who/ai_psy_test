## 2024-05-24 - Remove hardcoded TinyURL secret
**Vulnerability:** A hardcoded TinyURL API key (`TINYTOKEN`) was present in the client-side `src/app-settings.js` source file.
**Learning:** Hardcoding secrets inside source code is a critical vulnerability as it exposes the key directly to anyone reading the code or to tools that scan the repository.
**Prevention:** Store sensitive values using environment variables via `import.meta.env` combined with `.env` files (which should be added to `.gitignore`). This ensures keys are injected securely at build or runtime, rather than being checked into version control.
