## 2025-02-27 - [XSS in Diagnostics View from LLM Output]
**Vulnerability:** XSS vulnerability via unescaped LLM output (`qualityChecks`) injected into `innerHTML`.
**Learning:** Data originating from LLMs must be treated as untrusted user input and explicitly sanitized (e.g., `Utils.escapeHtml`) before being rendered into the DOM. Even if the LLM output is expected to be JSON, it could contain malicious HTML payloads if the LLM hallucinated or was prompt-injected.
**Prevention:** Always wrap dynamically generated or LLM-provided strings in `Utils.escapeHtml` when concatenating them into HTML templates intended for `innerHTML`.
