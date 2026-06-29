// API Handler
// Separated from app.js for better modularity
import { CONFIG, PROMPT_TEXTS } from "./app-settings.js";
import { Logger } from "./utils.js";

export const api = {
	detectProvider(key) {
		return key.startsWith("AIza") ? "gemini" : "openrouter";
	},

	safeParseJSON(text) {
		if (!text || typeof text !== "string") return text;
		try {
			return JSON.parse(text);
		} catch (_e) {
			// ⚡ Bolt: Removed slow greedy regex match(/\{[\s\S]*\}$/)
			// indexOf/lastIndexOf is O(N) instead of potentially O(N^2)
			const firstBrace = text.indexOf("{");
			const lastBrace = text.lastIndexOf("}");
			if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
				try {
					return JSON.parse(text.substring(firstBrace, lastBrace + 1));
				} catch (_e2) {
					Logger.saveLog({
						type: "error",
						message: _e2.message,
						context: "safeParseJSON_braces",
					});
				}
			}
			// ⚡ Bolt: Removed slow non-greedy regex match(/```json([\s\S]*?)```/)
			// indexOf is O(N) and prevents backtracking overhead on large text blobs
			const mdStart = text.indexOf("```json");
			const mdEnd = mdStart !== -1 ? text.indexOf("```", mdStart + 7) : -1;
			if (mdStart !== -1 && mdEnd !== -1) {
				try {
					return JSON.parse(text.substring(mdStart + 7, mdEnd));
				} catch (_e3) {
					Logger.saveLog({
						type: "error",
						message: _e3.message,
						context: "safeParseJSON_markdown",
					});
				}
			}
			throw new Error("JSON Parse Error");
		}
	},

	async call(task, prompt, schema, key) {
		const provider = this.detectProvider(key);
		const sysPrompt = PROMPT_TEXTS[task];
		console.log("API provider", provider, "task", task);

		// task: 'architect_psy', 'generator_psy', 'architect_quiz', 'generator_quiz'
		const isArchitect = task.startsWith("architect_");
		const mode = isArchitect ? "architect" : "generator";

		if (provider === "gemini") {
			return this.callGemini(sysPrompt, prompt, schema, mode, key);
		}
		return this.callOpenRouter(sysPrompt, prompt, schema, mode, key);
	},

	async callOpenRouter(sys, user, schema, type, key) {
		const model = CONFIG.providers.openrouter.models[type];
		const messages = [
			{ role: "system", content: sys },
			{
				role: "user",
				content:
					"Сгенерируй ответ в формате строго валидного JSON по этой JSON Schema:\n\n" +
					JSON.stringify(schema, null, 2) +
					"\n\n" +
					user,
			},
		];

		const res = await fetch(CONFIG.providers.openrouter.endpoint, {
			method: "POST",
			headers: CONFIG.providers.openrouter.headers(key),
			body: JSON.stringify({
				model,
				messages,
				response_format: { type: "json_object" },
				temperature: 0.7,
			}),
		});

		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(`OpenRouter API Error (${res.status}): ${errorText}`);
		}

		const data = await res.json();
		const content = data?.choices?.[0]?.message?.content;
		if (!content) {
			throw new Error(
				`Invalid response format from OpenRouter: ${JSON.stringify(data)}`,
			);
		}
		return this.safeParseJSON(content);
	},

	async callGemini(sys, user, schema, type, key) {
		const model = CONFIG.providers.gemini.models[type];
		const temperature = type === "architect" ? 0.5 : 0.7;

		const prompt =
			sys +
			"\n\n" +
			"Сгенерируй ответ в формате строго валидного JSON по этой JSON Schema:\n\n" +
			JSON.stringify(schema, null, 2) +
			"\n\n" +
			user;

		const res = await fetch(
			`${CONFIG.providers.gemini.endpoint + model}:generateContent?key=${key}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					generationConfig: {
						temperature,
						// при переходе на новый API можно добавить:
						// responseMimeType: "application/json"
					},
				}),
			},
		);

		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(`Gemini API Error (${res.status}): ${errorText}`);
		}

		const data = await res.json();
		const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
		if (!content) {
			throw new Error(
				`Invalid response format from Gemini: ${JSON.stringify(data)}`,
			);
		}
		return this.safeParseJSON(content);
	},
};
