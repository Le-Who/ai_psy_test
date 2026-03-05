# Евдокия Тестикова (AI Universal Test Generator)

A client-side, single-page web application that uses AI to generate psychometric tests, trivia quizzes, and interactive "duel" challenges. Powered by Gemini/OpenRouter with a premium glassmorphism-styled frontend and full PWA support.

## 🚀 Features

- **Test Modes:**
  - **Тестикул (Psy):** Psychometric test generation based on Likert scales (1–5), with automated scale validations and Chain-of-Thought reasoning.
  - **Виктория (Quiz):** Knowledge quizzes with 2–4 options, variable difficulties, and instant scoring.
  - **Дуэль (Duel):** Share quiz results through compressed short URLs and challenge friends.
- **Client-Side Only:** No backend required — runs entirely in the browser via direct API calls.
- **PWA Ready:** Installable progressive web app with Service Worker caching for offline shell loading.
- **Reactive State:** Proxy-based Pub/Sub state management (`store.js`) for clean reactive UI updates.
- **Runtime Validation:** AI-generated outputs are validated against strict JSON schemas with automatic retry on hallucination.
- **Code Splitting:** `lz-string` and `canvas-confetti` are dynamically imported only when needed.
- **Local Storage Library:** All generated tests are saved for future replay.
- **Custom UI System:** Responsive, themable (Light, Dark, Gray), with confetti celebrations and toast notifications.

## 🗂 Project Structure

```
├── index.html              # Core application document and UI container
├── style.css               # CSS variables, glassmorphism, responsive layouts
├── src/
│   ├── app.js              # Main state machine: UI flow, question rendering, results
│   ├── app-settings.js     # Prompts, JSON Schemas, and LLM configuration
│   ├── api.js              # API abstraction for Gemini / OpenRouter
│   ├── store.js            # Proxy-based reactive state manager
│   ├── validator.js        # Runtime JSON validation for AI outputs
│   ├── scoring.js          # Pure mathematical scoring engine
│   ├── storage.js          # localStorage interactions and library rendering
│   └── utils.js            # Security (escapeHtml), Logger, and helper utilities
├── public/
│   ├── manifest.json       # PWA manifest for installable web app
│   ├── sw.js               # Service Worker for offline caching
│   ├── icon.svg            # PWA icon (192×192 / 512×512)
│   └── robots.txt          # Search engine crawler directives
├── tests/
│   ├── scoring.test.js     # Unit tests for scoring engine
│   ├── storage.test.js     # Unit tests for storage module
│   ├── utils.test.js       # Unit tests for utility functions
│   └── e2e/
│       └── psy.spec.js     # Playwright E2E test with mocked API
└── .github/workflows/
    └── ci.yml              # CI pipeline: Biome + Vitest + Playwright
```

## 🛠 Setup & Usage

```bash
npm install
npm run dev
```

1. Open the dev server URL in your browser.
2. Enter your API Key (Gemini or OpenRouter).
3. Pick a topic, configure your test, and generate!

## 🛡️ Code Quality & Testing

### Linting & Formatting (Biome)

```bash
npx @biomejs/biome check src/ index.html style.css public/sw.js
```

### Unit Tests (Vitest)

```bash
npm run test
```

### E2E Tests (Playwright)

```bash
npx playwright test
```

### CI Pipeline

Every push and PR runs the full suite via GitHub Actions:
**Biome Check → TypeScript Check → Vitest → Playwright E2E**

## 🌐 SEO & Accessibility

- **OpenGraph + Twitter Card** meta tags for rich link previews on social media and messengers.
- **ARIA attributes** on progress bars (`role="progressbar"`, dynamic `aria-valuenow`), loading states (`aria-live="assertive"`), and all interactive buttons (`aria-label`).
- **Keyboard navigation** with global `:focus-visible` outline using `var(--primary)`.

## 📝 Architecture Highlights

| Layer            | Implementation                                                     |
| ---------------- | ------------------------------------------------------------------ |
| State Management | Proxy-based Pub/Sub (`store.js`)                                   |
| AI Integration   | Multi-provider API with retry loop and self-correction prompting   |
| Validation       | Runtime JSON schema validation (`validator.js`)                    |
| Performance      | Dynamic `import()` code splitting for heavy libraries              |
| Testing          | Vitest (unit) + Playwright (E2E) with mocked API                   |
| CI/CD            | GitHub Actions with full Biome + TS + Vitest + Playwright pipeline |
| PWA              | Service Worker + manifest for installable offline-ready app        |

Enjoy generating tests! 🪄
