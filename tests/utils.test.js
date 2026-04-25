import { describe, expect, it } from "vitest";
import { Utils } from "../src/utils.js";

describe("Utils", () => {
	describe("escapeHtml", () => {
		it("should escape special characters to prevent XSS", () => {
			const malicious = '<script>alert("XSS")</script>&"\'';
			const safe = Utils.escapeHtml(malicious);
			expect(safe).toBe(
				"&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&amp;&quot;&#039;",
			);
		});

		it("should handle null and undefined safely", () => {
			expect(Utils.escapeHtml(null)).toBe(null);
			expect(Utils.escapeHtml(undefined)).toBe(undefined);
		});

		it("should correctly stringify and escape arrays to prevent bypass", () => {
			const maliciousArray = ['<script>alert("XSS")</script>'];
			const safe = Utils.escapeHtml(maliciousArray);
			expect(safe).toBe("&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;");
		});
	});
});
