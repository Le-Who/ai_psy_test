/**
 * AI Universal Test Generator - Configuration
 * ============================================
 * Настройки с поддержкой мульти-провайдеров (OpenRouter + Gemini)
 */

const CONFIG = {
    // ===== ПРОВАЙДЕРЫ И МОДЕЛИ =====
    providers: {
        openrouter: {
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            models: {
                architect: 'xiaomi/mimo-v2-flash:free',
                generator: 'xiaomi/mimo-v2-flash:free'
            },
            headers: (key) => ({
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'AI Universal Test'
            })
        },
        gemini: {
            // Endpoint формируется динамически, здесь база
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
            models: {
                // Используем Flash модели для скорости и бесплатного тира
                architect: 'gemini-2.5-flash', 
                generator: 'gemini-2.5-flash'
            }
        }
    },

    // ===== ПАРАМЕТРЫ =====
    generation: {
        temperature: 0.7,
        maxTokens: 4000,
        timeoutMs: 45000
    },

    // ===== ОГРАНИЧЕНИЯ =====
    limits: {
        minQuestions: 5,
        maxQuestions: 20,
        minOutcomes: 2,
        maxOutcomes: 12
    },

    // ===== UI =====
    ui: {
        answerDelayMs: 250,
        debugMode: true,
        resultsAnimationDelay: 600
    }
};

// ===== ПРОМПТЫ (Без изменений) =====
const PROMPTS = {
    architect: `Ты — Архитектор Психометрических Систем.
Твоя задача — проанализировать запрос и спроектировать структуру теста.

ТИПЫ:
1. categorical (Персонажи/Типы) — "Кто ты из..."
2. dimensional (Шкалы) — "Уровень качества..."

ТРЕБОВАНИЯ:
- Для categorical: 4-10 персонажей с уникальными чертами.
- Для dimensional: 1-5 шкал.
- Язык: РУССКИЙ.
- Описания: краткие и емкие.`,

    generator: `Ты — Автор Тестов.
Твоя задача — создать вопросы для теста.

ПРАВИЛА:
1. Язык: РУССКИЙ.
2. Формат: Утверждения от первого лица ("Я...").
3. Связь (Mapping):
   - Categorical: Вес +1 если ответ "Да" подходит персонажу, -1 если противоречит.
   - Dimensional: Вес +1 (прямая корреляция), -1 (обратная).`
};

// ===== СХЕМЫ JSON (OpenAI Format) =====
// Для Gemini они будут автоматически конвертированы в коде
const SCHEMAS = {
    blueprint: {
        "type": "json_schema",
        "json_schema": {
            "name": "test_blueprint",
            "strict": true,
            "schema": {
                "type": "object",
                "properties": {
                    "testType": { "type": "string", "enum": ["dimensional", "categorical"] },
                    "language": { "type": "string", "enum": ["ru"] },
                    "outcomes": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": { "type": "string" },
                                "name": { "type": "string" },
                                "description": { "type": "string" }
                            },
                            "required": ["id", "name", "description"],
                            "additionalProperties": false
                        }
                    }
                },
                "required": ["testType", "language", "outcomes"],
                "additionalProperties": false
            }
        }
    },

    questions: {
        "type": "json_schema",
        "json_schema": {
            "name": "test_questions_pack",
            "strict": true,
            "schema": {
                "type": "object",
                "properties": {
                    "questions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "text": { "type": "string" },
                                "mapping": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "outcomeId": { "type": "string" },
                                            "weight": { "type": "number" }
                                        },
                                        "required": ["outcomeId", "weight"],
                                        "additionalProperties": false
                                    }
                                }
                            },
                            "required": ["text", "mapping"],
                            "additionalProperties": false
                        }
                    }
                },
                "required": ["questions"],
                "additionalProperties": false
            }
        }
    }
};

console.log("✅ Config loaded (Multi-provider support)");
