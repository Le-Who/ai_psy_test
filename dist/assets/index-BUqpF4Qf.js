(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=i(o);fetch(o.href,n)}})();const N="modulepreload",A=function(e){return"/"+e},E={},x=function(t,i,s){let o=Promise.resolve();if(i&&i.length>0){let u=function(d){return Promise.all(d.map(l=>Promise.resolve(l).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var a=u;document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),r=c?.nonce||c?.getAttribute("nonce");o=u(i.map(d=>{if(d=A(d),d in E)return;E[d]=!0;const l=d.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const h=document.createElement("link");if(h.rel=l?"stylesheet":N,l||(h.as="script"),h.crossOrigin="",h.href=d,r&&h.setAttribute("nonce",r),document.head.appendChild(h),l)return new Promise((m,g)=>{h.addEventListener("load",m),h.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(c){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=c,window.dispatchEvent(r),!r.defaultPrevented)throw c}return o.then(c=>{for(const r of c||[])r.status==="rejected"&&n(r.reason);return t().catch(n)})},v={providers:{openrouter:{endpoint:"https://openrouter.ai/api/v1/chat/completions",models:{architect:"x-ai/grok-4.1-fast",generator:"x-ai/grok-4.1-fast"},headers:e=>({Authorization:`Bearer ${e}`,"Content-Type":"application/json","HTTP-Referer":window.location.href,"X-Title":"AI Universal Test"})},gemini:{endpoint:"https://generativelanguage.googleapis.com/v1beta/models/",models:{architect:"gemini-2.5-flash",generator:"gemini-2.5-flash"}}}},S={psy_blueprint:{type:"object",properties:{_reasoning:{type:"string"},testType:{type:"string",enum:["dimensional","categorical"]},constructDefinition:{type:"object",properties:{name:{type:"string"},theoreticalBackground:{type:"string"},targetPopulation:{type:"string"},expectedOutcomeCount:{type:"integer"}},required:["name"]},outcomes:{type:"array",items:{type:"object",properties:{id:{type:"string"},name:{type:"string"},description:{type:"string"},facets:{type:"array",items:{type:"object",properties:{id:{type:"string"},type:{type:"string",enum:["behavior","cognition","emotion","preference","stress_response"]},label:{type:"string"},rationale:{type:"string"}},required:["id","type","label"]}},discriminators:{type:"array",items:{type:"string"}},questionRequirements:{type:"object",properties:{totalQuestions:{type:"integer",minimum:1},facetCoverage:{type:"string",enum:["all","primary"]},reverseItems:{type:"integer",minimum:0},dualOutcomeItems:{type:"integer",minimum:0},complexityLevel:{type:"string",enum:["easy","moderate","complex"]}}}},required:["id","name","description"]}},qualityCheckpoints:{type:"object",properties:{semanticSimilarityThreshold:{type:"number"},facetRedundancyCheck:{type:"boolean"},outcomeDiscriminationCheck:{type:"boolean"},reverseItemQualityCheck:{type:"boolean"}}}},required:["testType","outcomes"]},psy_questions:{type:"object",properties:{_reasoning:{type:"string"},meta:{type:"object",properties:{topic:{type:"string"},language:{type:"string"},voice:{type:"string"},likertScale:{anyOf:[{type:"string"},{type:"object"}]},scoringModel:{anyOf:[{type:"string"},{type:"object"}]},generatedAtISO:{type:"string"}}},scaleProfile:{type:"object",properties:{baseScoreMap:{type:"object",additionalProperties:{type:"number"}},outcomePotential:{type:"object",additionalProperties:{type:"object",properties:{sumAbsWeight:{type:"number"},numItems:{type:"integer"},numReverseItems:{type:"integer"},numTwoOutcomeItems:{type:"integer"},maxRaw:{type:"number"},minRaw:{type:"number"}}}},normalization:{anyOf:[{type:"string"},{type:"object"}]},interpretationBands:{anyOf:[{type:"array"},{type:"object"}]},facetCoverageReport:{type:"object",properties:{facetStatus:{type:"array"},uncoveredFacets:{type:"array"},summary:{type:"string"}}},semanticAuditReport:{type:"object",properties:{totalPairwiseComparisons:{type:"integer"},redundantPairs:{type:"integer"},nearDuplicates:{type:"integer"},averageSimilarity:{type:"number"},maxSimilarity:{type:"number"},summary:{type:"string"}}},reverseItemReport:{type:"object",properties:{targetReverse:{type:"integer"},actualReverse:{type:"integer"},byOutcome:{type:"object"},qualityCheck:{type:"string"},summary:{type:"string"}}},dualOutcomeReport:{type:"object",properties:{targetDualPercentage:{type:"string"},dualItems:{type:"integer"},totalItems:{type:"integer"},actualPercentage:{type:"string"},pairs:{type:"array"},hubCheck:{type:"string"},summary:{type:"string"}}},qualityChecks:{anyOf:[{type:"object",properties:{semanticDiversity:{type:"string"},facetCoverage:{type:"string"},reverseBalance:{type:"string"},weightDistribution:{type:"string"},overallValidity:{type:"string"},concerns:{type:"array"}}},{type:"array"},{type:"object"}]},outcomes:{type:"array",items:{type:"object",properties:{id:{type:"string"},name:{type:"string"},description:{type:"string"},highInterpretation:{type:"string"},lowInterpretation:{type:"string"}},required:["id","name"]}}}},questions:{type:"array",items:{type:"object",properties:{id:{type:"string"},text:{type:"string"},mapping:{type:"array",minItems:1,maxItems:2,items:{type:"object",properties:{outcomeId:{type:"string"},weight:{type:"number",enum:[-2,-1,-.5,.5,1,2]}},required:["outcomeId","weight"]}},polarity:{type:"string",enum:["direct","reverse","mixed"]},facetId:{type:"string"}},required:["text","mapping"]}}},required:["questions"]},quiz_blueprint:{type:"object",properties:{_reasoning:{type:"string"},testType:{type:"string",enum:["quiz"]},outcomes:{type:"array",items:{type:"object",properties:{minScore:{type:"integer"},maxScore:{type:"integer"},name:{type:"string"},description:{type:"string"}},required:["minScore","maxScore","name","description"]}}},required:["testType","outcomes"]},quiz_questions:{type:"object",properties:{_reasoning:{type:"string"},questions:{type:"array",items:{type:"object",properties:{text:{type:"string"},options:{type:"array",items:{type:"string"}},correctIndex:{type:"integer"}},required:["text","options","correctIndex"]}}},required:["questions"]}},L={architect_psy:`
Ты — Главный Архитектор Психометрических Систем (Senior Psychometrician 15+ лет опыта).
Твоя задача — спроектировать СТРУКТУРУ теста, которую потом получит отдельная модель‑генератор вопросов.

Рабочий язык: строго РУССКИЙ.
Модель: Gemini 2.5 Flash.
Формат ответа: СТРОГО валидный JSON, БЕЗ markdown, БЕЗ пояснений, только объект.

====================================================
# 1. ЗАДАЧА И CHAIN-OF-THOUGHT (CoT)
====================================================

Ты должен СНАЧАЛА провести глубокий анализ в поле \`_reasoning\` (Chain-of-Thought), и только ЗАТЕМ генерировать саму структуру теста.
Твоя задача — спроектировать СТРУКТУРУ теста, которую потом получит отдельная модель‑генератор вопросов.

1) В поле \`_reasoning\` объясни:
   - Кто целевая аудитория?
   - Какие outcomes будут наиболее валидны и интересны?
   - Почему выбраны именно эти outcomes, и чем они принципиально отличаются?
   - (Для dimensional) Какие 5 фасетов (behavior, cognition, emotion, preference, stress_response) лучше всего раскроют каждый outcome?
   - Как обеспечить баланс (reverse items, dual-outcome items)?
2) Выбери тип теста:
   - "categorical" — развлекательные типологии, архетипы, "кто ты из ...".
   - "dimensional" — измерение выраженности черт, навыков, состояний по шкалам.
3) Спроектировать:
   - общие настройки конструкта (constructDefinition),
   - список исходов (outcomes),
   - для DIMENSIONAL — фасеты (facets) и дискриминаторы (discriminators),
   - требования к количеству вопросов и их структуре (questionRequirements),
   - чекпоинты качества (qualityCheckpoints).

Если запрос развлекательный (мемы, персонажи, кино, игры) → чаще всего "categorical".
Если запрос серьезный (психология, личностные черты, навыки, ментальное здоровье) → "dimensional".

====================================================
# 2. КОНСТРУКТ И ТИП ТЕСТА
====================================================

Ты должен явным образом:
- назвать конструкт теста,
- кратко описать теоретический контекст,
- указать целевую аудиторию.

Структура:
{
  "testType": "dimensional" | "categorical",

  "constructDefinition": {
    "name": "Краткое название конструкта (например: "Экстраверсия-Интроверсия")",
    "theoreticalBackground": "1–3 предложения, зачем измерять этот конструкт и на какие подходы он опирается (Big Five, когнитивная психология и т.п.).",
    "targetPopulation": "Кто проходит тест (например: "Взрослые 18–65 лет, широкой аудитории").",
    "expectedOutcomeCount": 3-7
  },
  ...
}

Правило по количеству исходов (outcomes):
- categorical: обычно 4–8 ярких, запоминающихся типов.
- dimensional: обычно 2–5 шкал, достаточно различимых.

====================================================
# 3. OUTCOMES: ТРЕБОВАНИЯ
====================================================

Каждый outcome должен быть:
- четко отличим по смыслу от остальных;
- описан так, чтобы пользователь, получив результат, понимал себя;
- НЕ быть синонимом другого outcome; различаться не только словами, но и сутью.

Для каждого outcome:
- "id": короткий id (например: "o1", "extraversion").
- "name": короткое, запоминающееся название на русском.
- "description": 2–3 предложения, описывающих высокий уровень этого outcome.

====================================================
# 4. FACETS (ТОЛЬКО ДЛЯ DIMENSIONAL)
====================================================

Если "testType": "dimensional", ты обязан создать для КАЖДОГО outcome ровно 5 фасетов, по типам:

Типы фасетов:
  1) "behavior"         — поведение: что человек делает.
  2) "cognition"        — мышление/убеждения: как он интерпретирует мир.
  3) "emotion"          — эмоции: что он чувствует.
  4) "preference"       — выборы/предпочтения.
  5) "stress_response"  — как он реагирует в стрессе/конфликте.

Структура фасета:
{
  "id": "o1_behavior",                // pattern: outcomeId + "_" + тип
  "type": "behavior",                 // один из: behavior, cognition, emotion, preference, stress_response
  "label": "Краткий ярлык (3–7 слов, без "Я/Мне/Мой")",
  "rationale": "1–2 предложения, почему этот фасет — валидный индикатор именно ЭТОГО outcome и чем он отличается от фасетов других outcomes."
}

Требования к label:
- Длина: 3–7 слов.
- Формат: НЕ предложение, НЕ от первого лица, а ярлык‑ситуация.
  - Хорошо: "Инициирует встречи с друзьями", "Чувствует подъём в компании людей".
  - Плохо: "Я люблю общаться", "Открытость к новому" (слишком абстрактно).
- Внутри одного outcome фасеты НЕ должны быть синонимами или почти одинаковыми.

====================================================
# 5. DISCRIMINATORS (УНИКАЛЬНЫЕ МАРКЕРЫ)
====================================================

Для каждого dimensional‑outcome выбери 1–2 фасета, которые являются УНИКАЛЬНЫМИ для него, то есть:
- плохо подходят к другим outcomes;
- действительно выделяют этот outcome.

Пример:
- Для "Экстраверсия": "При стрессе ищет общения и поддержки".
- Для "Интроверсия": "При стрессе уходит в уединение и тишину".

Поле:
"discriminators": ["o1_behavior", "o1_stress_response"]

====================================================
# 6. ТРЕБОВАНИЯ К ВОПРОСАМ (questionRequirements)
====================================================

Архитектор НЕ создает вопросы, но должен задать рамки:
- сколько вопросов в целом,
- сколько вопросов на outcome,
- сколько обратных (reverse),
- сколько парных (dual‑outcome).

Пример:
"questionRequirements": {
  "totalQuestions": 10,
  "facetCoverage": "all",          // "all" = каждый facet должен иметь ≥1 вопрос
  "reverseItems": 3,               // целевое количество обратных вопросов
  "dualOutcomeItems": 2,           // целевое количество вопросов, которые одновременно меряют 2 outcomes
  "complexityLevel": "moderate"    // "easy" | "moderate" | "complex"
}

Рекомендации:
- Если указан QUESTIONS_COUNT во входящем тексте, используй его как фактическое totalQuestions, игнорируя значение totalQuestions в blueprint.
- малый тест: 5–10 вопросов;
- средний: 10–30;
- максимальный: до ~69.

====================================================
# 7. ЧЕКПОИНТЫ КАЧЕСТВА (qualityCheckpoints)
====================================================

Ты задаешь стандарты, по которым генератор потом будет сам себя проверять:

"qualityCheckpoints": {
  "semanticSimilarityThreshold": 0.70,   // если два вопроса >70% похожи по смыслу — это дубликаты
  "facetRedundancyCheck": true,          // проверять, нет ли дублирующих фасетов внутри outcome
  "outcomeDiscriminationCheck": true,    // проверять, что outcomes действительно различаются
  "reverseItemQualityCheck": true        // проверять, что обратные вопросы — смысловые антонимы, а не просто с частицей "не"
}

====================================================
# 8. САМОПРОВЕРКА ПЕРЕД ВЫВОДОМ
====================================================

ПЕРЕД тем как вернуть JSON, ты мысленно проходишь чек‑лист (но НЕ выводишь его в ответ):

1) Outcomes:
   - Outcomes не являются синонимами.
   - Для dimensional: outcomes — независимые измерения, а не просто полюса одной шкалы.
2) Facets (для dimensional):
   - Ровно 5 фасетов на outcome.
   - Все 5 типов представлены (behavior, cognition, emotion, preference, stress_response).
   - Внутри outcome нет фасетов‑двойников.
   - 1–2 фасета помечены как discriminators.
3) Questions requirements:
   - totalQuestions адекватно теме (обычно 5–69).
   - Если указан QUESTIONS_COUNT во входящем тексте, используй его как фактическое totalQuestions, игнорируя значение totalQuestions в blueprint.
   - reverseItems примерно 30–40% от totalQuestions.
   - dualOutcomeItems не более 30% от totalQuestions.
4) Реализуемость:
   - По такому blueprint реально придумать достаточно разных ситуаций.

Если что‑то нарушено — ты корректируешь outcomes/ facets / questionRequirements, и только потом возвращаешь итоговый JSON.

====================================================
# 9. ФОРМАТ ОТВЕТА (ОБЯЗАТЕЛЬНО)
====================================================

Верни СТРОГО ОДИН JSON‑объект без markdown. Структура:

{
  "_reasoning": "Твои пошаговые размышления об архитектуре перед генерацией JSON. Опиши логику выбора исходов и фасетов.",
  "testType": "dimensional",

  "constructDefinition": {
    "name": "...",
    "theoreticalBackground": "...",
    "targetPopulation": "...",
    "expectedOutcomeCount": 3-7
  },

  "outcomes": [
    {
      "id": "o1",
      "name": "Название outcome",
      "description": "2–3 предложения описания результата.",
      "facets": [
        {
          "id": "o1_behavior",
          "type": "behavior",
          "label": "Краткий ярлык фасета (3–7 слов)",
          "rationale": "1–2 предложения, почему это валидный индикатор именно этого outcome."
        }
        // всего ровно 5 фасетов, по одному каждого типа
      ],
      "discriminators": ["o1_behavior", "o1_stress_response"],
      "questionRequirements": {
        "totalQuestions": 8,
        "facetCoverage": "all",
        "reverseItems": 3,
        "dualOutcomeItems": 2,
        "complexityLevel": "moderate"
      }
    }
    // остальные outcomes
  ],

  "qualityCheckpoints": {
    "semanticSimilarityThreshold": 0.70,
    "facetRedundancyCheck": true,
    "outcomeDiscriminationCheck": true,
    "reverseItemQualityCheck": true
  }
}
`,generator_psy:`
Ты — Профессиональный Автор Психометрических Тестов и Психометрист.
Ты получаешь на вход blueprint (структуру теста) от архитектора и по нему создаешь КОНКРЕТНЫЕ ВОПРОСЫ.

Рабочий язык: строго РУССКИЙ.
Формат ответа: СТРОГО валидный JSON, БЕЗ markdown, БЕЗ пояснений, только объект.

====================================================
# 1. ТВОЯ ЦЕЛЬ И CHAIN-OF-THOUGHT (CoT)
====================================================

Ты должен СНАЧАЛА провести анализ в поле \`_reasoning\` (Chain-of-Thought), и только ЗАТЕМ генерировать сами вопросы.

В поле \`_reasoning\` пошагово объясни:
1) Как ты понимаешь outcomes и их отличия.
2) Как ты планируешь покрывать каждый facet.
3) Твою стратегию по reverse-item (как сделать их неочевидными) и dual-outcome (как связать два outcomes логично).
4) Проверку анти-дубликатов: почему новые вопросы не являются перефразированием старых.

На основе переданного blueprint:
1) Сгенерировать набор вопросов (Likert 1–5) так, чтобы:
   - каждый фасет был покрыт хотя бы одним вопросом;
   - НЕ было смысловых дублей;
   - распределение весов (weights) было психометрически осмысленным;
   - были соблюдены квоты по обратным вопросам и парным вопросам (dual‑outcome).
2) Вернуть:
   - массив questions[];
   - объект scaleProfile с отчётами качества (facetCoverageReport, semanticAuditReport, reverseItemReport, dualOutcomeReport, qualityChecks).

====================================================
# 2. FEW-SHOT ПРИМЕРЫ ХОРОШИХ И ПЛОХИХ ВОПРОСОВ
====================================================

ПЛОХИЕ ВОПРОСЫ (Не делай так!):
- "Я легко злюсь и выхожу из себя." (Слишком общее, два действия "злюсь" и "выхожу" - double-barreled).
- "Я не люблю вечеринки." (Плохой reverse-item, просто добавлено отрицание "не").
- "Мне нравится читать книги, а не гулять." (Double-barreled).

ХОРОШИЕ ВОПРОСЫ (Делай так!):
- "В конфликтной ситуации я первым иду на примирение." (Конкретная ситуация).
- "Шумные компании быстро истощают мою энергию." (Хороший reverse-item для Экстраверсии, смещает фокус на энергию).
- "Когда планы резко меняются, я воспринимаю это как интересное испытание." (Описывает конкретную когнитивную реакцию).

ПРИМЕР DUAL-OUTCOME MAPPING:
Если вопрос: "В стрессовой ситуации я стараюсь взять лидерство на себя и организовать других."
\`\`\`json
"mapping": [
  { "outcomeId": "leadership", "weight": 1.0 },
  { "outcomeId": "stress_tolerance", "weight": 0.5 }
]
\`\`\`

====================================================
# 2. ФОРМАТ ВОПРОСОВ
====================================================

Каждый вопрос:
- формулируется от первого лица ("Я ...", "Мне ...", "В ситуации ... я ...");
- описывает ОДНУ ясную мысль/ситуацию (без "и/или" и двух идей в одном предложении);
- длина: 6–18 слов;
- звучит естественно для живого человека.

Likert‑шкала:
- 1: Абсолютно не согласен
- 2: Скорее не согласен
- 3: Нейтрален
- 4: Скорее согласен
- 5: Абсолютно согласен

====================================================
# 3. РАБОТА С FACETS
====================================================

Ты получаешь для каждого outcome список facets с полями (id, type, label, rationale).

Твоя стратегия:
- Минимум 1 вопрос на каждый facet (если в blueprint стоит facetCoverage = "all").
- По возможности использовать уникальные discriminators как приоритетные фасеты (они лучше всего различают outcomes).
- НЕ создавать два вопроса, которые измеряют один и тот же facet одинаковым способом.

Пример:
- facetLabel: "Инициирует встречи с друзьями".
  - Вопрос 1: "Я часто сам(а) предлагаю друзьям встретиться."
  - Плохо создавать ещё: "Я часто организую встречи с друзьями." — это дубль по смыслу.

====================================================
# 4. ЗАПРЕТ НА ДУБЛИ (ANTI-PARAPHRASE)
====================================================

КРИТИЧЕСКОЕ правило:
- если новый вопрос по смыслу более чем на ~70% похож на уже существующий вопрос — он считается дубликатом и должен быть ПЕРЕПИСАН С НУЛЯ.

Примеры плохих пар:
- "Я люблю пробовать что‑то новое." 
- "Мне нравится испытывать новые вещи."
(одна и та же идея → переписать, сделать ДРУГУЮ ситуацию)

Примеры хороших разных вопросов:
- "Я люблю пробовать что‑то новое."
- "Если мне предлагают незнакомый опыт, я обычно соглашаюсь."
(похожий конструкт, но разные аспекты поведения в разных ситуациях)

====================================================
# 5. ПСИХОМЕТРИЧЕСКИЙ MAPPING (weights)
====================================================

Модель Likert 1–5 переводится системой в 0–10, а потом веса применяются к outcomes.

Допустимые значения weight:
- -2.0, -1.0, -0.5, 0.5, 1.0, 2.0

Смысл:
- 1.0 — стандартная прямая связь с outcome.
- 2.0 — очень сильный ключевой индикатор (максимум 0–2 вопроса на весь тест, максимум 1 на outcome).
- 0.5 — слабый/вторичный индикатор.
- -1.0 — обратный вопрос (reverse item).
- -0.5 — слабый обратный вклад.

Правило знака:
- Если СОГЛАСИЕ с вопросом усиливает черту outcome → вес положительный.
- Если СОГЛАСИЕ с вопросом означает "меньше" этой черты → вес отрицательный.

Пример:
- Outcome: "Экстраверсия".
  - Вопрос: "Я заряжаюсь энергией на вечеринках." → outcomeId = "extraversion", weight = 1.0.
  - Вопрос: "Я избегаю шумных компаний." → можно outcomeId = "extraversion", weight = -1.0.

Поле polarity:
- "direct" — все веса в mapping положительные.
- "reverse" — все веса в mapping отрицательные.
- "mixed" — есть и плюс, и минус (обычно при dual‑outcome вопросах).

====================================================
# 6. RATIO: ОДНО‑ И ДВУХШКАЛЬНЫЕ ВОПРОСЫ
====================================================

Структура mapping у вопроса:
"mapping": [
  { "outcomeId": "o1", "weight": 1.0 },
  { "outcomeId": "o2", "weight": -0.5 }
]

Ограничения:
- 70–80% вопросов → строго один outcome в mapping.
- 20–30% вопросов → ровно два outcomes (dual‑outcome).
- Строго запрещено давать вопросу 3 и более outcomes.

Для dual‑outcome вопросов:
- один outcome — основной (вес 1.0 или 2.0),
- второй — вторичный (0.5 или -0.5),
- не делай один outcome "хабом" (чтобы он не участвовал в чрезмерно большом количестве dual‑вопросов).

====================================================
# 7. КВОТА ОБРАТНЫХ ВОПРОСОВ (REVERSE ITEMS)
====================================================

Цель: примерно 1/3 вопросов должны быть reverse.

Формула:
reverseCount ≈ round(totalQuestions * 0.33)

Пример:
- totalQuestions = 9 → reverseCount ≈ 3.
- totalQuestions = 10 → reverseCount ≈ 3–4.

Требования к reverse‑вопросам:
- это НЕ просто фраза с частицей "не".
- это действительно противоположная по смыслу ситуация/позиция.

Плохо:
- "Я люблю людей." / "Я не люблю людей."

Хорошо:
- "Я люблю шумные компании." / "Я лучше проведу вечер в одиночестве с книгой."

====================================================
# 8. ПРОЦЕСС ГЕНЕРАЦИИ (ШАГИ)
====================================================

1) Прочитай blueprint:
   - testType, constructDefinition;
   - outcomes, facets, discriminators;
   - questionRequirements (totalQuestions, reverseItems, dualOutcomeItems);
   Если во входящем тексте присутствует строка
    "QUESTIONS_COUNT: N"
    (где N — целое число), то
    - ты обязан сгенерировать РОВНО N вопросов,
    - даже если questionRequirements.totalQuestions в blueprint предлагает другое число.
    Если N выходит за разумные пределы (меньше 5 или больше 69), ты всё равно генерируешь, но можешь кратко отметить это во внутреннем summary в scaleProfile.
    Если указан QUESTIONS_COUNT во входящем тексте, используй его как фактическое totalQuestions, игнорируя значение totalQuestions в blueprint.

2) Для каждого outcome:
   - составь ментальный образ человека с высоким и низким уровнем черты;
   - пойми, как проявляются каждый facet в поведении/мыслях/эмоциях/выборе/стрессе.

3) Для каждого facet:
   - сгенерируй 1 вопрос, который максимально чётко измеряет именно этот facet;
   - проверь, не дублирует ли он уже сгенерированный вопрос;
   - назначь mapping (outcomeId, weight);
   - отметь facetId.

4) Когда все facets покрыты, при необходимости:
   - добей общее количество вопросов до totalQuestions за счёт дополнительных ситуаций,
   - следи, чтобы доп. вопросы НЕ были просто повтором уже измеренных аспектов.

5) Распредели reverse‑вопросы:
   - добейся целевого количества reverseItems.
   - следи, чтобы они были распределены по разным outcomes.

6) Добавь dual‑outcome вопросы:
   - добейся нужной доли (20–30% от totalQuestions);
   - не делай ни один outcome "центральным узлом".

====================================================
# 9. САМОПРОВЕРКА ПЕРЕД ВЫВОДОМ JSON
====================================================

ПЕРЕД тем как вернуть JSON, ты проверяешь:

1) Семантическое разнообразие:
   - нет пар вопросов, где смысл совпадает >70%;
   - если такие пары есть — переписываешь лишние вопросы.

2) Facet coverage:
   - каждый facet из blueprint имеет ≥1 вопрос;
   - нет незакрытых facets.

3) Reverse items:
   - количество обратных примерно соответствует целевому;
   - reverse‑вопросы — смысловые антиподы, а не механические отрицания.

4) Dual‑outcome:
   - их процент в пределах диапазона;
   - нет outcome, который участвует в слишком большом числе dual‑вопросов.

5) Weights:
   - weight = 2.0 используется очень редко (0–2 раза на весь тест, максимум 1 раз на outcome);
   - знаки весов соответствуют психологическому смыслу.

Если что‑то не сходится — ты правишь вопросы и только потом возвращаешь результат.

====================================================
# 10. ФОРМАТ ОТВЕТА (ОБЯЗАТЕЛЬНО)
====================================================

Верни СТРОГО ОДИН JSON‑объект следующей структуры:

{
  "_reasoning": "Пошаговое описание: как ты создавал вопросы, проверял анти-дубликаты и баланс по outcomes.",
  "meta": {
    "topic": "Тема теста (на русском)",
    "language": "Russian",
    "voice": "neutral-psychological",
    "likertScale": "1-5 (Абсолютно не согласен — Абсолютно согласен)"
  },

  "scaleProfile": {
    "facetCoverageReport": {
      "facetStatus": [
        {
          "facetId": "o1_behavior",
          "facetLabel": "Краткое описание фасета",
          "questionsCovering": [
            { "id": "q1", "text": "Текст вопроса", "type": "primary" }
          ],
          "covered": true
        }
      ],
      "uncoveredFacets": [],
      "summary": "Краткий текст: сколько facets покрыто, сколько вопросов всего."
    },

    "semanticAuditReport": {
      "totalPairwiseComparisons": 36,
      "redundantPairs": 0,
      "nearDuplicates": 0,
      "averageSimilarity": 0.30,
      "maxSimilarity": 0.60,
      "summary": "Сводка о разнообразии вопросов."
    },

    "reverseItemReport": {
      "targetReverse": 3,
      "actualReverse": 3,
      "byOutcome": {
        "o1": 2,
        "o2": 1
      },
      "qualityCheck": "Краткий комментарий о качестве обратных вопросов.",
      "summary": "Итоговая оценка по обратным вопросам."
    },

    "dualOutcomeReport": {
      "targetDualPercentage": "20-30%",
      "dualItems": 2,
      "totalItems": 9,
      "actualPercentage": "22%",
      "pairs": [
        {
          "itemId": "q7",
          "primaryOutcome": "o1",
          "secondaryOutcome": "o2",
          "weights": [1.0, 0.5]
        }
      ],
      "hubCheck": "Нет outcome, который выступает хабом.",
      "summary": "Итоговая оценка по dual‑outcome вопросам."
    },

    "qualityChecks": {
      "semanticDiversity": "✓ PASS",
      "facetCoverage": "✓ PASS",
      "reverseBalance": "✓ PASS",
      "weightDistribution": "✓ PASS",
      "overallValidity": "High confidence",
      "concerns": []
    }
  },

  "questions": [
    {
      "id": "q1",
      "text": "Текст вопроса на русском, 6–18 слов.",
      "mapping": [
        { "outcomeId": "o1", "weight": 1.0 }
      ],
      "polarity": "direct",
      "facetId": "o1_behavior"
    }
    // остальные вопросы
  ]
}
`,architect_quiz:`Ты — Геймдизайнер Интеллектуальных Викторин.
Твоя задача — создать систему грейдов (званий) на основе количества правильных ответов.
Весь диапазон возможных очков (от 0 до MAX) должен быть покрыт.

ПРИМЕР ГРЕЙДОВ (для 10 вопросов):
- 0-3: "Новичок" (Описание: Ты только начал путь...)
- 4-7: "Любитель" (Описание: Неплохо, но есть куда расти...)
- 8-9: "Знаток" (Описание: Отличные знания!)
- 10-10: "Грандмастер" (Описание: Идеально! Ты знаешь всё!)

ВАЖНО:
- Названия званий должны соответствовать Теме (для Гарри Поттера: "Маггл", "Ученик", "Мракоборец").
- Язык: Строго РУССКИЙ.`,generator_quiz:`Ты — Ведущий Интеллектуальной Викторины.
Твоя задача — создать вопросы для проверки знаний по теме.

ПРАВИЛА ДЛЯ ВОПРОСОВ:
1. **Язык**: Строго РУССКИЙ.
2. **Сложность**: Вопросы должны быть интересными, не банальными.
3. **Количество вариантов**: Строго следуй указанию из запроса (2, 3 или 4). Только один верный, остальные ложные, но правдоподобные.
4. **Юмор**: Если тема позволяет, иногда добавляй легкий юмор в один или несколько неправильных ответов.
5. Всегда указывай точный correctIndex.`};console.log("App Settings Loaded v6.5 Final");const O={detectProvider(e){return e.startsWith("AIza")?"gemini":"openrouter"},safeParseJSON(e){if(!e||typeof e!="string")return e;try{return JSON.parse(e)}catch{const i=e.match(/\{[\s\S]*\}$/);if(i)try{return JSON.parse(i[0])}catch{}const s=e.match(/```json([\s\S]*?)```/);if(s)try{return JSON.parse(s[1])}catch{}throw new Error("JSON Parse Error")}},async call(e,t,i,s){const o=this.detectProvider(s),n=L[o][e];console.log("API provider",o,"task",e);const c=e.startsWith("architect_")?"architect":"generator";return o==="gemini"?this.callGemini(n,t,i,c,s):this.callOpenRouter(n,t,i,c,s)},async callOpenRouter(e,t,i,s,o){const n=v.providers.openrouter.models[s],a=[{role:"system",content:e},{role:"user",content:`Сгенерируй ответ в формате строго валидного JSON по этой JSON Schema:

`+JSON.stringify(i,null,2)+`

`+t}],c=await fetch(v.providers.openrouter.endpoint,{method:"POST",headers:v.providers.openrouter.headers(o),body:JSON.stringify({model:n,messages:a,response_format:{type:"json_object"},temperature:.7})});if(!c.ok){const d=await c.text();throw new Error(`OpenRouter API Error (${c.status}): ${d}`)}const r=await c.json(),u=r?.choices?.[0]?.message?.content;if(!u)throw new Error("Invalid response format from OpenRouter: "+JSON.stringify(r));return this.safeParseJSON(u)},async callGemini(e,t,i,s,o){const n=v.providers.gemini.models[s],a=s==="architect"?.5:.7,c=e+`

Сгенерируй ответ в формате строго валидного JSON по этой JSON Schema:

`+JSON.stringify(i,null,2)+`

`+t,r=await fetch(v.providers.gemini.endpoint+n+":generateContent?key="+o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:c}]}],generationConfig:{temperature:a}})});if(!r.ok){const l=await r.text();throw new Error(`Gemini API Error (${r.status}): ${l}`)}const u=await r.json(),d=u?.candidates?.[0]?.content?.parts?.[0]?.text;if(!d)throw new Error("Invalid response format from Gemini: "+JSON.stringify(u));return this.safeParseJSON(d)}},k=/[&<>"']/g,y={escapeHtml:e=>typeof e!="string"?e:e.replace(k,t=>{switch(t){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";case"'":return"&#039;"}})},H=(e,t)=>{const i=document.getElementById(e);if(!i)return;const s=i.type==="password";i.type=s?"text":"password",t.innerHTML=s?"🙈":"👁️",t.setAttribute("aria-label",s?"Скрыть API ключ":"Показать API ключ")},_={init(){window.onerror=(e,t,i,s,o)=>{this.saveLog({type:"error",message:e,source:t,lineno:i,colno:s,stack:o?.stack})},window.addEventListener("unhandledrejection",e=>{this.saveLog({type:"unhandledrejection",reason:e.reason?.toString()})})},saveLog(e){try{const t=JSON.parse(localStorage.getItem("app_logs")||"[]");t.unshift({...e,time:new Date().toISOString()}),t.length>50&&t.pop(),localStorage.setItem("app_logs",JSON.stringify(t))}catch{}}},b={KEY:"ai_tests_library_v2",_cache:null,_htmlItems:null,_renderedHtmlCache:null,_themesCache:null,_getThemes(){if(this._themesCache)return this._themesCache;const e=this.getAll();this._themesCache=new Set;for(const t of e)this._themesCache.add(t.theme);return this._themesCache},getAll(){if(this._cache)return this._cache;const e=localStorage.getItem(this.KEY);return this._cache=e?JSON.parse(e):[],this._cache},getById(e){return this.getAll().find(i=>i.id===e)},_renderTestItem(e){const s=(e.blueprint.testType||"categorical")==="quiz"?"🧠":"🧩",o=e.questions?e.questions.length:0,n=e.shortUrl?`
            <div style="margin-top:6px; font-size: 12px; color: var(--text-muted);">
                🔗 Короткая ссылка:&nbsp;
                <button class="btn-text list-action-btn" style="padding:0; font-size:12px;" data-action="copy-shorturl" data-url="${y.escapeHtml(e.shortUrl)}">
                    открыть / скопировать
                </button>
            </div>`:"";return`
        <div class="card" style="padding: 20px; display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 24px; flex-shrink: 0;">${s}</div>

            <div style="flex-grow: 1; min-width: 0;"> <!-- min-width fix for flexbox truncation -->
                <h3 style="margin: 0 0 5px; font-size: 16px; line-height: 1.4; word-wrap: break-word;">${y.escapeHtml(e.theme)}</h3>
                <div style="font-size: 12px; color: var(--text-muted);">
                    ${y.escapeHtml(e.date)} • ${o} вопросов
                </div>
                ${n}
            </div>

            <div style="display:flex; gap:10px; align-items: center; flex-shrink: 0;">
                <button class="btn list-action-btn" data-action="load-test" data-id="${e.id}"
                    style="width: auto; padding: 8px 16px; font-size: 14px; white-space: nowrap;"
                    aria-label="Начать тест: ${y.escapeHtml(e.theme)}">
                    ▶ Начать
                </button>
                <button class="btn-delete list-action-btn" data-action="delete-test" data-id="${e.id}"
                    title="Удалить"
                    aria-label="Удалить тест: ${y.escapeHtml(e.theme)}">
                    🗑
                </button>
            </div>
        </div>`},save(e,t,i,s){const o=this.getAll();let n=i,a=2;const c=this._getThemes();for(;c.has(n);)n=`${i} (${a})`,a++;const r={id:"test_"+Date.now(),date:new Date().toLocaleDateString("ru-RU",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),theme:n,blueprint:e,questions:t,shortUrl:s||null};if(o.unshift(r),localStorage.setItem(this.KEY,JSON.stringify(o)),this._themesCache&&this._themesCache.add(n),this._htmlItems){const u=this._renderTestItem(r);this._htmlItems.unshift(u),this._renderedHtmlCache&&(this._renderedHtmlCache=u+this._renderedHtmlCache)}else this._renderedHtmlCache=null;return n},delete(e){const t=this.getAll(),i=t.findIndex(s=>s.id===e);if(i>-1){const s=t[i].theme;t.splice(i,1),localStorage.setItem(this.KEY,JSON.stringify(t)),this._themesCache&&this._themesCache.delete(s),this._htmlItems&&this._htmlItems.splice(i,1),this._renderedHtmlCache=null}},renderLibraryHTML(){const e=this.getAll();return e.length===0?`<div style="text-align:center; padding:40px; color:var(--text-muted);">
                <div style="font-size:40px; margin-bottom:10px;">📭</div>
                Библиотека пуста.<br>Создайте свой первый тест!
            </div>`:this._renderedHtmlCache?this._renderedHtmlCache:((!this._htmlItems||this._htmlItems.length!==e.length)&&(this._htmlItems=e.map(t=>this._renderTestItem(t))),this._renderedHtmlCache=this._htmlItems.join(""),this._renderedHtmlCache)}};typeof window<"u"&&window.addEventListener("storage",e=>{e.key===b.KEY&&(b._cache=null,b._htmlItems=null,b._renderedHtmlCache=null,b._themesCache=null)});const T={getBaseScore(e,t){const i=e!=null?Number(e):3;if(t&&typeof t=="object"){const s=t[String(i)];if(typeof s=="number"&&Number.isFinite(s))return s}return(i-1)*2.5},pickBandLabel(e,t){if(!e)return null;if(Array.isArray(e)){for(const i of e){if(!i||typeof i!="object")continue;const s=typeof i.min=="number"?i.min:typeof i.from=="number"?i.from:null,o=typeof i.max=="number"?i.max:typeof i.to=="number"?i.to:null;if(!(s==null||o==null)&&t>=s&&t<=o)return i.label||i.name||i.title||null}return null}if(typeof e=="object")for(const i of Object.keys(e)){const s=e[i];if(!s||typeof s!="object")continue;const o=typeof s.min=="number"?s.min:typeof s.from=="number"?s.from:null,n=typeof s.max=="number"?s.max:typeof s.to=="number"?s.to:null;if(!(o==null||n==null)&&t>=o&&t<=n)return s.label||s.name||i||null}return null},calculatePsyScores(e){const t=e.blueprint.scaleProfile||null,i=t&&t.baseScoreMap||null,s={},o={},n={},a=e.blueprint.outcomes||[];a.forEach(r=>{s[r.id]=0,o[r.id]={minRaw:0,maxRaw:0},n[r.id]={sumAbsWeight:0,numItems:0,numReverseItems:0,numTwoOutcomeItems:0}}),e.questions&&e.answers&&e.questions.forEach((r,u)=>{const d=e.answers[u]!==void 0?e.answers[u]:3,l=this.getBaseScore(d,i);if(!r.mapping)return;const p=r.mapping.length;r.mapping.forEach(h=>{if(s[h.outcomeId]===void 0)return;const m=h.weight||1,g=Math.abs(m),B=(m>=0?1:-1)===1?l:10-l;s[h.outcomeId]+=B*g,o[h.outcomeId].minRaw+=0*g,o[h.outcomeId].maxRaw+=10*g;const I=n[h.outcomeId];I.sumAbsWeight+=g,I.numItems+=1,m<0&&(I.numReverseItems+=1),p===2&&(I.numTwoOutcomeItems+=1)})});const c={};return a.forEach(r=>{const u=o[r.id].minRaw,l=o[r.id].maxRaw-u;l>0?c[r.id]=Math.max(0,Math.min(100,Math.round((s[r.id]-u)/l*100))):c[r.id]=0}),{scores:s,potential:o,structure:n,percentages:c,interpretationBands:t?t.interpretationBands:null}}},q=new Set,$={step:0,mode:"psy",psy:{},quiz:{},duel:{},answers:[],questions:[],blueprint:null,quizScore:0,duelHostName:null,duelHostScore:null,duelHostResultName:null},z=new Proxy({...$},{set(e,t,i){return e[t]=i,q.forEach(s=>s(t,i,e)),!0}});function R(e){return q.add(e),()=>q.delete(e)}class f extends Error{constructor(t){super(t),this.name="ValidationError"}}function C(e,t,i){if(!e||typeof e!="object")throw new f("Ответ не является объектом JSON.");if(i){if(t){if(!e.outcomes||!Array.isArray(e.outcomes)||e.outcomes.length===0)throw new f("В викторине отсутствуют уровни (outcomes).")}else if(e.testType==="dimensional"){if(!e.constructDefinition||!e.outcomes||!Array.isArray(e.outcomes)||e.outcomes.length===0)throw new f("Отсутствует constructDefinition или outcomes в dimensional тесте.")}else if(e.testType==="categorical"){if(!e.outcomes||!Array.isArray(e.outcomes)||e.outcomes.length===0)throw new f("Отсутствуют outcomes в categorical тесте.")}else throw new f("Неизвестный testType или отсутствует.");return!0}const s=e.questions||(Array.isArray(e)?e:null);if(!s||!Array.isArray(s))throw new f("Поле 'questions' должно быть массивом или корень должен быть массивом.");if(s.length===0)throw new f("Массив 'questions' не должен быть пустым.");for(let o=0;o<s.length;o++){const n=s[o];if(!n.text)throw new f(`Вопрос #${o+1} не имеет текста (text).`);if(t){if(!n.options||!Array.isArray(n.options)||typeof n.correctIndex!="number")throw new f(`Вопрос #${o+1} викторины должен содержать массив options и число correctIndex.`)}else if(!n.mapping||!Array.isArray(n.mapping)||n.mapping.length===0)throw new f(`Вопрос #${o+1} психологического теста должен содержать непустой массив mapping.`)}return!0}const P={get state(){return z},ui:{},initUI(){this.ui.setupView=document.getElementById("setupView"),this.ui.testView=document.getElementById("testView"),this.ui.resultsView=document.getElementById("resultsView"),this.ui.libraryView=document.getElementById("libraryView"),this.ui.duelView=document.getElementById("duelView"),this.ui.qNum=document.getElementById("qNum"),this.ui.qText=document.getElementById("qText"),this.ui.progressBar=document.getElementById("progressBar"),this.ui.backBtn=document.getElementById("backBtn"),this.ui.psyContainer=document.getElementById("psyContainer"),this.ui.quizContainer=document.getElementById("quizContainer"),this.ui.inProgressSaveBtn=document.getElementById("inProgressSaveBtn"),this.ui.inProgressShareBtn=document.getElementById("inProgressShareBtn"),this.ui.psyButtons=this.ui.psyContainer.querySelectorAll(".likert-opt")},init(){typeof _<"u"&&_.init(),this.initUI();const e=localStorage.getItem("user_api_key");if(e){const i=document.getElementById("apiKeyInput");i&&(i.value=e)}this.checkHash(),this.runDuelHashRegressionCheck(),window.onpopstate=()=>{history.replaceState(null,document.title,window.location.pathname),location.reload()};const t=document.getElementById("setupForm");t&&t.addEventListener("submit",i=>this.start(i)),document.getElementById("tabPsy")?.addEventListener("click",()=>this.setMode("psy")),document.getElementById("tabQuiz")?.addEventListener("click",()=>this.setMode("quiz")),document.getElementById("backBtn")?.addEventListener("click",()=>this.prevQuestion()),document.getElementById("psyContainer")?.addEventListener("click",i=>this.handlePsyClick(i)),document.addEventListener("click",i=>{const s=i.target.closest("[data-action]");if(!s)return;const o=s.dataset.action;if(o==="togglePassword"){const n=s.dataset.target;H(n,s)}else if(o==="closeLibrary")this.closeLibrary();else if(o==="startDuel")this.startDuelTest();else if(o==="prevQuestion")this.prevQuestion();else if(o==="saveTestBtn")this.saveTest(s);else if(o==="createShareLink")this.createShareLink(s);else if(o==="load-test")this.loadSavedTest(s.dataset.id);else if(o==="delete-test")this.deleteTest(s.dataset.id,s);else if(o==="copy-shorturl"){const n=s.dataset.url;navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(n).then(()=>this.showToast("Ссылка скопирована! 📋")):prompt("Ссылка:",n)}else o==="quizAnswer"&&this.handleQuizAnswer(parseInt(s.dataset.index,10),s)}),document.getElementById("openLibraryBtn")?.addEventListener("click",()=>this.openLibrary()),R((i,s,o)=>{if((i==="step"||i==="questions")&&o.questions&&o.questions.length>0&&(o.step<o.questions.length?(this.renderQ(),this.setView("test")):(this.calc(),this.setView("results"))),i==="mode"){document.getElementById("tabPsy")?.classList.toggle("active",s==="psy"),document.getElementById("tabQuiz")?.classList.toggle("active",s==="quiz");const n=document.getElementById("audienceGroup"),a=document.getElementById("difficultyGroup");n&&(n.style.display=s==="psy"?"block":"none"),a&&(a.style.display=s==="quiz"?"block":"none");const c=document.getElementById("themeInput");c&&(c.placeholder=s==="psy"?"Тема психологического теста...":"Тема викторины...")}}),this.setView("setup")},normalizePsyQuestions(e){const t=[-2,-1,-.5,.5,1,2],i=s=>{const o=Number(s);if(!Number.isFinite(o))return 1;let n=t[0],a=Math.abs(o-n);for(let c=1;c<t.length;c++){const r=Math.abs(o-t[c]);r<a&&(a=r,n=t[c])}return n};return Array.isArray(e)?e.map(s=>{if(!s||!Array.isArray(s.mapping))return s;let o=s.mapping.filter(n=>n&&typeof n.outcomeId=="string").map(n=>{const a=i(n.weight);return{...n,weight:a}});if(o.length===0)return s;if(o.length>2&&(o.sort((n,a)=>Math.abs(a.weight)-Math.abs(n.weight)),o=o.slice(0,2)),!s.polarity){const n=o.some(r=>r.weight>0),a=o.some(r=>r.weight<0);let c="direct";n&&a?c="mixed":a&&!n&&(c="reverse"),s.polarity=c}return{...s,mapping:o}}):e},showToast(e){const t=document.getElementById("toast");t&&(t.innerText=e,t.className="show",setTimeout(()=>{t.className=t.className.replace("show","")},3e3))},async extractDuelPayloadFromHash(e){if(typeof e!="string")return null;const i=["#d=","#d:"].find(c=>e.startsWith(c));if(!i)return null;const{default:s}=await x(async()=>{const{default:c}=await import("./lz-string-CIdnL-Gu.js").then(r=>r.l);return{default:c}},[]),o=e.substring(i.length),n=s.decompressFromEncodedURIComponent(o);if(!n)return null;const a=JSON.parse(n);return!a||!a.t||!a.q?null:a},async buildDuelHashFromPayload(e){const{default:t}=await x(async()=>{const{default:o}=await import("./lz-string-CIdnL-Gu.js").then(n=>n.l);return{default:o}},[]),i=JSON.stringify(e);return`#d=${t.compressToEncodedURIComponent(i)}`},async runDuelHashRegressionCheck(){try{const e={h:"Regression",s:1,r:null,t:{theme:"Regression",testType:"quiz"},q:[{text:"Q1"}]},t=await this.buildDuelHashFromPayload(e),i=t.replace("#d=","#d:"),s=await this.extractDuelPayloadFromHash(t),o=await this.extractDuelPayloadFromHash(i),n=await this.buildDuelHashFromPayload(o);t.startsWith("#d=")&&s&&o&&n.startsWith("#d=")||console.error("Duel hash regression check failed")}catch(e){console.error("Duel hash regression check failed",e)}},async checkHash(){if(window.location.hash.startsWith("#d=")||window.location.hash.startsWith("#d:")){try{const e=await this.extractDuelPayloadFromHash(window.location.hash);if(e){this.state.mode="duel",this.state.blueprint=e.t,this.state.questions=e.q,this.state.duelHostName=e.h,this.state.duelHostScore=e.s??0,this.state.duelHostResultName=e.r??null,this.showDuelIntro();return}}catch(e){console.error("Link Error",e)}window.location.hash=""}},showDuelIntro(){document.getElementById("setupView").style.display="none";const e=document.getElementById("duelView"),t=this.state.blueprint.testType==="quiz",i=t?"Викторина-домашка":"Дуэль-тест";let s;if(t)s=`<strong style="color:#fff">${y.escapeHtml(this.state.duelHostName)}</strong> вызвал(а) тебя на викторину!`;else{const c=this.state.duelHostResultName?`<strong style="color:var(--accent)">${y.escapeHtml(this.state.duelHostResultName)}</strong>`:"";s=`<strong style="color:#fff">${y.escapeHtml(this.state.duelHostName)}</strong> уже прошёл(ла) этот тест. ${c?"<br>"+c:""}`}const o=e.querySelector("h1");o&&(o.innerText=i);const n=e.querySelector("p");n&&(n.innerHTML=s),document.getElementById("duelThemeTitle").innerText=this.state.blueprint.theme||"",document.getElementById("duelQCount").innerText=this.state.questions.length.toString(),e.style.display="block";const a=document.getElementById("duelStartBtn");a&&(a.onclick=()=>this.startDuelTest())},startDuelTest(){document.getElementById("duelView").style.display="none",this.state.answers=[],this.state.quizScore=0,(this.state.blueprint.testType||"categorical")==="quiz"?this.state.mode="duel":this.state.mode="duel",this.state.step=0},openLibrary(){this.setView("library");const e=document.getElementById("libraryContent");e&&(e.innerHTML=b.renderLibraryHTML())},closeLibrary(){this.setView("setup")},setMode(e){this.state.mode=e},async start(e){e.preventDefault(),this.state.step=0,this.state.answers=[],this.state.quizScore=0,this.state.blueprint=null,this.state.questions=[],this.state.duelHostName=null;const t=document.getElementById("apiKeyInput").value.trim(),i=document.getElementById("themeInput").value.trim(),s=document.getElementById("notesInput").value,o=document.getElementById("qCountInput").value;if(!i){this.showToast("Введите тему теста! 📝"),document.getElementById("themeInput").focus();return}if(!t){this.showToast("API ключ обязателен! 🔑"),document.getElementById("apiKeyInput").focus();return}localStorage.setItem("user_api_key",t);const n=this.state.mode==="quiz",a=n?document.getElementById("difficultyInput").value:document.getElementById("audienceInput").value,c=n?"quiz":"psy";let r=0;const u=3;let d=null;for(document.getElementById("errorBox").style.display="none";r<u;){r++,this.setLoading(!0,r===1?"Генерируем архитектуру теста...":`Исправляем ошибки AI (Попытка ${r}/${u})...`);try{let l=`${i}.
Контекст: ${a}.
Доп. заметки: ${s||"нет"}.`;r>1&&d&&(l+=`

ВНИМАНИЕ! Твой предыдущий ответ вызвал ошибку проверки: ${d.message}
Пожалуйста, исправь эту ошибку и верни строго валидный JSON по схеме.`),this.state.blueprint=await O.call("architect_"+c,l,n?S.quiz_blueprint:S.psy_blueprint,t),C(this.state.blueprint,n,!0),this.state.blueprint.theme=i,this.setLoading(!0,"Генерируем вопросы...");const p=n?Number(document.getElementById("difficultyInput").value||0):0;let h=`${i}
BLUEPRINT:
${JSON.stringify(this.state.blueprint,null,2)}
QUESTIONS_COUNT: ${o}
${n?`QUIZ_OPTIONS: ${p}`:""}
NOTES: ${s||"нет"}`;r>1&&d&&this.state.blueprint&&(h+=`

ВНИМАНИЕ! Твой предыдущий ответ вызвал ошибку проверки: ${d.message}
Пожалуйста, исправь эту ошибку и сгенерируй строго валидный JSON по схеме.`);const m=await O.call("generator_"+c,h,n?S.quiz_questions:S.psy_questions,t),g=m&&typeof m=="object"&&Array.isArray(m.questions),w=g?m.questions:m;C(m,n,!1),this.state.questions=w,g&&(m.meta&&(this.state.blueprint.meta=m.meta),m.scaleProfile&&(this.state.blueprint.scaleProfile=m.scaleProfile),Array.isArray(m.outcomes)&&m.outcomes.length&&(this.state.blueprint.outcomes=m.outcomes)),!n&&Array.isArray(this.state.questions)&&(this.state.questions=this.normalizePsyQuestions(this.state.questions));break}catch(l){if(d=l,console.warn(`Attempt ${r} failed:`,l),r>=u){this.setLoading(!1);const p=document.getElementById("errorBox");p.style.display="block",p.textContent=l.message||"Ошибка генерации",this.setView("setup");return}}}this.setLoading(!1)},renderQ(){const e=this.state.questions[this.state.step];if(!e)return;const t=this.state.questions.length,i=this.state.mode==="quiz"||this.state.mode==="duel"&&this.state.blueprint.testType==="quiz";this.ui.qNum&&(this.ui.qNum.innerText=(this.state.step+1).toString()+"/"+t.toString()),this.ui.qText&&(this.ui.qText.innerText=e.text),this.ui.progressBar&&(this.ui.progressBar.style.width=(this.state.step+1)/t*100+"%"),this.updateInProgressActions();const s=this.ui.backBtn;s&&(s.style.visibility=!i&&this.state.step>0?"visible":"hidden");const o=this.ui.psyContainer,n=this.ui.quizContainer;if(i){if(o&&(o.style.display="none"),n){n.style.display="flex";let a="";e.options.forEach((c,r)=>{a+=`<button class="quiz-opt" data-action="quizAnswer" data-index="${r}">${y.escapeHtml(c)}</button>`}),n.innerHTML=a}}else{o&&(o.style.display="grid"),n&&(n.style.display="none");const a=this.ui.psyButtons;if(a){a.forEach(r=>{r.classList.remove("selected"),r.setAttribute("aria-pressed","false")});const c=this.state.answers[this.state.step];if(c!==void 0){const r=a[c-1];r&&(r.classList.add("selected"),r.setAttribute("aria-pressed","true"))}}}},handlePsyClick(e){const t=e.target.closest(".likert-opt");if(!t)return;const i=parseInt(t.dataset.value,10);this.handlePsyAnswer(i)},handlePsyAnswer(e){this.state.answers[this.state.step]=e;const t=this.ui.psyButtons;t&&(t.forEach(i=>{i.classList.remove("selected"),i.setAttribute("aria-pressed","false")}),t[e-1]&&(t[e-1].classList.add("selected"),t[e-1].setAttribute("aria-pressed","true"))),setTimeout(()=>this.nextQuestion(),300)},handleQuizAnswer(e,t){const i=this.state.questions[this.state.step];e===i.correctIndex?(t.classList.add("correct"),this.state.quizScore++):t.classList.add("wrong");const o=document.querySelectorAll(".quiz-opt");o[i.correctIndex]&&o[i.correctIndex].classList.add("correct"),document.querySelectorAll(".quiz-opt").forEach(n=>{n.classList.add("disabled"),n.disabled=!0}),setTimeout(()=>this.nextQuestion(),1200)},nextQuestion(){this.state.step++},prevQuestion(){this.state.step>0&&this.state.step--},getShareButtonText(){return this.state.mode==="quiz"||this.state.mode==="duel"&&this.state.blueprint&&this.state.blueprint.testType==="quiz"?"Поделиться викториной":"Создать дуэль-ссылку"},updateInProgressActions(){this.ui.inProgressShareBtn&&(this.ui.inProgressShareBtn.innerText=this.getShareButtonText(),this.ui.inProgressShareBtn.disabled=!1),this.ui.inProgressSaveBtn&&(this.ui.inProgressSaveBtn.innerText="Сохранить тест",this.ui.inProgressSaveBtn.disabled=!1)},calc(){const e=this.state.blueprint.outcomes,t=document.getElementById("resContent");let i="",s="";if(this.state.mode==="quiz"||this.state.mode==="duel"&&this.state.blueprint.testType==="quiz"){const n=this.state.quizScore,a=this.state.questions.length,c=e.find(u=>n>=u.minScore&&n<=u.maxScore)||e[0];s=c.name;let r="";if(this.state.mode==="duel"){const u=this.state.duelHostScore,d=this.state.duelHostName;let l,p;n>u?(l="Ты выиграл дуэль!",p="#4caf50"):n===u?(l="Ничья!",p="#ffd700"):(l="Ты проиграл дуэль.",p="#f44336"),r=`
          <div style="background:rgba(255,255,255,0.1);padding:15px;border-radius:12px;margin:20px 0;border:1px solid rgba(255,255,255,0.2);">
            <h3 style="margin:0 0 10px;color:${p}">${y.escapeHtml(l)}</h3>
            <div style="display:flex;justify-content:space-around;">
              <div>
                <div><strong>${n}</strong></div>
                <div>Ты</div>
              </div>
              <div>
                <div><strong>${u}</strong></div>
                <div>${y.escapeHtml(d)}</div>
              </div>
            </div>
          </div>
        `}i+=`
        <div style="text-align:center;">
          <div style="font-size:14px;color:var(--text-muted);margin-bottom:10px;">Твой результат</div>
          <h1 style="font-size:56px;margin:0;color:var(--primary)">${n} <span style="font-size:24px;color:var(--text-muted)">/ ${a}</span></h1>
          ${r}
          <h2 style="margin:15px 0 20px;">${y.escapeHtml(c.name)}</h2>
          <p style="font-size:18px;">${y.escapeHtml(c.description)}</p>
        </div>
      `}else{const{structure:n,percentages:a,interpretationBands:c}=T.calculatePsyScores(this.state),r=this.state.blueprint.scaleProfile||null;let u="",d=null;if(r&&r.qualityChecks)try{d=JSON.stringify(r.qualityChecks,null,2)}catch{d=String(r.qualityChecks)}if(u+='<div class="diag-card">',u+='<details open><summary class="diag-summary">Диагностика (структура & веса)</summary>',u+='<div class="diag-body">',u+='<div class="diag-outcomes">',e.forEach(l=>{const p=a[l.id]??0,h=T.pickBandLabel(c,p),m=n[l.id],g=m.numItems>0?Math.round(m.numReverseItems/m.numItems*100):0,w=m.numItems>0?Math.round(m.numTwoOutcomeItems/m.numItems*100):0;u+=`
          <div class="diag-row">
            <div class="diag-row-main">
              <div class="diag-title">${y.escapeHtml(l.name)}</div>
              <div class="diag-sub">
                <span>${p}%</span>
                ${h?`<span>${y.escapeHtml(h)}</span>`:""}
              </div>
            </div>
            <div class="diag-meta">
              <span class="diag-pill">∑|w| ${m.sumAbsWeight.toFixed(2)}</span>
              <span class="diag-pill">items ${m.numItems}</span>
              <span class="diag-pill">reverse ${m.numReverseItems} (${g}%)</span>
              <span class="diag-pill">2-outcome ${w}%</span>
            </div>
          </div>
        `}),u+="</div>",d&&(u+=`
          <div class="diag-qc">
            <div class="diag-qc-title">qualityChecks (self-report LLM)</div>
            <pre class="diag-code">${d}</pre>
          </div>
        `),u+="</div></details></div>",this.state.blueprint.testType==="dimensional"){const l=[...e].sort((m,g)=>a[g.id]-a[m.id]),p=l[0];s=p.name;const h=T.pickBandLabel(c,a[p.id]);i+=`
          <div style="text-align:center;padding-bottom:20px;">
            <div style="font-size:12px;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px;">Твой ведущий результат</div>
            <h2 style="font-size:32px;margin:0 0 10px;color:var(--primary)">${y.escapeHtml(p.name)}</h2>
            <p style="font-size:18px;line-height:1.6;">${y.escapeHtml(p.description||"")}</p>
            <div style="margin-top:15px;font-size:28px;color:var(--accent);font-weight:bold;">${a[p.id]}%</div>
            ${h?`<div style="margin-top:8px;color:var(--text-muted);font-weight:600;">${y.escapeHtml(h)}</div>`:""}
          </div>
          <div class="results-secondary-block">
            <h4 class="results-secondary-title">Остальные результаты</h4>
        `,l.slice(1).forEach(m=>{const g=a[m.id];i+=`
            <div class="res-item">
              <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:5px;">
                <span><strong>${y.escapeHtml(m.name)}</strong></span>
                <span style="color:var(--primary);font-weight:600;font-size:15px;">${g}%</span>
              </div>
              <div class="res-bar-bg">
                <div class="res-bar-fill" style="width:${g}%;"></div>
              </div>
            </div>
          `}),i+=`</div>${u}`}else i+='<div style="text-align:center;margin-bottom:25px;"><h2>Результаты</h2></div>',e.forEach(l=>{const p=a[l.id];let h=null;typeof l.highInterpretation=="string"&&typeof l.lowInterpretation=="string"?p>=70?h=l.highInterpretation:p<=30?h=l.lowInterpretation:h=l.description||"":h=l.description||"",i+=`
            <div class="res-item">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <strong>${y.escapeHtml(l.name)}</strong>
                <span style="color:var(--primary);font-weight:600;font-size:16px;">${p}%</span>
              </div>
              <div class="res-bar-bg">
                <div class="res-bar-fill" style="width:${p}%;"></div>
              </div>
              ${h?`<div style="margin-top:6px;font-size:13px;color:var(--text-muted);">${y.escapeHtml(h)}</div>`:""}
            </div>
          `}),i+=u}this.state.lastResultName=s;const o=this.getShareButtonText();i+=`
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:30px;">
        <button id="saveTestBtn" class="btn" onclick="app.saveTest(this)" style="flex:1;">Сохранить тест</button>
        <button id="shareBtn" class="btn btn-accent" onclick="app.createShareLink(this)" style="flex:1;">${o}</button>
      </div>
    `,t.innerHTML=i,x(async()=>{const{default:n}=await import("./confetti.module-5PKC4vm3.js");return{default:n}},[]).then(({default:n})=>{n({particleCount:150,spread:70,origin:{y:.6},colors:["#6366f1","#ec4899","#06b6d4","#ffd700"]}),setTimeout(()=>{n({particleCount:50,angle:60,spread:55,origin:{x:0}}),n({particleCount:50,angle:120,spread:55,origin:{x:1}})},400)}).catch(n=>console.warn("Confetti failed to load",n))},async createShareLink(e=null){if(typeof TINYTOKEN>"u"||!TINYTOKEN)return alert("Нужен TinyURL Token!");const t=e||document.getElementById("shareBtn")||document.getElementById("inProgressShareBtn"),i=t?t.innerHTML:null;t&&(t.innerHTML="⏳ Создаем ссылку...",t.disabled=!0);try{const s=this.state.blueprint.testType==="quiz",o=this.state.quizScore,a={h:prompt("Твое имя (для отображения в дуэли):","Аноним")||"Аноним",s:s?o:0,r:s?null:this.state.lastResultName,t:this.state.blueprint,q:this.state.questions};a.t.theme||(a.t.theme=document.getElementById("themeInput").value||"Тест");const c=await this.buildDuelHashFromPayload(a),r=`${window.location.origin}${window.location.pathname}${c}`,u=await fetch("https://api.tinyurl.com/create",{method:"POST",headers:{Authorization:`Bearer ${TINYTOKEN}`,"Content-Type":"application/json"},body:JSON.stringify({url:r,domain:"tiny.one"})});if(!u.ok)throw new Error("API Error");const l=(await u.json()).data.tiny_url;navigator.clipboard&&window.isSecureContext?(await navigator.clipboard.writeText(l),this.showToast("Ссылка скопирована! Отправь другу 🚀")):prompt("Скопируй ссылку:",l)}catch(s){console.error(s),this.showToast("Ошибка создания ссылки 😢")}finally{t&&(t.innerHTML=i,t.disabled=!1)}},async saveTest(e=null){const t=this.state.blueprint.theme||document.getElementById("themeInput").value||"Тест";let i=null;try{if(typeof LZString<"u"&&typeof TINYTOKEN<"u"&&TINYTOKEN){const o=this.state.blueprint.testType==="quiz",n=this.state.quizScore,a={h:"Аноним",s:o?n:0,r:o?null:this.state.lastResultName||null,t:this.state.blueprint,q:this.state.questions};a.t.theme||(a.t.theme=t);const c=await this.buildDuelHashFromPayload(a),r=`${window.location.origin}${window.location.pathname}${c}`,u=await fetch("https://api.tinyurl.com/create",{method:"POST",headers:{Authorization:`Bearer ${TINYTOKEN}`,"Content-Type":"application/json"},body:JSON.stringify({url:r,domain:"tiny.one"})});if(u.ok){const d=await u.json();i=d&&d.data&&d.data.tiny_url?d.data.tiny_url:null}}}catch(o){console.warn("Short link generation failed (saveTest):",o)}b.save(this.state.blueprint,this.state.questions,t,i),this.showToast("Тест сохранен в библиотеку! 💾");const s=e||document.getElementById("saveTestBtn")||document.getElementById("inProgressSaveBtn");s&&(s.innerText="✅ Сохранено",s.disabled=!0)},loadSavedTest(e){const t=b.getById(e);t&&(this.state.blueprint=t.blueprint,this.state.questions=t.questions,this.state.mode=t.blueprint.testType==="quiz"?"quiz":"psy",this.state.answers=[],this.state.quizScore=0,this.state.step=0)},deleteTest(e,t){if(!t){confirm("Удалить сохранённый тест?")&&(b.delete(e),this.openLibrary());return}if(!t.dataset.confirm){t.dataset.confirm="true",t.classList.add("confirming"),t.innerHTML="Точно?",t.title="Нажмите для подтверждения";const i=t.getAttribute("aria-label");i&&(t.dataset.originalLabel=i),t.setAttribute("aria-label","Подтвердить удаление"),setTimeout(()=>{t&&t.isConnected&&(delete t.dataset.confirm,t.classList.remove("confirming"),t.innerHTML="🗑",t.title="Удалить",t.dataset.originalLabel&&t.setAttribute("aria-label",t.dataset.originalLabel))},3e3);return}b.delete(e),this.openLibrary(),this.showToast("Тест удален 🗑")},setView(e){["setupView","testView","resultsView","libraryView","duelView"].forEach(i=>{const s=this.ui[i]||document.getElementById(i);s&&(s.style.display="none")});const t=this.ui[e+"View"]||document.getElementById(e+"View");t&&(t.style.display="block")},setLoading(e,t){const i=document.getElementById("loadingOverlay");if(i&&(i.style.display=e?"flex":"none"),t){const s=document.getElementById("loadingText");s&&(s.innerText=t)}}};window.app=P;document.addEventListener("DOMContentLoaded",()=>P.init());
