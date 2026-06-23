## 2025-06-23 - XSS in Diagnostic Quality Checks
**Vulnerability:** XSS vulnerability in `src/app.js` when rendering the `scaleProfile.qualityChecks` diagnostic output. The AI-generated payload (which an attacker could forge in Duel mode or manipulate locally) was directly interpolated into innerHTML as `qcText` without escaping.
**Learning:** Even diagnostic information originating from LLMs (which acts like user input in this architecture) must be sanitized before rendering to innerHTML, because malicious payloads can be shared or injected via `#d=` links.
**Prevention:** Always wrap dynamically generated diagnostic or API-returned strings with `Utils.escapeHtml()` before interpolating them into HTML templates.
