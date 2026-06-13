## 2024-06-13 - JSON.stringify XSS vulnerability in template literals
**Vulnerability:** XSS vulnerability caused by injecting unescaped `JSON.stringify` output directly into HTML template literals.
**Learning:** `JSON.stringify` does not escape HTML special characters. When rendering JSON objects or arrays into HTML, the stringified value can break out of the HTML tags or introduce malicious scripts if it contains unsanitized user input.
**Prevention:** Always pass the output of `JSON.stringify` through an HTML escaping function (like `Utils.escapeHtml()`) before injecting it into the DOM via innerHTML or template literals.
