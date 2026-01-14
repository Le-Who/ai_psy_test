/**
 * AI Universal Test Generator - Settings v4.2 (Final High-Quality Prompts)
 * ========================================================================
 * Full Context Psy Prompts + Structured Quiz Prompts
 */

const CONFIG = {
    providers: {
        openrouter: {
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            models: {
                // Бесплатные модели Xiaomi/Liquid/DeepSeek
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
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
            models: {
                architect: 'gemini-2.5-flash',
                generator: 'gemini-2.5-flash'
            }
        }
    },
    generation: { temperature: 0.7 },
    limits: { minQuestions: 5, maxQuestions: 69 }
};

// ===== СХЕМЫ ДАННЫХ (SCHEMAS) =====
const SCHEMAS = {
    // 1. PSY
    psy_blueprint: {
        type: "object",
        properties: {
            testType: { type: "string", enum: ["dimensional", "categorical"] },
            outcomes: {
                type: "array",
                items: {
                    type: "object",
                    properties: { id: { type: "string" }, name: { type: "string" }, description: { type: "string" } },
                    required: ["id", "name", "description"]
                }
            }
        },
        required: ["testType", "outcomes"]
    },
    psy_questions: {
        type: "object",
        properties: {
            // Дополнительные поля (новая Likert-архитектура). Приложение сейчас использует только questions,
            // но мы разрешаем модели возвращать полную структуру: meta/scaleProfile/outcomes/questions.
            meta: {
                type: "object",
                properties: {
                    topic: { type: "string" },
                    language: { type: "string" },
                    voice: { type: "string" },
                    likertScale: {
                        anyOf: [
                            { type: "string" },
                            { type: "object" }
                        ]
                    },
                    scoringModel: {
                        anyOf: [
                            { type: "string" },
                            { type: "object" }
                        ]
                    },
                    generatedAtISO: { type: "string" }
                }
            },
            scaleProfile: {
                type: "object",
                properties: {
                    baseScoreMap: {
                        type: "object",
                        additionalProperties: { type: "number" }
                    },
                    outcomePotential: {
                        type: "object",
                        additionalProperties: {
                            type: "object",
                            properties: {
                                sumAbsWeight: { type: "number" },
                                numItems: { type: "integer" },
                                numReverseItems: { type: "integer" },
                                maxRaw: { type: "number" },
                                minRaw: { type: "number" }
                            }
                        }
                    },
                    normalization: {
                        anyOf: [
                            { type: "string" },
                            { type: "object" }
                        ]
                    },
                    interpretationBands: {
                        anyOf: [
                            { type: "array" },
                            { type: "object" }
                        ]
                    },
                    qualityChecks: {
                        anyOf: [
                            { type: "object" },
                            { type: "array" }
                        ]
                    }
                }
            },
            // Расширенный outcomes (если генератор решит вернуть их с интерпретациями)
            outcomes: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        highInterpretation: { type: "string" },
                        lowInterpretation: { type: "string" }
                    },
                    required: ["id", "name"]
                }
            },
            questions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        text: { type: "string" },
                        mapping: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: { outcomeId: { type: "string" }, weight: { type: "number" } },
                                required: ["outcomeId", "weight"]
                            }
                        },
                        polarity: { type: "string", enum: ["direct", "reverse", "mixed"] },
                        facetHint: { type: "string" }
                    },
                    required: ["text", "mapping"]
                }
            }
        },
        required: ["questions"]
    },

    // 2. QUIZ
    quiz_blueprint: {
        type: "object",
        properties: {
            testType: { type: "string", enum: ["quiz"] },
            outcomes: {
                type: "array",
                items: {
                    type: "object",
                    properties: { minScore: { type: "integer" }, maxScore: { type: "integer" }, name: { type: "string" }, description: { type: "string" } },
                    required: ["minScore", "maxScore", "name", "description"]
                }
            }
        },
        required: ["testType", "outcomes"]
    },
    quiz_questions: {
        type: "object",
        properties: {
            questions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        text: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correctIndex: { type: "integer" }
                    },
                    required: ["text", "options", "correctIndex"]
                }
            }
        },
        required: ["questions"]
    }
};

// ===== СИСТЕМНЫЕ ПРОМПТЫ (MASTERPIECE EDITION) =====
// Убираем ненужные повторы: тексты промптов одинаковые для провайдеров, различается стратегия принуждения JSON.
const PROMPT_TEXTS = {
    architect_psy: `Ты — Главный Архитектор Психометрических Систем.
Твоя задача — проанализировать запрос пользователя и спроектировать идеальную структуру теста.

ТИПЫ ТЕСТОВ:
1. **categorical** (Категориальный/Типология)
   - Вопросы вида: "Кто ты из [Франшизы]?", "Какой ты [Предмет]?", "Твой архетип".
   - Цель: Классифицировать пользователя как один из типажей.
   - Результат: 4-10 уникальных персонажей/типов с яркими описаниями.

2. **dimensional** (Размерный/Шкалы)
   - Вопросы вида: "Уровень твоей [Черты]", "Насколько ты [Качество]".
   - Цель: Измерить выраженность характеристик.
   - Результат: 1-5 независимых шкал (например: "Стресс", "Эмпатия").

ТРЕБОВАНИЯ К КОНТЕНТУ:
- Язык: Строго РУССКИЙ.
- Описания результатов: Емкие, интересные, "попадающие в точку" (2-3 предложения).
- Если тема развлекательная (мемы, игры, кино) -> выбирай categorical.
- Если тема серьезная (психология, навыки) -> выбирай dimensional.`,

    generator_psy: `Ты — Профессиональный Автор Тестов и Психометрист.
Твоя задача — создать глубокие вопросы, которые точно распределяют людей по результатам.

ПРАВИЛА ДЛЯ ВОПРОСОВ:
1. **Язык**: Строго РУССКИЙ.
2. **Формат**: Утверждения от первого лица ("Я люблю...", "Мне свойственно...", "В трудной ситуации я...").
3. **Стиль**: Естественный, живой, подходящий под тему.
4. **Длина**: 10-20 слов. Одна мысль на вопрос.

!!! КРИТИЧЕСКИ ВАЖНО ПРО ВЕСА (MAPPING) !!!
Чтобы тест работал точно, следуй логике "Soft Weights" (Мягких Весов):

**Для CATEGORICAL (Персонажи):**
- ИЗБЕГАЙ бинарности (где вопрос дает балл только одному персонажу).
- Один вопрос должен влиять на НЕСКОЛЬКО персонажей с разной силой.
- Пример: Вопрос "Я всегда стремлюсь к лидерству".
  * Персонаж А (Лидер): weight +1.0 (Сильное совпадение)
  * Персонаж Б (Амбициозный): weight +0.5 (Частичное совпадение)
  * Персонаж В (Скромный): weight -1.0 (Противоречие)
  * Персонаж Г (Лентяй): weight -0.5 (Небольшое противоречие)

**Для DIMENSIONAL (Шкалы):**
- Используй прямые (+1.0) и обратные (-1.0) вопросы для баланса.
- Используй дробные веса (0.5) для вопросов, косвенно связанных с чертой.`,

    architect_quiz: `Ты — Геймдизайнер Интеллектуальных Викторин.
Твоя задача — создать систему грейдов (званий) на основе количества правильных ответов.
Весь диапазон возможных очков (от 0 до MAX) должен быть покрыт.

ПРИМЕР ГРЕЙДОВ (для 10 вопросов):
- 0-3: "Новичок" (Описание: Ты только начал путь...)
- 4-7: "Любитель" (Описание: Неплохо, но есть куда расти...)
- 8-9: "Знаток" (Описание: Отличные знания!)
- 10-10: "Грандмастер" (Описание: Идеально! Ты знаешь всё!)

ВАЖНО:
- Названия званий должны соответствовать Теме (для Гарри Поттера: "Маггл", "Ученик", "Мракоборец").
- Язык: Строго РУССКИЙ.`,

    generator_quiz: `Ты — Ведущий Интеллектуальной Викторины.
Твоя задача — создать вопросы для проверки знаний по теме.

ПРАВИЛА ДЛЯ ВОПРОСОВ:
1. **Язык**: Строго РУССКИЙ.
2. **Сложность**: Вопросы должны быть интересными, не банальными.
3. **Количество вариантов**: Строго следуй указанию из запроса (2, 3 или 4). Только один верный, остальные ложные, но правдоподобные.
4. **Юмор**: Если тема позволяет, иногда добавляй легкий юмор в один или несколько неправильных ответов.
5. Всегда указывай точный correctIndex.`
};

const PROMPTS = {
    
    // --- OPENROUTER (JSON Examples Included) ---
    openrouter: {
        // OPENROUTER: жёстко требуем только JSON (без markdown) и даём пример формата
        architect_psy: `${PROMPT_TEXTS.architect_psy}

!!! ВАЖНО: ОТВЕТЬ СТРОГО В FORMAT JSON !!!
Не пиши вступлений, не используй markdown. Верни только JSON по этому образцу:
{
  "testType": "categorical",
  "outcomes": [
    { "id": "o1", "name": "Название", "description": "Описание" }
  ]
}`,

        generator_psy: `${PROMPT_TEXTS.generator_psy}

ЦЕЛЬ: Максимально точный и нюансированный профиль пользователя.

!!! ВАЖНО: ОТВЕТЬ СТРОГО В FORMAT JSON !!!
Верни только JSON по этому образцу:
{
  "questions": [
    {
      "text": "Текст вопроса...",
      "mapping": [
        { "outcomeId": "o1", "weight": 1.0 },
        { "outcomeId": "o2", "weight": -0.5 }
      ]
    }
  ]
}`,

        // [QUIZ MODE] - НОВЫЕ, НО В ТОМ ЖЕ СТИЛЕ
        architect_quiz: `${PROMPT_TEXTS.architect_quiz}

!!! ОТВЕТЬ СТРОГО В FORMAT JSON !!!
Верни только JSON по этому образцу:
{
  "testType": "quiz",
  "outcomes": [
    { "minScore": 0, "maxScore": 3, "name": "Звание", "description": "Текст" }
  ]
}`,

        generator_quiz: `${PROMPT_TEXTS.generator_quiz}

!!! ОТВЕТЬ СТРОГО В FORMAT JSON !!!
Верни только JSON по этому образцу:
{
  "questions": [
    {
      "text": "Вопрос?",
      "options": ["Ответ А", "Ответ Б", "Ответ В", "Ответ Г"],
      "correctIndex": 0
    }
  ]
}`
    },

    // --- GEMINI (Schema Driven Strategy) ---
    gemini: {
        // GEMINI: основное принуждение формата идёт через добавление "FORMAT JSON" + schema в callGemini()
        architect_psy: PROMPT_TEXTS.architect_psy,
        generator_psy: PROMPT_TEXTS.generator_psy,
        architect_quiz: PROMPT_TEXTS.architect_quiz,
        generator_quiz: PROMPT_TEXTS.generator_quiz
    }
};

console.log("✅ App Settings Loaded (v6.5 Final)");
