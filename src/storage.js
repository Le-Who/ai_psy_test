/**
 * AI Universal Test Generator - Storage v4.0 (Final)
 * =================================================
 * Handles local saving, loading, and library rendering
 */

import { Utils } from "./utils.js";

export const AppStorage = {
	KEY: "ai_tests_library_v2",
	_cache: null,
	_htmlItems: null, // Array of HTML strings for each test card
	_renderedHtmlCache: null, // Cache for the full rendered library string
	_themesCache: null, // Cache for unique theme names (Set)

	/**
	 * Helper: Get or build themes Set for collision check
	 */
	_getThemes() {
		if (this._themesCache) return this._themesCache;
		const list = this.getAll();
		this._themesCache = new Set();
		for (const t of list) {
			this._themesCache.add(t.theme);
		}
		return this._themesCache;
	},

	/**
	 * Получить весь список тестов
	 */
	getAll() {
		if (this._cache) return this._cache;
		const data = localStorage.getItem(this.KEY);
		this._cache = data ? JSON.parse(data) : [];
		return this._cache;
	},

	/**
	 * Найти тест по ID
	 */
	getById(id) {
		const list = this.getAll();
		return list.find((t) => t.id === id);
	},

	/**
	 * Helper: Generate HTML for a single test item
	 */
	_renderTestItem(test) {
		// Определяем иконку по типу теста (quiz vs psy)
		// Если поле testType отсутствует (старые тесты), считаем psy
		const type = test.blueprint.testType || "categorical";
		const isQuiz = type === "quiz";
		const icon = isQuiz ? "🧠" : "🧩";

		const count = test.questions ? test.questions.length : 0;

		const shortUrlBlock = test.shortUrl
			? `
            <div style="margin-top:6px; font-size: 12px; color: var(--text-muted);">
                🔗 Короткая ссылка:&nbsp;
                <button class="btn-text list-action-btn" style="padding:0; font-size:12px;" data-action="copy-shorturl" data-url="${Utils.escapeHtml(test.shortUrl)}">
                    открыть / скопировать
                </button>
            </div>`
			: "";

		return `
        <div class="card" style="padding: 20px; display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 24px; flex-shrink: 0;">${icon}</div>

            <div style="flex-grow: 1; min-width: 0;"> <!-- min-width fix for flexbox truncation -->
                <h3 style="margin: 0 0 5px; font-size: 16px; line-height: 1.4; word-wrap: break-word;">${Utils.escapeHtml(test.theme)}</h3>
                <div style="font-size: 12px; color: var(--text-muted);">
                    ${Utils.escapeHtml(test.date)} • ${count} вопросов
                </div>
                ${shortUrlBlock}
            </div>

            <div style="display:flex; gap:10px; align-items: center; flex-shrink: 0;">
                <button class="btn list-action-btn" data-action="load-test" data-id="${test.id}"
                    style="width: auto; padding: 8px 16px; font-size: 14px; white-space: nowrap;"
                    aria-label="Начать тест: ${Utils.escapeHtml(test.theme)}">
                    ▶ Начать
                </button>
                <button class="btn-delete list-action-btn" data-action="delete-test" data-id="${test.id}"
                    title="Удалить"
                    aria-label="Удалить тест: ${Utils.escapeHtml(test.theme)}">
                    🗑
                </button>
            </div>
        </div>`;
	},

	/**
	 * Сохранить текущий тест (с авто-переименованием дубликатов)
	 * Возвращает итоговое имя теста
	 */
	save(blueprint, questions, themeName, shortUrl) {
		const library = this.getAll();

		// Логика авто-переименования: "Тест" -> "Тест (2)" -> "Тест (3)"
		let finalName = themeName;
		let counter = 2;

		// OPTIMIZATION: Use cached Set for O(1) lookup instead of O(N) rebuild every save
		const existingThemes = this._getThemes();

		while (existingThemes.has(finalName)) {
			finalName = `${themeName} (${counter})`;
			counter++;
		}

		const newTest = {
			id: "test_" + Date.now(),
			date: new Date().toLocaleDateString("ru-RU", {
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			}),
			theme: finalName,
			blueprint: blueprint,
			questions: questions,
			shortUrl: shortUrl || null,
		};

		// Добавляем в начало списка
		library.unshift(newTest);
		localStorage.setItem(this.KEY, JSON.stringify(library));

		// Update themes cache
		if (this._themesCache) {
			this._themesCache.add(finalName);
		}

		// OPTIMIZATION: Update htmlItems cache incrementally
		if (this._htmlItems) {
			const newItemHtml = this._renderTestItem(newTest);
			this._htmlItems.unshift(newItemHtml);

			// Update rendered cache if it exists
			if (this._renderedHtmlCache) {
				this._renderedHtmlCache = newItemHtml + this._renderedHtmlCache;
			}
		} else {
			// Force regeneration if htmlItems wasn't ready
			this._renderedHtmlCache = null;
		}

		return finalName;
	},

	/**
	 * Удалить тест по ID
	 */
	delete(id) {
		const list = this.getAll();
		const index = list.findIndex((t) => t.id === id);

		if (index > -1) {
			// Retrieve theme before deletion for cache update
			const deletedTheme = list[index].theme;

			// Remove from data cache
			list.splice(index, 1);
			localStorage.setItem(this.KEY, JSON.stringify(list));

			// Update themes cache
			if (this._themesCache) {
				this._themesCache.delete(deletedTheme);
			}

			// OPTIMIZATION: Remove from htmlItems cache incrementally
			if (this._htmlItems) {
				this._htmlItems.splice(index, 1);
			}

			// Invalidate rendered string because removing from middle is complex to patch
			this._renderedHtmlCache = null;
		}
	},

	/**
	 * Генерация HTML для списка библиотеки (UI)
	 */
	renderLibraryHTML() {
		const list = this.getAll();
		if (list.length === 0) {
			return `<div style="text-align:center; padding:40px; color:var(--text-muted);">
                <div style="font-size:40px; margin-bottom:10px;">📭</div>
                Библиотека пуста.<br>Создайте свой первый тест!
            </div>`;
		}

		// Check cache first
		if (this._renderedHtmlCache) {
			return this._renderedHtmlCache;
		}

		// Lazy load html cache
		if (!this._htmlItems || this._htmlItems.length !== list.length) {
			this._htmlItems = list.map((test) => this._renderTestItem(test));
		}

		this._renderedHtmlCache = this._htmlItems.join("");
		return this._renderedHtmlCache;
	},
};

// Listen for updates from other tabs to invalidate cache
if (typeof window !== "undefined") {
	window.addEventListener("storage", (e) => {
		if (e.key === AppStorage.KEY) {
			AppStorage._cache = null;
			AppStorage._htmlItems = null;
			AppStorage._renderedHtmlCache = null;
			AppStorage._themesCache = null;
		}
	});
}
