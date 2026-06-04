## 2024-05-24 - Hardcoded Secret Removal
**Vulnerability:** Hardcoded API token (TINYTOKEN) found in `src/app-settings.js`.
**Learning:** Hardcoding secrets directly in the source code can lead to credential leakage if the code is exposed or committed to public repositories.
**Prevention:** Use environment variables (e.g. `import.meta.env.VITE_TINYTOKEN`) to store and access secrets dynamically rather than hardcoding them in the source.
