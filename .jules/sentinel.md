## 2024-06-28 - Removed hardcoded API key (TINYTOKEN)
**Vulnerability:** A hardcoded API key (`TINYTOKEN`) was embedded in the source code (`src/app-settings.js`), allowing anyone to find and use it. This was used to create tiny URLs for sharing.
**Learning:** Client-side JavaScript cannot securely store API keys unless they are provided directly by the user dynamically.
**Prevention:** Remove hardcoded keys entirely. If an API key is needed for an external service, require the user to input it, or delegate the operation to a secured backend system. Do not place secrets in source code files.
