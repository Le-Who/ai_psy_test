/**
 * AI Universal Test Generator - Core Logic v5.5 (Final Polish)
 */

const TINY_TOKEN = 'lBjFvZGQQmPD56gcBpQBgdyMlezZCxwNShVIlh9wA3W4HFtDOI0418CnoXBx'; // Не забудьте вставить!

const api = {
    detectProvider(key) { return key.startsWith('AIza') ? 'gemini' : 'openrouter'; },
    safeParseJSON(text) { try { return JSON.parse(text); } catch (e) { const match = text.match(/(\{[^]*\}|\[[^]*\])/); if (match) try { return JSON.parse(match[0]); } catch (e2) {} const mdMatch = text.match(/```(?:json)?\s*([^]*?)\s*```/); if (mdMatch) try { return JSON.parse(mdMatch[1]); } catch (e3) {} throw new Error("JSON Parse Error"); } },
    async call(task, prompt, schema, key) { const provider = this.detectProvider(key); const sysPrompt = PROMPTS[provider][task]; console.log(`📡 API: ${provider} -> ${task}`); if (provider === 'gemini') return this.callGemini(sysPrompt, prompt, schema, 'generator', key); return this.callOpenRouter(sysPrompt, prompt, schema, 'generator', key); },
    async callOpenRouter(sys, user, schema, type, key) { const model = CONFIG.providers.openrouter.models[type]; const messages = [{ role: 'system', content: sys }, { role: 'user', content: user }]; const res = await fetch(CONFIG.providers.openrouter.endpoint, { method: 'POST', headers: CONFIG.providers.openrouter.headers(key), body: JSON.stringify({ model, messages, response_format: { type: "json_object" }, temperature: 0.7 }) }); const data = await res.json(); return this.safeParseJSON(data.choices[0].message.content); },
    async callGemini(sys, user, schema, type, key) { const model = CONFIG.providers.gemini.models[type]; const prompt = `${sys}\n\nFORMAT JSON:\n${JSON.stringify(schema)}\n\nTASK: ${user}`; const res = await fetch(`${CONFIG.providers.gemini.endpoint}${model}:generateContent?key=${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }); const data = await res.json(); return this.safeParseJSON(data.candidates[0].content.parts[0].text); }
};

const app = {
    state: {
        step: 0,
        mode: 'psy',        // 'psy' | 'quiz' | 'duel'
        answers: [],
        questions: [],
        blueprint: null,
        quizScore: 0,
        duelHostName: null,
        duelHostScore: null,
        duelHostResultName: null // Для пси-тестов: какой результат выпал автору
    },

    init() {
        this.checkHash();
        window.onpopstate = () => { history.replaceState(null, document.title, window.location.pathname); location.reload(); };
    },

    // --- ЛОГИКА SHARING / DUEL ---
    checkHash() {
        if (window.location.hash.startsWith('#d=')) {
            try {
                if (typeof LZString === 'undefined') throw new Error("LZString library not loaded");
                const compressed = window.location.hash.substring(3);
                const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
                const data = JSON.parse(decompressed);

                if (data && data.t && data.q) {
                    this.state.mode = 'duel'; // Включаем режим "по ссылке"
                    this.state.blueprint = data.t;
                    this.state.questions = data.q;
                    this.state.duelHostName = data.h || "Аноним";
                    this.state.duelHostScore = data.s || 0;
                    this.state.duelHostResultName = data.r || null; // Результат автора (для psy)

                    this.showDuelIntro();
                }
            } catch (e) {
                console.error("Link Error:", e);
                window.location.hash = "";
            }
        }
    },

    showDuelIntro() {
        document.getElementById('setupView').style.display = 'none';
        const dv = document.getElementById('duelView');
        const isQuiz = (this.state.blueprint.testType === 'quiz');

        // Тексты для разных режимов
        const title = isQuiz ? "ВЫЗОВ ПРИНЯТ! ⚔️" : "СМОТРИ МОЙ РЕЗУЛЬТАТ! 👀";
        let desc = "";

        if (isQuiz) {
            desc = `Пользователь <strong style="color:#fff;">${this.state.duelHostName}</strong> набрал <strong style="color:var(--accent);">${this.state.duelHostScore}</strong> баллов.<br>Сможешь его победить?`;
        } else {
            // Для Психотеста показываем, кто получился у автора (если есть инфа)
            const resultText = this.state.duelHostResultName ? `Ему выпало: <strong style="color:var(--accent);">${this.state.duelHostResultName}</strong>` : "Он уже прошел этот тест.";
            desc = `Пользователь <strong style="color:#fff;">${this.state.duelHostName}</strong> прошел тест.<br>${resultText}<br>А кто ты?`;
        }

        document.getElementById('duelView').querySelector('h1').innerText = title;
        document.getElementById('duelView').querySelector('p').innerHTML = desc;
        document.getElementById('duelThemeTitle').innerText = this.state.blueprint.theme || "Тест";
        document.getElementById('duelQCount').innerText = this.state.questions.length;
        
        dv.style.display = 'block';
    },

    startDuelTest() {
        document.getElementById('duelView').style.display = 'none';
        this.state.step = 0;
        this.state.answers = [];
        this.state.quizScore = 0;
        
        // Исправляем ошибку: восстанавливаем режим из blueprint
        // Если в blueprint тип 'quiz', то и режим ставим 'quiz' (или 'duel' для логики финала)
        const type = this.state.blueprint.testType || 'categorical';
        
        if (type === 'quiz') {
            this.state.mode = 'duel'; // Это викторина-дуэль
        } else {
            this.state.mode = 'psy'; // Это просто прохождение чужого пси-теста (не дуэль)
        }
        
        this.renderQ();
        this.setView('test');
    },

    // --- UI & LIBRARY ---
    openLibrary() {
        this.setView('library');
        document.getElementById('libraryContent').innerHTML = Storage.renderLibraryHTML();
    },
    closeLibrary() { this.setView('setup'); },

    setMode(mode) {
        this.state.mode = mode;
        document.getElementById('tabPsy').classList.toggle('active', mode === 'psy');
        document.getElementById('tabQuiz').classList.toggle('active', mode === 'quiz');
        document.getElementById('audienceGroup').style.display = mode === 'psy' ? 'block' : 'none';
        document.getElementById('difficultyGroup').style.display = mode === 'quiz' ? 'block' : 'none';
        document.getElementById('themeInput').placeholder = mode === 'psy' ? "Например: Кто ты из Вселенной Гарри Поттера?" : "Например: Знаток географии Европы";
    },

    async start(e) {
        if(e) e.preventDefault();
        this.state.step = 0;
        this.state.answers = [];
        this.state.quizScore = 0;
        this.state.blueprint = null;
        this.state.questions = [];
        this.state.duelHostName = null;

        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const theme = document.getElementById('themeInput').value;
        const notes = document.getElementById('notesInput').value;
        const count = document.getElementById('qCountInput').value;
        if(!apiKey) return alert("Введите API ключ!");

        const isQuiz = this.state.mode === 'quiz';
        const contextParam = isQuiz ? `Сложность: ${document.getElementById('difficultyInput').value}` : `Аудитория: ${document.getElementById('audienceInput').value}`;
        const taskSuffix = isQuiz ? '_quiz' : '_psy';
        
        this.setLoading(true, "🧠 Проектируем тест...");
        document.getElementById('errorBox').style.display = 'none';

        try {
            const archPrompt = `Тема: "${theme}". ${contextParam}. ${notes ? `Уточнения: "${notes}".` : ""} Создай структуру.`;
            this.state.blueprint = await api.call('architect' + taskSuffix, archPrompt, (isQuiz ? SCHEMAS.quiz_blueprint : SCHEMAS.psy_blueprint), apiKey);
            this.state.blueprint.theme = theme; 

            this.setLoading(true, "✍️ Пишем вопросы...");
            const optionsCount = isQuiz ? document.getElementById('difficultyInput').value : 0;
            const genPrompt = `Тема: ${theme}. Структура: ${JSON.stringify(this.state.blueprint.outcomes)}. Кол-во вопросов: ${count}. ${isQuiz ? `ВАЖНО: ${optionsCount} варианта ответа в каждом вопросе!` : ""} ${notes}`;
            
            const res = await api.call('generator' + taskSuffix, genPrompt, (isQuiz ? SCHEMAS.quiz_questions : SCHEMAS.psy_questions), apiKey);
            // Поддержка расширенного ответа (meta/scaleProfile/outcomes/questions)
            const hasNestedQuestions = res && typeof res === 'object' && Array.isArray(res.questions);
            this.state.questions = hasNestedQuestions ? res.questions : res;
            if (hasNestedQuestions) {
                if (res.meta) this.state.blueprint.meta = res.meta;
                if (res.scaleProfile) this.state.blueprint.scaleProfile = res.scaleProfile;
                if (Array.isArray(res.outcomes) && res.outcomes.length) this.state.blueprint.outcomes = res.outcomes;
            }
            
            this.setLoading(false);
            this.renderQ();
            this.setView('test');
        } catch (err) {
            console.error(err);
            this.setLoading(false);
            document.getElementById('errorBox').style.display = 'block';
            document.getElementById('errorBox').innerHTML = `Ошибка: ${err.message}`;
            this.setView('setup');
        }
    },

    // --- RENDER QUESTIONS ---
    renderQ() {
        const q = this.state.questions[this.state.step];
        const total = this.state.questions.length;
        // Проверяем: это викторина ИЛИ дуэль (но дуэль только если blueprint говорит что это quiz)
        const isQuizMode = (this.state.mode === 'quiz' || (this.state.mode === 'duel' && this.state.blueprint.testType === 'quiz'));

        document.getElementById('qNum').innerText = `${this.state.step + 1} / ${total}`;
        document.getElementById('qText').innerText = q.text;
        document.getElementById('progressBar').style.width = ((this.state.step / total) * 100) + '%';
        
        const backBtn = document.getElementById('backBtn');
        backBtn.style.visibility = (!isQuizMode && this.state.step > 0) ? 'visible' : 'hidden';

        const psyDiv = document.getElementById('psyContainer');
        const quizDiv = document.getElementById('quizContainer');

        if (isQuizMode) {
            psyDiv.style.display = 'none';
            quizDiv.style.display = 'flex'; // Flex, так как в CSS .quiz-grid display:flex
            
            let html = '';
            q.options.forEach((opt, idx) => {
                // ИСПРАВЛЕНИЕ: Используем правильный класс 'quiz-opt' из CSS
                html += `<button class="quiz-opt" onclick="app.handleQuizAnswer(${idx}, this)">${opt}</button>`;
            });
            quizDiv.innerHTML = html;
        } else {
            psyDiv.style.display = 'grid';
            quizDiv.style.display = 'none';
            
            // Сброс выделения
            const btns = psyDiv.querySelectorAll('.likert-opt'); 
            btns.forEach(b => b.classList.remove('selected'));
            const prevAns = this.state.answers[this.state.step];
            if (prevAns !== undefined && btns[prevAns-1]) btns[prevAns-1].classList.add('selected');
        }
    },

    answer(val) {
        this.state.answers[this.state.step] = parseInt(val);
        const btns = document.getElementById('psyContainer').querySelectorAll('.likert-opt');
        btns.forEach(b => b.classList.remove('selected'));
        if(btns[val-1]) btns[val-1].classList.add('selected');
        setTimeout(() => this.nextQuestion(), 300);
    },

    handleQuizAnswer(idx, btn) {
        const q = this.state.questions[this.state.step];
        const isCorrect = (idx === q.correctIndex);
        if (isCorrect) { btn.classList.add('correct'); this.state.quizScore++; }
        else { 
            btn.classList.add('wrong');
            const allBtns = document.querySelectorAll('.quiz-opt');
            if(allBtns[q.correctIndex]) allBtns[q.correctIndex].classList.add('correct');
        }
        
        // Добавляем класс disabled (в CSS он делает opacity: 0.7)
        document.querySelectorAll('.quiz-opt').forEach(b => {
             b.classList.add('disabled');
             b.disabled = true; // на всякий случай
        });

        setTimeout(() => this.nextQuestion(), 1200); 
    },

    nextQuestion() {
        if (this.state.step < this.state.questions.length - 1) {
            this.state.step++;
            this.renderQ();
        } else {
            this.calc();
            this.setView('results');
        }
    },
    
    prevQuestion() {
        if (this.state.step > 0) {
            this.state.step--;
            this.renderQ();
        }
    },

    // --- CALC RESULTS (FIXED) ---
    calc() {
        const getBaseScore = (ans, baseScoreMap) => {
            const a = (ans !== undefined && ans !== null) ? Number(ans) : 3;
            if (baseScoreMap && typeof baseScoreMap === 'object') {
                const v = baseScoreMap[String(a)];
                if (typeof v === 'number' && Number.isFinite(v)) return v;
            }
            // default linear mapping 1..5 -> 0..10
            return (a - 1) * 2.5;
        };

        const pickBandLabel = (bands, percent) => {
            if (!bands) return null;
            // Accept: [{label,min,max}], [{name,min,max}], {low:{min,max,label},...}
            if (Array.isArray(bands)) {
                for (const b of bands) {
                    if (!b || typeof b !== 'object') continue;
                    const min = (typeof b.min === 'number') ? b.min : (typeof b.from === 'number' ? b.from : null);
                    const max = (typeof b.max === 'number') ? b.max : (typeof b.to === 'number' ? b.to : null);
                    if (min === null || max === null) continue;
                    if (percent >= min && percent <= max) return b.label || b.name || b.title || null;
                }
                return null;
            }
            if (typeof bands === 'object') {
                for (const key of Object.keys(bands)) {
                    const b = bands[key];
                    if (!b || typeof b !== 'object') continue;
                    const min = (typeof b.min === 'number') ? b.min : (typeof b.from === 'number' ? b.from : null);
                    const max = (typeof b.max === 'number') ? b.max : (typeof b.to === 'number' ? b.to : null);
                    if (min === null || max === null) continue;
                    if (percent >= min && percent <= max) return b.label || b.name || key;
                }
            }
            return null;
        };

        const outcomes = this.state.blueprint.outcomes;
        const container = document.getElementById('resContent');
        let html = '';
        
        // Сохраняем имя результата для шаринга
        let winningResultName = "";

        // 1. ВИКТОРИНА (или Дуэль)
        if (this.state.mode === 'quiz' || (this.state.mode === 'duel' && this.state.blueprint.testType === 'quiz')) {
            const score = this.state.quizScore;
            const total = this.state.questions.length;
            let result = outcomes.find(o => score >= o.minScore && score <= o.maxScore) || outcomes[0];
            winningResultName = result.name;

            let duelBlock = '';
            if (this.state.mode === 'duel') {
                const hostScore = this.state.duelHostScore;
                const hostName = this.state.duelHostName;
                let verdict = "", color = "";
                if (score > hostScore) { verdict = "ТЫ ПОБЕДИЛ! 🏆"; color = "#4caf50"; }
                else if (score === hostScore) { verdict = "НИЧЬЯ! 🤝"; color = "#ffd700"; }
                else { verdict = "ТЫ ПРОИГРАЛ... 💀"; color = "#f44336"; }
                duelBlock = `<div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin:20px 0;">
                    <h3 style="margin:0 0 10px; color:${color};">${verdict}</h3>
                    <div style="display:flex; justify-content:space-around;"><div>👤 Ты: <strong>${score}</strong></div><div>🆚 ${hostName}: <strong>${hostScore}</strong></div></div>
                </div>`;
            }

            html = `<div style="text-align:center;">
                <div style="font-size:14px; color:var(--text-muted); margin-bottom:10px;">ТВОЙ РЕЗУЛЬТАТ</div>
                <h1 style="font-size:56px; margin:0; color:var(--primary);">${score} <span style="font-size:24px; color:var(--text-muted);">/ ${total}</span></h1>
                ${duelBlock}
                <h2 style="margin:15px 0 20px;">${result.name}</h2>
                <p style="font-size:18px;">${result.description}</p>
            </div>`;

        } else {
            // 2. ПСИХОЛОГИЧЕСКИЙ ТЕСТ
            const scores = {};
            const maxPossible = {}; // Максимально возможный балл по каждому исходу (raw max)
            const minPossible = {}; // Минимально возможный балл по каждому исходу (raw min)
            const scaleProfile = this.state.blueprint.scaleProfile || null;
            const baseScoreMap = scaleProfile && scaleProfile.baseScoreMap ? scaleProfile.baseScoreMap : null;
            const interpretationBands = scaleProfile && scaleProfile.interpretationBands ? scaleProfile.interpretationBands : null;
            
            outcomes.forEach(o => {
                scores[o.id] = 0;
                maxPossible[o.id] = 0;
                minPossible[o.id] = 0;
            });

            // Подсчёт с нормализацией
            this.state.questions.forEach((q, idx) => {
                const ans = this.state.answers[idx] !== undefined ? this.state.answers[idx] : 3;
                // Преобразуем ответ 1-5 в baseScore 0..10 (по scaleProfile.baseScoreMap или линейно)
                const baseScore = getBaseScore(ans, baseScoreMap);
                
                if (q.mapping) {
                    q.mapping.forEach(m => {
                        if (scores[m.outcomeId] !== undefined) {
                            // Учитываем "вес" (если AI передал), но нормализуем
                            const weight = m.weight || 1;
                            const polarity = weight > 0 ? 1 : -1;
                            // reverse item = инверсия ответа, не отрицательный вклад
                            const finalScore = polarity === 1 ? baseScore : (10 - baseScore);
                            
                            scores[m.outcomeId] += finalScore * Math.abs(weight);
                            // min всегда 0, max всегда 10 (после инверсии тоже 0..10)
                            minPossible[m.outcomeId] += 0;
                            maxPossible[m.outcomeId] += 10 * Math.abs(weight);
                        }
                    });
                }
            });

            // Конвертируем в проценты
            const percentages = {};
            outcomes.forEach(o => {
                // Если есть scaleProfile.outcomePotential с minRaw/maxRaw — используем их для нормировки
                const pot = scaleProfile && scaleProfile.outcomePotential ? scaleProfile.outcomePotential[o.id] : null;
                const minRaw = (pot && typeof pot.minRaw === 'number') ? pot.minRaw : minPossible[o.id];
                const maxRaw = (pot && typeof pot.maxRaw === 'number') ? pot.maxRaw : maxPossible[o.id];
                const denom = (maxRaw - minRaw);
                if (denom > 0) {
                    percentages[o.id] = Math.max(0, Math.min(100, Math.round(((scores[o.id] - minRaw) / denom) * 100)));
                } else {
                    percentages[o.id] = 0;
                }
            });

            // Диагностика шкал (если есть scaleProfile)
            let diagnosticsHtml = '';
            if (scaleProfile) {
                diagnosticsHtml += `<div class="diag-card">
                    <details open>
                        <summary class="diag-summary">🔬 Диагностика шкал (для автора)</summary>
                        <div class="diag-body">`;

                diagnosticsHtml += `<div class="diag-outcomes">`;
                outcomes.forEach(o => {
                    const pct = percentages[o.id] ?? 0;
                    const pot = scaleProfile.outcomePotential && scaleProfile.outcomePotential[o.id] ? scaleProfile.outcomePotential[o.id] : null;
                    const band = pickBandLabel(interpretationBands, pct);
                    const numItems = pot && typeof pot.numItems === 'number' ? pot.numItems : (pot && pot.count) || '';
                    const numReverseItems = pot && typeof pot.numReverseItems === 'number' ? pot.numReverseItems : '';
                    const sumAbsWeight = pot && typeof pot.sumAbsWeight === 'number' ? pot.sumAbsWeight.toFixed(2) : '';

                    diagnosticsHtml += `
                        <div class="diag-row">
                            <div class="diag-row-main">
                                <div class="diag-title">${o.name}</div>
                                <div class="diag-sub">
                                    <span>${pct}%${band ? ` • ${band}` : ``}</span>
                                </div>
                            </div>
                            <div class="diag-meta">
                                ${sumAbsWeight ? `<span class="diag-pill">∑|w|: ${sumAbsWeight}</span>` : ``}
                                ${numItems !== '' ? `<span class="diag-pill">items: ${numItems}</span>` : ``}
                                ${numReverseItems !== '' ? `<span class="diag-pill">reverse: ${numReverseItems}</span>` : ``}
                            </div>
                        </div>`;
                });
                diagnosticsHtml += `</div>`;

                if (scaleProfile.qualityChecks) {
                    const qcStr = (() => {
                        try { return JSON.stringify(scaleProfile.qualityChecks, null, 2); }
                        catch { return String(scaleProfile.qualityChecks); }
                    })();
                    diagnosticsHtml += `
                        <div class="diag-qc">
                            <div class="diag-qc-title">Проверки качества (qualityChecks)</div>
                            <pre class="diag-code">${qcStr}</pre>
                        </div>`;
                }

                diagnosticsHtml += `</div></details></div>`;
            }

            if (this.state.blueprint.testType !== 'dimensional') {
                // Сортируем результаты по очкам
                const sorted = outcomes.sort((a,b) => scores[b.id] - scores[a.id]);
                const win = sorted[0];
                winningResultName = win.name;
                const band = pickBandLabel(interpretationBands, percentages[win.id]);

                html = `<div style="text-align:center; padding-bottom: 20px;">
                    <div style="font-size:12px; text-transform:uppercase; color:var(--text-muted); margin-bottom:10px;">Твой результат</div>
                    <h2 style="font-size:32px; margin:0 0 10px; color:var(--primary);">${win.name}</h2>
                    <p style="font-size:18px; line-height:1.6;">${win.description}</p>
                    <div style="margin-top:15px; font-size:28px; color:var(--accent); font-weight:bold;">${percentages[win.id]}% совпадение</div>
                    ${band ? `<div style="margin-top:8px; color:var(--text-muted); font-weight:600;">Интерпретация: ${band}</div>` : ``}
                </div>
                
                <!-- ВОССТАНОВЛЕННЫЙ БЛОК: Другие варианты -->
                <div class="results-secondary-block">
                    <h4 class="results-secondary-title">Другие варианты:</h4>`;
                
                sorted.slice(1).forEach(o => {
                    const pct = percentages[o.id];
                    const b = pickBandLabel(interpretationBands, pct);
                    html += `
                    <div class="res-item">
                        <div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:5px;">
                            <span><strong>${o.name}</strong></span>
                            <span style="color:var(--primary); font-weight:600; font-size:15px;">${pct}%${b ? ` • ${b}` : ``}</span>
                        </div>
                        <div class="res-bar-bg">
                            <div class="res-bar-fill" style="width:${pct}%"></div>
                        </div>
                    </div>`;
                });
                html += `</div>`; // закрываем блок "Другие варианты"
                html += diagnosticsHtml;

            } else {
                // Dimensional (Профиль)
                html = `<div style="text-align:center; margin-bottom:25px;"><h2>Ваш профиль</h2></div>`;
                outcomes.forEach(o => {
                    const pct = percentages[o.id];
                    const band = pickBandLabel(interpretationBands, pct);
                    html += `<div class="res-item">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <strong>${o.name}</strong>
                            <span style="color:var(--primary); font-weight:600; font-size:16px;">${pct}%${band ? ` • ${band}` : ``}</span>
                        </div>
                        <div class="res-bar-bg">
                            <div class="res-bar-fill" style="width:${pct}%"></div>
                        </div>
                    </div>`;
                });
                html += diagnosticsHtml;
            }
        }
        
        // Сохраняем результат в стейт (для шаринга)
        this.state.lastResultName = winningResultName;

        // Кнопки
        const isQuiz = (this.state.mode === 'quiz' || (this.state.mode === 'duel' && this.state.blueprint.testType === 'quiz'));
        const shareBtnText = isQuiz ? "⚔️ Бросить вызов" : "📤 Поделиться результатом";

        html += `
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:30px;">
            <button id="saveTestBtn" class="btn" onclick="app.saveTest()" style="flex:1;">💾 Сохранить</button>
            <button id="shareBtn" class="btn" onclick="app.createShareLink()" style="flex:1; background: var(--accent);">${shareBtnText}</button>
        </div>`;
        
        container.innerHTML = html;
    },

    async createShareLink() {
        if(!TINY_TOKEN) return alert("Нужен TinyURL Token!");
        
        const btn = document.getElementById('shareBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = "⏳ Создаем ссылку...";
        btn.disabled = true;

        try {
            const isQuiz = (this.state.blueprint.testType === 'quiz'); // Смотрим на тип теста, а не режим
            const score = this.state.quizScore;
            const name = prompt("Твое имя:", "Аноним") || "Аноним";

            const payload = { 
                h: name, 
                s: (isQuiz ? score : 0), 
                r: (isQuiz ? null : this.state.lastResultName), // Передаем результат автора для psy
                t: this.state.blueprint, 
                q: this.state.questions 
            };
            
            if(!payload.t.theme) payload.t.theme = document.getElementById('themeInput').value || "Тест";

            const jsonString = JSON.stringify(payload);
            const compressed = LZString.compressToEncodedURIComponent(jsonString);
            const longUrl = `${window.location.origin}${window.location.pathname}#d=${compressed}`;

            const response = await fetch('https://api.tinyurl.com/create', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${TINY_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: longUrl, domain: "tiny.one" })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            
            const msg = isQuiz ? "Ссылка на дуэль готова:" : "Ссылка на тест готова:";
            prompt(msg, data.data.tiny_url);

        } catch (e) {
            console.error(e);
            alert("Ошибка создания ссылки!");
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },
    
    async saveTest() {
        const theme = this.state.blueprint.theme || document.getElementById('themeInput').value || "Тест";
        let shortUrl = null;

        // Пытаемся аккуратно сгенерировать короткую ссылку, как в "Поделиться/Дуэль".
        // Если что-то пойдет не так — просто сохраняем тест без ссылки.
        try {
            if (typeof LZString !== 'undefined' && TINY_TOKEN) {
                const isQuiz = (this.state.blueprint.testType === 'quiz');
                const score = this.state.quizScore;

                const payload = { 
                    h: "Аноним", 
                    s: (isQuiz ? score : 0), 
                    r: (isQuiz ? null : this.state.lastResultName || null),
                    t: this.state.blueprint, 
                    q: this.state.questions 
                };

                if (!payload.t.theme) payload.t.theme = theme;

                const jsonString = JSON.stringify(payload);
                const compressed = LZString.compressToEncodedURIComponent(jsonString);
                const longUrl = `${window.location.origin}${window.location.pathname}#d=${compressed}`;

                const response = await fetch('https://api.tinyurl.com/create', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${TINY_TOKEN}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: longUrl, domain: "tiny.one" })
                });

                if (response.ok) {
                    const data = await response.json();
                    shortUrl = data && data.data && data.data.tiny_url ? data.data.tiny_url : null;
                }
            }
        } catch (e) {
            console.warn("Short link generation failed (saveTest):", e);
        }

        const name = Storage.save(this.state.blueprint, this.state.questions, theme, shortUrl);
        alert(`Тест сохранен!`);
        const btn = document.getElementById('saveTestBtn');
        if (btn) {
            btn.innerText = "✅ Сохранено";
            btn.disabled = true;
        }
    },
    
    loadSavedTest(id) {
        const test = Storage.getById(id);
        if(!test) return;
        this.state.blueprint = test.blueprint;
        this.state.questions = test.questions;
        // Восстанавливаем режим на основе типа теста
        this.state.mode = (test.blueprint.testType === 'quiz') ? 'quiz' : 'psy';
        
        this.state.step = 0;
        this.state.answers = [];
        this.state.quizScore = 0;
        this.renderQ();
        this.setView('test');
    },

    deleteTest(id) {
        if(confirm('Удалить?')) { Storage.delete(id); this.openLibrary(); }
    },

    setView(view) {
        ['setupView', 'testView', 'resultsView', 'libraryView', 'duelView'].forEach(v => {
            const el = document.getElementById(v); if(el) el.style.display = 'none';
        });
        document.getElementById(view + 'View').style.display = 'block';
    },

    setLoading(active, text) {
        const el = document.getElementById('loadingOverlay');
        if(el) { el.style.display = active ? 'flex' : 'none'; if(text) document.getElementById('loadingText').innerText = text; }
    }
};

window.onload = () => app.init();
