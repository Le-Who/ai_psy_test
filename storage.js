/**
 * Storage Manager
 * ============================
 * Отвечает за сохранение тестов в localStorage и управление библиотекой.
 */

const Storage = {
    KEY: 'ai_test_gen_library_v1',

    // === DATA LOGIC ===

    /**
     * Получить все сохраненные тесты
     */
    getAll() {
        const raw = localStorage.getItem(this.KEY);
        return raw ? JSON.parse(raw) : [];
    },

    /**
     * Сохранить текущий тест
     */
    save(blueprint, questions, themeName) {
        const library = this.getAll();
        
        // Проверка на дубликаты (простая)
        const exists = library.some(t => t.theme === themeName && t.questions.length === questions.length);
        if (exists) return false; // Уже есть

        const newTest = {
            id: 'test_' + Date.now(),
            date: new Date().toLocaleDateString(),
            theme: themeName,
            blueprint: blueprint,
            questions: questions
        };

        library.unshift(newTest); // Добавляем в начало
        localStorage.setItem(this.KEY, JSON.stringify(library));
        return true;
    },

    /**
     * Удалить тест по ID
     */
    delete(id) {
        let library = this.getAll();
        library = library.filter(t => t.id !== id);
        localStorage.setItem(this.KEY, JSON.stringify(library));
    },

    /**
     * Найти тест по ID
     */
    getById(id) {
        const library = this.getAll();
        return library.find(t => t.id === id);
    },

    // === UI RENDERING ===

    /**
     * Генерирует HTML список для Library View
     */
    /**
     * Генерация HTML для списка библиотеки
     */
    renderLibraryHTML() {
        const list = this.getAll();
        if (list.length === 0) {
            return `<div style="text-align:center; padding:40px; color:var(--text-muted);">
                <div style="font-size:40px; margin-bottom:10px;">📭</div>
                Библиотека пуста.<br>Создайте свой первый тест!
            </div>`;
        }

        return list.map(test => {
            // Определяем иконку по типу
            const icon = (test.blueprint.testType === 'quiz') ? '🧠' : '🧩';
            const count = test.questions ? test.questions.length : 0;
            
            return `
            <div class="card" style="padding: 20px; display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div style="font-size: 24px;">${icon}</div>
                
                <div style="flex-grow: 1;">
                    <h3 style="margin: 0 0 5px; font-size: 16px; line-height: 1.4;">${test.theme}</h3>
                    <div style="font-size: 12px; color: var(--text-muted);">
                        ${test.date} • ${count} вопросов
                    </div>
                </div>

                <div style="display:flex; gap:10px; align-items: center;">
                    <button class="btn" onclick="app.loadSavedTest('${test.id}')" 
                        style="width: auto; padding: 8px 16px; font-size: 14px; white-space: nowrap; flex-shrink: 0;">
                        ▶ Начать
                    </button>
                    <button onclick="app.deleteTest('${test.id}')" 
                        style="background:none; border:none; cursor:pointer; font-size:18px; opacity:0.5; padding: 5px; flex-shrink: 0;"
                        title="Удалить">
                        🗑
                    </button>
                </div>
            </div>`;
        }).join('');
    }
            <button class="btn btn-secondary" onclick="app.setView('setup')" style="margin-top: 30px;">← Вернуться в меню</button>
        `;
    }
};
