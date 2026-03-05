# Евдокия Тестикова (AI Universal Test Generator)

A client-side, single-page web application that uses AI to generate psychometric tests, trivia quizzes, and interactive "duel" challenges. Powered by Gemini/OpenRouter with a beautiful glassmorphism-styled frontend.

## 🚀 Features

- **Test Modes:**
  - **Тестикул (Psy):** Psychometric test generation based on Likert scales (1-5), with accurate automated scale validations.
  - **Виктория (Quiz):** Knowledge quizzes with 2, 3, or 4 options, including variable difficulties.
  - **Дуэль (Duel):** Share quiz results through compressed short URLs and challenge your friends.
- **Client-Side Only:** No backend required! Everything runs locally relying on browser APIs and direct API calls.
- **Local Storage Library:** Saves all tests and their configuration automatically for future replay.
- **Custom UI System:** Responsive, themable (Light, Dark, Gray), with confetti celebrations and toast notifications.

## 🗂 Project Structure

The project has been refactored to emphasize modularity despite not using a module bundler:

- `index.html` - The core application document and UI container.
- `style.css` - Custom styling using CSS variables, glassmorphism, and responsive layouts.
- `app-settings.js` - Configuration, Prompts, and JSON Schemas used for guiding the LLMs.
- `api.js` - Dedicated API abstraction layer for handling Gemini and OpenRouter interactions.
- `utils.js` - Security, Observability (`Logger`), and utility helpers (e.g. `escapeHtml`, `togglePasswordVisibility`).
- `storage.js` - Encapsulates `localStorage` interactions, caching, and DOM string compilation for the library view.
- `scoring.js` - A highly decoupled, pure mathematical engine for calculating psychometric scales and mapping questionnaire results to outcomes.
- `app.js` - The main state machine orchestrating the UI flow, question rendering, and result calculations.

## 🛠 Setup & Usage

Since this is a vanilla JS application, no build steps are required.

1. Simply serve the directory using any HTTP server:
   ```bash
   npx serve .
   ```
   Or open `index.html` directly in your browser.
2. Enter your API Key (supports Gemini or OpenRouter).
3. Type a topic and configure your test.

## 🛡️ Code Quality, Linters & Tests

The project relies on standard JavaScript with comprehensive JSDoc definitions to ensure type safety without a build step.

To run the type-checker:

```bash
npm install
npx tsc
```

To run the Biome JS formatter and linter:

```bash
npx @biomejs/biome check ./
```

To run the **Vitest** unit test suite (tests `scoring.js` isolated logic):

```bash
npx vitest run
```

## 📝 Recent Audits & Improvements

- Extract scoring calculation logic to `scoring.js` from `app.js` to break the God Object anti-pattern.
- Enhance XSS mitigation by substituting `innerHTML` with `textContent` where applicable.
- Introduce `_reasoning` fields in JSON Prompts to force the LLM to use Chain-of-Thought (CoT).
- Adopt `vitest` for reliable continuous logic integration testing.
- Implement event delegation in the UI to minimize inline `onclick` vulnerabilities.
- Add Frontend Design Pro Max guidelines to uplift the typography to 'Outfit' and add tactile 3D hover/entrance micro-animations.
- Implement observability via a persistent `localStorage` error `Logger`.

Enjoy generating tests! 🪄
