import { api } from "./api.js";
import { SCHEMAS } from "./app-settings.js";
import { Scoring } from "./scoring.js";
import { AppStorage } from "./storage.js";
import { store, subscribe } from "./store.js";
import { Logger, togglePasswordVisibility, Utils } from "./utils.js";
import { validatePsyOutput } from "./validator.js";

// AI Universal Test Generator - Core Logic v6.0 Final
// UI/UX Polish, Features: Glassmorphism, Clipboard API, Confetti, Toast Notifications

export const app = {
	get state() {
		return store;
	},

	ui: {},

	// =========================
	// INIT
	// =========================

	initUI() {
		// Views
		this.ui.setupView = document.getElementById("setupView");
		this.ui.testView = document.getElementById("testView");
		this.ui.resultsView = document.getElementById("resultsView");
		this.ui.libraryView = document.getElementById("libraryView");
		this.ui.duelView = document.getElementById("duelView");

		// Test Elements
		this.ui.qNum = document.getElementById("qNum");
		this.ui.qText = document.getElementById("qText");
		this.ui.progressBar = document.getElementById("progressBar");
		this.ui.backBtn = document.getElementById("backBtn");
		this.ui.psyContainer = document.getElementById("psyContainer");
		this.ui.quizContainer = document.getElementById("quizContainer");
		this.ui.inProgressSaveBtn = document.getElementById("inProgressSaveBtn");
		this.ui.inProgressShareBtn = document.getElementById("inProgressShareBtn");
		this.ui.loadingOverlay = document.getElementById("loadingOverlay");
		this.ui.loadingText = document.getElementById("loadingText");

		// Static Psy Buttons
		this.ui.psyButtons = this.ui.psyContainer.querySelectorAll(".likert-opt");
	},

	init() {
		if (typeof Logger !== "undefined") Logger.init();
		this.initUI();

		const savedKey = localStorage.getItem("user_api_key");
		if (savedKey) {
			const input = /** @type {HTMLInputElement | null} */ (
				document.getElementById("apiKeyInput")
			);
			if (input) input.value = savedKey;
		}
		this.checkHash();
		this.runDuelHashRegressionCheck();

		window.onpopstate = () => {
			history.replaceState(null, document.title, window.location.pathname);
			location.reload();
		};

		// Слушатели
		const form = document.getElementById("setupForm");
		if (form) form.addEventListener("submit", (e) => this.start(e));

		document
			.getElementById("tabPsy")
			?.addEventListener("click", () => this.setMode("psy"));
		document
			.getElementById("tabQuiz")
			?.addEventListener("click", () => this.setMode("quiz"));

		document
			.getElementById("backBtn")
			?.addEventListener("click", () => this.prevQuestion());
		document
			.getElementById("psyContainer")
			?.addEventListener("click", (e) => this.handlePsyClick(e));

		// Event Delegation for data-action buttons
		document.addEventListener("click", (e) => {
			/** @type {HTMLElement | null} */
			const btn = e.target.closest("[data-action]");
			if (!btn) return;
			const action = btn.dataset.action;

			if (action === "togglePassword") {
				const targetId = btn.dataset.target;
				togglePasswordVisibility(targetId, btn);
			} else if (action === "closeLibrary") {
				this.closeLibrary();
			} else if (action === "startDuel") {
				this.startDuelTest();
			} else if (action === "prevQuestion") {
				this.prevQuestion();
			} else if (action === "saveTestBtn") {
				this.saveTest(btn);
			} else if (action === "createShareLink") {
				this.createShareLink(btn);
			} else if (action === "load-test") {
				this.loadSavedTest(btn.dataset.id);
			} else if (action === "delete-test") {
				this.deleteTest(btn.dataset.id, btn);
			} else if (action === "copy-shorturl") {
				const url = btn.dataset.url;
				if (navigator.clipboard && window.isSecureContext) {
					navigator.clipboard
						.writeText(url)
						.then(() => this.showToast("Ссылка скопирована! 📋"));
				} else {
					prompt("Ссылка:", url);
				}
			} else if (action === "quizAnswer") {
				this.handleQuizAnswer(parseInt(btn.dataset.index, 10), btn);
			}
		});

		document
			.getElementById("openLibraryBtn")
			?.addEventListener("click", () => this.openLibrary());

		// --- PUB/SUB REACTIVE STATE ---
		subscribe((prop, value, target) => {
			// 1. Reactive Test Rendering
			if (prop === "step" || prop === "questions") {
				if (target.questions && target.questions.length > 0) {
					if (target.step < target.questions.length) {
						this.renderQ();
						this.setView("test");
					} else {
						this.calc();
						this.setView("results");
					}
				}
			}

			// 2. Reactive UI Mode Toggle
			if (prop === "mode") {
				document
					.getElementById("tabPsy")
					?.classList.toggle("active", value === "psy");
				document
					.getElementById("tabQuiz")
					?.classList.toggle("active", value === "quiz");

				const audGrp = document.getElementById("audienceGroup");
				const diffGrp = document.getElementById("difficultyGroup");
				if (audGrp) audGrp.style.display = value === "psy" ? "block" : "none";
				if (diffGrp)
					diffGrp.style.display = value === "quiz" ? "block" : "none";

				const thmInput = document.getElementById("themeInput");
				if (thmInput)
					thmInput.placeholder =
						value === "psy"
							? "Тема психологического теста..."
							: "Тема викторины...";
			}
		});

		this.setView("setup");
	},

	// =========================
	// NORMALIZATION
	// =========================

	normalizePsyQuestions(questions) {
		const ALLOWED_WEIGHTS = [-2.0, -1.0, -0.5, 0.5, 1.0, 2.0];

		const snapWeight = (w) => {
			const num = Number(w);
			if (!Number.isFinite(num)) return 1.0;
			let best = ALLOWED_WEIGHTS[0];
			let bestDiff = Math.abs(num - best);
			for (let i = 1; i < ALLOWED_WEIGHTS.length; i++) {
				const d = Math.abs(num - ALLOWED_WEIGHTS[i]);
				if (d < bestDiff) {
					bestDiff = d;
					best = ALLOWED_WEIGHTS[i];
				}
			}
			return best;
		};

		if (!Array.isArray(questions)) return questions;

		return questions.map((q) => {
			if (!q || !Array.isArray(q.mapping)) return q;
			let mapping = q.mapping
				.filter((m) => m && typeof m.outcomeId === "string")
				.map((m) => {
					const weight = snapWeight(m.weight);
					return { ...m, weight };
				});

			if (mapping.length === 0) return q;

			if (mapping.length > 2) {
				mapping.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
				mapping = mapping.slice(0, 2);
			}

			if (!q.polarity) {
				let hasPos = false;
				let hasNeg = false;
				for (const m of mapping) {
					if (m.weight > 0) hasPos = true;
					else if (m.weight < 0) hasNeg = true;
					if (hasPos && hasNeg) break;
				}
				let polarity = "direct";
				if (hasPos && hasNeg) polarity = "mixed";
				else if (hasNeg && !hasPos) polarity = "reverse";
				q.polarity = polarity;
			}

			return { ...q, mapping };
		});
	},

	// =========================
	// TOAST
	// =========================

	showToast(message) {
		const x = document.getElementById("toast");
		if (!x) return;
		x.innerText = message;
		x.className = "show";
		setTimeout(() => {
			x.className = x.className.replace("show", "");
		}, 3000);
	},

	// =========================
	// DUEL SHARE / HASH
	// =========================

	async extractDuelPayloadFromHash(hash) {
		if (typeof hash !== "string") return null;

		const supportedPrefixes = ["#d=", "#d:"];
		const prefix = supportedPrefixes.find((pfx) => hash.startsWith(pfx));
		if (!prefix) return null;

		const { default: LZString } = await import("./lib/lz-string.js");

		const compressed = hash.substring(prefix.length);
		const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
		if (!decompressed) return null;

		const data = JSON.parse(decompressed);
		if (!data || !data.t || !data.q) return null;

		return data;
	},

	async buildDuelHashFromPayload(payload) {
		const { default: LZString } = await import("./lib/lz-string.js");

		const jsonString = JSON.stringify(payload);
		const compressed = LZString.compressToEncodedURIComponent(jsonString);
		return `#d=${compressed}`;
	},

	async runDuelHashRegressionCheck() {
		try {
			const payload = {
				h: "Regression",
				s: 1,
				r: null,
				t: { theme: "Regression", testType: "quiz" },
				q: [{ text: "Q1" }],
			};

			const canonicalHash = await this.buildDuelHashFromPayload(payload);
			const legacyHash = canonicalHash.replace("#d=", "#d:");
			const parsedCanonical =
				await this.extractDuelPayloadFromHash(canonicalHash);
			const parsedLegacy = await this.extractDuelPayloadFromHash(legacyHash);
			const rebuiltFromLegacy =
				await this.buildDuelHashFromPayload(parsedLegacy);

			const passed =
				canonicalHash.startsWith("#d=") &&
				!!parsedCanonical &&
				!!parsedLegacy &&
				rebuiltFromLegacy.startsWith("#d=");

			if (!passed) {
				console.error("Duel hash regression check failed");
			}
		} catch (e) {
			console.error("Duel hash regression check failed", e);
		}
	},

	async checkHash() {
		if (
			window.location.hash.startsWith("#d=") ||
			window.location.hash.startsWith("#d:")
		) {
			try {
				const data = await this.extractDuelPayloadFromHash(
					window.location.hash,
				);

				if (data) {
					this.state.mode = "duel";
					this.state.blueprint = data.t;
					this.state.questions = data.q;
					this.state.duelHostName = data.h;
					this.state.duelHostScore = data.s ?? 0;
					this.state.duelHostResultName = data.r ?? null;
					this.showDuelIntro();
					return;
				}
			} catch (e) {
				console.error("Link Error", e);
			}
			window.location.hash = "";
		}
	},

	showDuelIntro() {
		document.getElementById("setupView").style.display = "none";
		const dv = document.getElementById("duelView");

		const isQuiz = this.state.blueprint.testType === "quiz";
		const title = isQuiz ? "Викторина-домашка" : "Дуэль-тест";

		let desc;
		if (isQuiz) {
			desc = `<strong style="color:#fff">${Utils.escapeHtml(this.state.duelHostName)}</strong> вызвал(а) тебя на викторину!`;
		} else {
			const resultText = this.state.duelHostResultName
				? `<strong style="color:var(--accent)">${Utils.escapeHtml(this.state.duelHostResultName)}</strong>`
				: "";
			desc = `<strong style="color:#fff">${Utils.escapeHtml(this.state.duelHostName)}</strong> уже прошёл(ла) этот тест. ${resultText ? "<br>" + resultText : ""}`;
		}

		const dvH1 = dv.querySelector("h1");
		if (dvH1) dvH1.innerText = title;
		const dvP = dv.querySelector("p");
		if (dvP) dvP.innerHTML = desc;

		document.getElementById("duelThemeTitle").innerText =
			this.state.blueprint.theme || "";
		document.getElementById("duelQCount").innerText =
			this.state.questions.length.toString();

		dv.style.display = "block";

		const startBtn = document.getElementById("duelStartBtn");
		if (startBtn) {
			startBtn.onclick = () => this.startDuelTest();
		}
	},

	startDuelTest() {
		document.getElementById("duelView").style.display = "none";
		this.state.answers = [];
		this.state.quizScore = 0;

		const type = this.state.blueprint.testType || "categorical";
		if (type === "quiz") {
			this.state.mode = "duel";
		} else {
			this.state.mode = "duel";
		}

		this.state.step = 0; // Reactive boundary
	},

	// =========================
	// UI LIBRARY
	// =========================

	openLibrary() {
		this.setView("library");
		const el = document.getElementById("libraryContent");
		if (el) el.innerHTML = AppStorage.renderLibraryHTML();
	},

	closeLibrary() {
		this.setView("setup");
	},

	setMode(mode) {
		this.state.mode = mode; // Handled by proxy subscription
	},

	// =========================
	// START
	// =========================

	async start(e) {
		e.preventDefault();

		this.state.step = 0;
		this.state.answers = [];
		this.state.quizScore = 0;
		this.state.blueprint = null;
		this.state.questions = [];
		this.state.duelHostName = null;

		const apiKey = /** @type {HTMLInputElement} */ (
			document.getElementById("apiKeyInput")
		).value.trim();
		const theme = /** @type {HTMLInputElement} */ (
			document.getElementById("themeInput")
		).value.trim();
		const notes = /** @type {HTMLInputElement} */ (
			document.getElementById("notesInput")
		).value;
		const count = /** @type {HTMLInputElement} */ (
			document.getElementById("qCountInput")
		).value;

		if (!theme) {
			this.showToast("Введите тему теста! 📝");
			document.getElementById("themeInput").focus();
			return;
		}

		if (!apiKey) {
			this.showToast("API ключ обязателен! 🔑");
			document.getElementById("apiKeyInput").focus();
			return;
		}
		localStorage.setItem("user_api_key", apiKey);

		const isQuiz = this.state.mode === "quiz";
		const contextParam = isQuiz
			? /** @type {HTMLInputElement} */ (
					document.getElementById("difficultyInput")
				).value
			: /** @type {HTMLInputElement} */ (
					document.getElementById("audienceInput")
				).value;

		const taskSuffix = isQuiz ? "quiz" : "psy";

		let attempts = 0;
		const maxAttempts = 3;
		let lastError = null;

		document.getElementById("errorBox").style.display = "none";

		while (attempts < maxAttempts) {
			attempts++;
			this.setLoading(
				true,
				attempts === 1
					? "Генерируем архитектуру теста..."
					: `Исправляем ошибки AI (Попытка ${attempts}/${maxAttempts})...`,
			);

			try {
				let archPrompt = `${theme}.\nКонтекст: ${contextParam}.\nДоп. заметки: ${notes || "нет"}.`;

				if (attempts > 1 && lastError) {
					archPrompt += `\n\nВНИМАНИЕ! Твой предыдущий ответ вызвал ошибку проверки: ${lastError.message}\nПожалуйста, исправь эту ошибку и верни строго валидный JSON по схеме.`;
				}

				this.state.blueprint = await api.call(
					"architect_" + taskSuffix,
					archPrompt,
					isQuiz ? SCHEMAS.quiz_blueprint : SCHEMAS.psy_blueprint,
					apiKey,
				);

				validatePsyOutput(this.state.blueprint, isQuiz, true);

				this.state.blueprint.theme = theme;

				this.setLoading(true, "Генерируем вопросы...");

				const optionsCount = isQuiz
					? Number(
							/** @type {HTMLInputElement} */ (
								document.getElementById("difficultyInput")
							).value || 0,
						)
					: 0;

				let genPrompt = `${theme}\nBLUEPRINT:\n${JSON.stringify(this.state.blueprint, null, 2)}\nQUESTIONS_COUNT: ${count}\n${isQuiz ? `QUIZ_OPTIONS: ${optionsCount}` : ""}\nNOTES: ${notes || "нет"}`;

				if (attempts > 1 && lastError && this.state.blueprint) {
					genPrompt += `\n\nВНИМАНИЕ! Твой предыдущий ответ вызвал ошибку проверки: ${lastError.message}\nПожалуйста, исправь эту ошибку и сгенерируй строго валидный JSON по схеме.`;
				}

				const res = await api.call(
					"generator_" + taskSuffix,
					genPrompt,
					isQuiz ? SCHEMAS.quiz_questions : SCHEMAS.psy_questions,
					apiKey,
				);

				const hasNestedQuestions =
					res && typeof res === "object" && Array.isArray(res.questions);
				const questionsList = hasNestedQuestions ? res.questions : res;

				validatePsyOutput(res, isQuiz, false);

				this.state.questions = questionsList;

				if (hasNestedQuestions) {
					if (res.meta) this.state.blueprint.meta = res.meta;
					if (res.scaleProfile)
						this.state.blueprint.scaleProfile = res.scaleProfile;
					if (Array.isArray(res.outcomes) && res.outcomes.length) {
						this.state.blueprint.outcomes = res.outcomes;
					}
				}

				if (!isQuiz && Array.isArray(this.state.questions)) {
					this.state.questions = this.normalizePsyQuestions(
						this.state.questions,
					);
				}

				// Успех! Выходим из цикла retry
				break;
			} catch (err) {
				lastError = err;
				console.warn(`Attempt ${attempts} failed:`, err);
				if (attempts >= maxAttempts) {
					this.setLoading(false);
					const box = document.getElementById("errorBox");
					box.style.display = "block";
					box.textContent = err.message || "Ошибка генерации";
					this.setView("setup");
					return;
				}
			}
		}

		this.setLoading(false);
	},

	// =========================
	// RENDER QUESTIONS
	// =========================

	renderQ() {
		const q = this.state.questions[this.state.step];
		if (!q) return;

		const total = this.state.questions.length;
		const isQuizMode =
			this.state.mode === "quiz" ||
			(this.state.mode === "duel" && this.state.blueprint.testType === "quiz");

		// OPTIMIZATION: Use cached UI elements
		if (this.ui.qNum)
			this.ui.qNum.innerText =
				(this.state.step + 1).toString() + "/" + total.toString();
		if (this.ui.qText) this.ui.qText.innerText = q.text;

		if (this.ui.progressBar) {
			const percentage = Math.round(((this.state.step + 1) / total) * 100);
			this.ui.progressBar.style.width = percentage + "%";
			this.ui.progressBar.setAttribute("aria-valuenow", percentage.toString());
		}

		this.updateInProgressActions();

		const backBtn = this.ui.backBtn;
		if (backBtn)
			backBtn.style.visibility =
				!isQuizMode && this.state.step > 0 ? "visible" : "hidden";

		const psyDiv = this.ui.psyContainer;
		const quizDiv = this.ui.quizContainer;

		if (isQuizMode) {
			if (psyDiv) psyDiv.style.display = "none";
			if (quizDiv) {
				quizDiv.style.display = "flex";
				let html = "";
				q.options.forEach((opt, idx) => {
					html += `<button class="quiz-opt" data-action="quizAnswer" data-index="${idx}">${Utils.escapeHtml(opt)}</button>`;
				});
				quizDiv.innerHTML = html;
			}
		} else {
			if (psyDiv) psyDiv.style.display = "grid";
			if (quizDiv) quizDiv.style.display = "none";

			const btns = this.ui.psyButtons;
			if (btns) {
				btns.forEach((b) => {
					b.classList.remove("selected");
					b.setAttribute("aria-pressed", "false");
				});
				const prevAns = this.state.answers[this.state.step];
				if (prevAns !== undefined) {
					const selectedBtn = btns[prevAns - 1];
					if (selectedBtn) {
						selectedBtn.classList.add("selected");
						selectedBtn.setAttribute("aria-pressed", "true");
					}
				}
			}
		}
	},

	handlePsyClick(e) {
		const btn = e.target.closest(".likert-opt");
		if (!btn) return;
		const val = parseInt(btn.dataset.value, 10);
		this.handlePsyAnswer(val);
	},

	handlePsyAnswer(val) {
		this.state.answers[this.state.step] = val;
		// OPTIMIZATION: Use cached buttons
		const btns = this.ui.psyButtons;
		if (btns) {
			btns.forEach((b) => {
				b.classList.remove("selected");
				b.setAttribute("aria-pressed", "false");
			});
			if (btns[val - 1]) {
				btns[val - 1].classList.add("selected");
				btns[val - 1].setAttribute("aria-pressed", "true");
			}
		}
		setTimeout(() => this.nextQuestion(), 300);
	},

	handleQuizAnswer(idx, btn) {
		const q = this.state.questions[this.state.step];
		const isCorrect = idx === q.correctIndex;

		if (isCorrect) {
			btn.classList.add("correct");
			this.state.quizScore++;
		} else {
			btn.classList.add("wrong");
		}

		// ⚡ Bolt: Scoped querySelectorAll to cached container to avoid redundant full document traversals
		const container = (this && this.ui && this.ui.quizContainer) || document;
		const allBtns = container.querySelectorAll(".quiz-opt");
		allBtns.forEach((/** @type {any} */ b, i) => {
			if (i === q.correctIndex) {
				b.classList.add("correct");
			}
			b.classList.add("disabled");
			b.disabled = true;
		});

		setTimeout(() => this.nextQuestion(), 1200);
	},

	nextQuestion() {
		this.state.step++;
	},

	prevQuestion() {
		if (this.state.step > 0) {
			this.state.step--;
		}
	},

	getShareButtonText() {
		const isQuizMode =
			this.state.mode === "quiz" ||
			(this.state.mode === "duel" &&
				this.state.blueprint &&
				this.state.blueprint.testType === "quiz");

		return isQuizMode ? "Поделиться викториной" : "Создать дуэль-ссылку";
	},

	updateInProgressActions() {
		if (this.ui.inProgressShareBtn) {
			this.ui.inProgressShareBtn.innerText = this.getShareButtonText();
			this.ui.inProgressShareBtn.disabled = false;
		}

		if (this.ui.inProgressSaveBtn) {
			this.ui.inProgressSaveBtn.innerText = "Сохранить тест";
			this.ui.inProgressSaveBtn.disabled = false;
		}
	},

	// =========================
	// CALC RESULTS
	// =========================

	calc() {
		const outcomes = this.state.blueprint.outcomes;
		const container = document.getElementById("resContent");
		let html = "";
		let winningResultName = "";

		if (
			this.state.mode === "quiz" ||
			(this.state.mode === "duel" && this.state.blueprint.testType === "quiz")
		) {
			const score = this.state.quizScore;
			const total = this.state.questions.length;
			const result =
				outcomes.find((o) => score >= o.minScore && score <= o.maxScore) ||
				outcomes[0];
			winningResultName = result.name;

			let duelBlock = "";
			if (this.state.mode === "duel") {
				const hostScore = this.state.duelHostScore;
				const hostName = this.state.duelHostName;
				let verdict, color;
				if (score > hostScore) {
					verdict = "Ты выиграл дуэль!";
					color = "#4caf50";
				} else if (score === hostScore) {
					verdict = "Ничья!";
					color = "#ffd700";
				} else {
					verdict = "Ты проиграл дуэль.";
					color = "#f44336";
				}
				duelBlock = `
          <div style="background:rgba(255,255,255,0.1);padding:15px;border-radius:12px;margin:20px 0;border:1px solid rgba(255,255,255,0.2);">
            <h3 style="margin:0 0 10px;color:${color}">${Utils.escapeHtml(verdict)}</h3>
            <div style="display:flex;justify-content:space-around;">
              <div>
                <div><strong>${score}</strong></div>
                <div>Ты</div>
              </div>
              <div>
                <div><strong>${hostScore}</strong></div>
                <div>${Utils.escapeHtml(hostName)}</div>
              </div>
            </div>
          </div>
        `;
			}

			html += `
        <div style="text-align:center;">
          <div style="font-size:14px;color:var(--text-muted);margin-bottom:10px;">Твой результат</div>
          <h1 style="font-size:56px;margin:0;color:var(--primary)">${score} <span style="font-size:24px;color:var(--text-muted)">/ ${total}</span></h1>
          ${duelBlock}
          <h2 style="margin:15px 0 20px;">${Utils.escapeHtml(result.name)}</h2>
          <p style="font-size:18px;">${Utils.escapeHtml(result.description)}</p>
        </div>
      `;
		} else {
			// Психометрический режим
			const { structure, percentages, interpretationBands } =
				Scoring.calculatePsyScores(this.state);
			const scaleProfile = this.state.blueprint.scaleProfile || null;

			let diagnosticsHtml = "";
			let qcText = null;
			if (scaleProfile && scaleProfile.qualityChecks) {
				try {
					qcText = JSON.stringify(scaleProfile.qualityChecks, null, 2);
				} catch (e) {
					qcText = String(scaleProfile.qualityChecks);
				}
			}
			diagnosticsHtml += `<div class="diag-card">`;
			diagnosticsHtml += `<details open><summary class="diag-summary">Диагностика (структура & веса)</summary>`;
			diagnosticsHtml += `<div class="diag-body">`;
			diagnosticsHtml += `<div class="diag-outcomes">`;

			outcomes.forEach((o) => {
				const pct = percentages[o.id] ?? 0;
				const band = Scoring.pickBandLabel(interpretationBands, pct);
				const st = structure[o.id];
				const revPct =
					st.numItems > 0
						? Math.round((st.numReverseItems / st.numItems) * 100)
						: 0;
				const twoOutPct =
					st.numItems > 0
						? Math.round((st.numTwoOutcomeItems / st.numItems) * 100)
						: 0;

				diagnosticsHtml += `
          <div class="diag-row">
            <div class="diag-row-main">
              <div class="diag-title">${Utils.escapeHtml(o.name)}</div>
              <div class="diag-sub">
                <span>${pct}%</span>
                ${band ? `<span>${Utils.escapeHtml(band)}</span>` : ""}
              </div>
            </div>
            <div class="diag-meta">
              <span class="diag-pill">∑|w| ${st.sumAbsWeight.toFixed(2)}</span>
              <span class="diag-pill">items ${st.numItems}</span>
              <span class="diag-pill">reverse ${st.numReverseItems} (${revPct}%)</span>
              <span class="diag-pill">2-outcome ${twoOutPct}%</span>
            </div>
          </div>
        `;
			});

			diagnosticsHtml += `</div>`;

			if (qcText) {
				diagnosticsHtml += `
          <div class="diag-qc">
            <div class="diag-qc-title">qualityChecks (self-report LLM)</div>
            <pre class="diag-code">${qcText}</pre>
          </div>
        `;
			}

			diagnosticsHtml += `</div></details></div>`;

			if (this.state.blueprint.testType === "dimensional") {
				const sorted = [...outcomes].sort(
					(a, b) => percentages[b.id] - percentages[a.id],
				);
				const win = sorted[0];
				winningResultName = win.name;
				const band = Scoring.pickBandLabel(
					interpretationBands,
					percentages[win.id],
				);

				html += `
          <div style="text-align:center;padding-bottom:20px;">
            <div style="font-size:12px;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px;">Твой ведущий результат</div>
            <h2 style="font-size:32px;margin:0 0 10px;color:var(--primary)">${Utils.escapeHtml(win.name)}</h2>
            <p style="font-size:18px;line-height:1.6;">${Utils.escapeHtml(win.description || "")}</p>
            <div style="margin-top:15px;font-size:28px;color:var(--accent);font-weight:bold;">${
							percentages[win.id]
						}%</div>
            ${
							band
								? `<div style="margin-top:8px;color:var(--text-muted);font-weight:600;">${Utils.escapeHtml(band)}</div>`
								: ""
						}
          </div>
          <div class="results-secondary-block">
            <h4 class="results-secondary-title">Остальные результаты</h4>
        `;

				sorted.slice(1).forEach((o) => {
					const pct = percentages[o.id];
					html += `
            <div class="res-item">
              <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:5px;">
                <span><strong>${Utils.escapeHtml(o.name)}</strong></span>
                <span style="color:var(--primary);font-weight:600;font-size:15px;">${pct}%</span>
              </div>
              <div class="res-bar-bg">
                <div class="res-bar-fill" style="width:${pct}%;"></div>
              </div>
            </div>
          `;
				});

				html += `</div>${diagnosticsHtml}`;
			} else {
				html += `<div style="text-align:center;margin-bottom:25px;"><h2>Результаты</h2></div>`;
				outcomes.forEach((o) => {
					const pct = percentages[o.id];
					let interpText = null;
					if (
						typeof o.highInterpretation === "string" &&
						typeof o.lowInterpretation === "string"
					) {
						if (pct >= 70) {
							interpText = o.highInterpretation;
						} else if (pct <= 30) {
							interpText = o.lowInterpretation;
						} else {
							interpText = o.description || "";
						}
					} else {
						interpText = o.description || "";
					}

					html += `
            <div class="res-item">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <strong>${Utils.escapeHtml(o.name)}</strong>
                <span style="color:var(--primary);font-weight:600;font-size:16px;">${pct}%</span>
              </div>
              <div class="res-bar-bg">
                <div class="res-bar-fill" style="width:${pct}%;"></div>
              </div>
              ${
								interpText
									? `<div style="margin-top:6px;font-size:13px;color:var(--text-muted);">${Utils.escapeHtml(interpText)}</div>`
									: ""
							}
            </div>
          `;
				});
				html += diagnosticsHtml;
			}
		}

		this.state.lastResultName = winningResultName;

		const shareBtnText = this.getShareButtonText();

		html += `
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:30px;">
        <button id="saveTestBtn" class="btn" onclick="app.saveTest(this)" style="flex:1;">Сохранить тест</button>
        <button id="shareBtn" class="btn btn-accent" onclick="app.createShareLink(this)" style="flex:1;">${shareBtnText}</button>
      </div>
    `;

		container.innerHTML = html;

		import("./lib/confetti.js")
			.then(({ default: confetti }) => {
				confetti({
					particleCount: 150,
					spread: 70,
					origin: { y: 0.6 },
					colors: ["#6366f1", "#ec4899", "#06b6d4", "#ffd700"],
				});
				setTimeout(() => {
					confetti({
						particleCount: 50,
						angle: 60,
						spread: 55,
						origin: { x: 0 },
					});
					confetti({
						particleCount: 50,
						angle: 120,
						spread: 55,
						origin: { x: 1 },
					});
				}, 400);
			})
			.catch((err) => console.warn("Confetti failed to load", err));
	},

	// =========================
	// SHARE LINK / SAVE
	// =========================

	async createShareLink(btnEl = null) {
		if (typeof TINYTOKEN === "undefined" || !TINYTOKEN)
			return alert("Нужен TinyURL Token!");

		const btn =
			btnEl ||
			document.getElementById("shareBtn") ||
			document.getElementById("inProgressShareBtn");
		const originalText = btn ? btn.innerHTML : null;
		if (btn) {
			btn.innerHTML = "⏳ Создаем ссылку...";
			btn.disabled = true;
		}

		try {
			const isQuiz = this.state.blueprint.testType === "quiz";
			const score = this.state.quizScore;
			const name =
				prompt("Твое имя (для отображения в дуэли):", "Аноним") || "Аноним";

			const payload = {
				h: name,
				s: isQuiz ? score : 0,
				r: isQuiz ? null : this.state.lastResultName,
				t: this.state.blueprint,
				q: this.state.questions,
			};

			if (!payload.t.theme)
				payload.t.theme =
					/** @type {HTMLInputElement} */ (
						document.getElementById("themeInput")
					).value || "Тест";

			const compressedHash = await this.buildDuelHashFromPayload(payload);
			const longUrl = `${window.location.origin}${window.location.pathname}${compressedHash}`;

			const response = await fetch("https://api.tinyurl.com/create", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${TINYTOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url: longUrl, domain: "tiny.one" }),
			});

			if (!response.ok) throw new Error("API Error");
			const data = await response.json();
			const tinyUrl = data.data.tiny_url;

			// --- UX IMPROVEMENT: CLIPBOARD + TOAST ---
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(tinyUrl);
				this.showToast("Ссылка скопирована! Отправь другу 🚀");
			} else {
				prompt("Скопируй ссылку:", tinyUrl);
			}
		} catch (e) {
			console.error(e);
			this.showToast("Ошибка создания ссылки 😢");
		} finally {
			if (btn) {
				btn.innerHTML = originalText;
				btn.disabled = false;
			}
		}
	},

	async saveTest(btnEl = null) {
		const theme =
			this.state.blueprint.theme ||
			/** @type {HTMLInputElement} */ (document.getElementById("themeInput"))
				.value ||
			"Тест";
		let shortUrl = null;

		try {
			if (
				typeof LZString !== "undefined" &&
				typeof TINYTOKEN !== "undefined" &&
				TINYTOKEN
			) {
				const isQuiz = this.state.blueprint.testType === "quiz";
				const score = this.state.quizScore;

				const payload = {
					h: "Аноним",
					s: isQuiz ? score : 0,
					r: isQuiz ? null : this.state.lastResultName || null,
					t: this.state.blueprint,
					q: this.state.questions,
				};

				if (!payload.t.theme) payload.t.theme = theme;

				const compressedHash = await this.buildDuelHashFromPayload(payload);
				const longUrl = `${window.location.origin}${window.location.pathname}${compressedHash}`;

				const response = await fetch("https://api.tinyurl.com/create", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${TINYTOKEN}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ url: longUrl, domain: "tiny.one" }),
				});

				if (response.ok) {
					const data = await response.json();
					shortUrl =
						data && data.data && data.data.tiny_url ? data.data.tiny_url : null;
				}
			}
		} catch (e) {
			console.warn("Short link generation failed (saveTest):", e);
		}

		AppStorage.save(
			this.state.blueprint,
			this.state.questions,
			theme,
			shortUrl,
		);
		this.showToast("Тест сохранен в библиотеку! 💾");

		const btn =
			btnEl ||
			document.getElementById("saveTestBtn") ||
			document.getElementById("inProgressSaveBtn");
		if (btn) {
			btn.innerText = "✅ Сохранено";
			btn.disabled = true;
		}
	},

	loadSavedTest(id) {
		const test = AppStorage.getById(id);
		if (!test) return;
		this.state.blueprint = test.blueprint;
		this.state.questions = test.questions;
		this.state.mode = test.blueprint.testType === "quiz" ? "quiz" : "psy";
		this.state.answers = [];
		this.state.quizScore = 0;
		this.state.step = 0; // Triggers UI via sub
	},

	deleteTest(id, btn) {
		// Fallback for calls without button (if any)
		if (!btn) {
			if (confirm("Удалить сохранённый тест?")) {
				AppStorage.delete(id);
				this.openLibrary();
			}
			return;
		}

		// 2-step confirmation logic
		if (!btn.dataset.confirm) {
			btn.dataset.confirm = "true";
			btn.classList.add("confirming");
			btn.innerHTML = "Точно?";
			btn.title = "Нажмите для подтверждения";
			const originalLabel = btn.getAttribute("aria-label");
			if (originalLabel) btn.dataset.originalLabel = originalLabel;
			btn.setAttribute("aria-label", "Подтвердить удаление");

			// Reset after 3 seconds
			setTimeout(() => {
				if (btn && btn.isConnected) {
					delete btn.dataset.confirm;
					btn.classList.remove("confirming");
					btn.innerHTML = "🗑";
					btn.title = "Удалить";
					if (btn.dataset.originalLabel) {
						btn.setAttribute("aria-label", btn.dataset.originalLabel);
					}
				}
			}, 3000);
			return;
		}

		// Confirmed delete
		AppStorage.delete(id);
		this.openLibrary();
		this.showToast("Тест удален 🗑");
	},

	// =========================
	// VIEW / LOADING
	// =========================

	setView(view) {
		["setupView", "testView", "resultsView", "libraryView", "duelView"].forEach(
			(v) => {
				const el = this.ui[v] || document.getElementById(v);
				if (el) el.style.display = "none";
			},
		);
		const target =
			this.ui[view + "View"] || document.getElementById(view + "View");
		if (target) target.style.display = "block";
	},

	setLoading(active, text) {
		// ⚡ Bolt: Use cached DOM elements to avoid document.getElementById on every API state change
		const el =
			this.ui.loadingOverlay || document.getElementById("loadingOverlay");
		if (el) el.style.display = active ? "flex" : "none";
		if (text) {
			const t = this.ui.loadingText || document.getElementById("loadingText");
			if (t) t.innerText = text;
		}
	},
};

window.app = app; // Expose globally for legacy script interop if any
document.addEventListener("DOMContentLoaded", () => app.init());
