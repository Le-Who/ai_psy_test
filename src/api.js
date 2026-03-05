// API Handler
// Separated from app.js for better modularity
import { CONFIG, PROMPT_TEXTS } from "./app-settings.js";

export const api = {
	detectProvider(key) {
		return key.startsWith("AIza") ? "gemini" : "openrouter";
	},

	safeParseJSON(text) {
		if (!text || typeof text !== "string") return text;
		try {
			return JSON.parse(text);
		} catch (e) {
			// Попытка вытащить JSON из markdown/текста
			const match = text.match(/\{[\s\S]*\}$/);
			if (match) {
				try {
					return JSON.parse(match[0]);
				} catch (e2) {}
			}
			const mdMatch = text.match(/```json([\s\S]*?)```/);
			if (mdMatch) {
				try {
					return JSON.parse(mdMatch[1]);
				} catch (e3) {}
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
				"Invalid response format from OpenRouter: " + JSON.stringify(data),
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
			CONFIG.providers.gemini.endpoint + model + ":generateContent?key=" + key,
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
				"Invalid response format from Gemini: " + JSON.stringify(data),
			);
		}
		return this.safeParseJSON(content);
	},
};
