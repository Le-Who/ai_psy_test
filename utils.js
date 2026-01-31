/**
 * Utility functions for the application.
 */
const Utils = {
    /**
     * Escapes special characters in a string to prevent XSS.
     * @param {string} unsafe - The string to escape.
     * @returns {string} The escaped string.
     */
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
