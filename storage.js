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
    renderLibraryHTML() {
        const tests = this.getAll();
        
        if (tests.length === 0) {
            return `
                <div style="text-align:center; padding: 40px; color: #64748b;">
                    <div style="font-size: 40px; margin-bottom: 10px;">📭</div>
                    <h3>Библиотека пуста</h3>
                    <p>Пройдите генерацию теста, и в конце вы сможете сохранить его сюда.</p>
                    <button class="btn" onclick="app.switchView('setup')" style="margin-top:20px; max-width:200px;">Создать тест</button>
                </div>
            `;
        }

        return `
            <h2 style="margin-top:0; margin-bottom: 20px;">Мои тесты (${tests.length})</h2>
            <div style="display: grid; gap: 15px;">
                ${tests.map(test => `
                    <div class="card" style="margin:0; padding: 20px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:bold; font-size:16px;">${test.theme}</div>
                            <div style="font-size:12px; color:#64748b; margin-top:4px;">
                                ${test.date} • ${test.questions.length} вопросов • ${test.blueprint.testType}
                            </div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button onclick="app.loadSavedTest('${test.id}')" class="btn" style="padding: 8px 16px; width:auto; font-size:13px;">▶ Начать</button>
                            <button onclick="app.deleteTest('${test.id}')" class="btn btn-secondary" style="padding: 8px 12px; width:auto; color: #ef4444;">🗑</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="app.switchView('setup')" style="margin-top: 30px;">← Вернуться в меню</button>
        `;
    }
};
