## 2025-06-15 - JSON Serialization XSS Vulnerability
**Vulnerability:** XSS vulnerability through unsanitized JSON serialized text in diagnostics UI.
**Learning:** JSON.stringify() does not escape HTML special characters. Using it directly in innerHTML allows arbitrary script execution if the JSON contains HTML tags.
**Prevention:** Always pass JSON stringified values through Utils.escapeHtml() when rendering them into HTML templates.
