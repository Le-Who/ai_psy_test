export class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = "ValidationError";
	}
}

export function validatePsyOutput(data, isQuiz, isBlueprint) {
	if (!data || typeof data !== "object") {
		throw new ValidationError("Ответ не является объектом JSON.");
	}

	if (isBlueprint) {
		if (isQuiz) {
			if (
				!data.outcomes ||
				!Array.isArray(data.outcomes) ||
				data.outcomes.length === 0
			) {
				throw new ValidationError("В викторине отсутствуют уровни (outcomes).");
			}
		} else {
			if (data.testType === "dimensional") {
				if (
					!data.constructDefinition ||
					!data.outcomes ||
					!Array.isArray(data.outcomes) ||
					data.outcomes.length === 0
				) {
					throw new ValidationError(
						"Отсутствует constructDefinition или outcomes в dimensional тесте.",
					);
				}
			} else if (data.testType === "categorical") {
				if (
					!data.outcomes ||
					!Array.isArray(data.outcomes) ||
					data.outcomes.length === 0
				) {
					throw new ValidationError(
						"Отсутствуют outcomes в categorical тесте.",
					);
				}
			} else {
				throw new ValidationError("Неизвестный testType или отсутствует.");
			}
		}
		return true;
	}

	// Generation phase
	const questionsList = data.questions || (Array.isArray(data) ? data : null);

	if (!questionsList || !Array.isArray(questionsList)) {
		throw new ValidationError(
			"Поле 'questions' должно быть массивом или корень должен быть массивом.",
		);
	}

	if (questionsList.length === 0) {
		throw new ValidationError("Массив 'questions' не должен быть пустым.");
	}

	for (let i = 0; i < questionsList.length; i++) {
		const q = questionsList[i];
		if (!q.text) {
			throw new ValidationError(`Вопрос #${i + 1} не имеет текста (text).`);
		}
		if (isQuiz) {
			if (
				!q.options ||
				!Array.isArray(q.options) ||
				typeof q.correctIndex !== "number"
			) {
				throw new ValidationError(
					`Вопрос #${i + 1} викторины должен содержать массив options и число correctIndex.`,
				);
			}
		} else {
			// Psy
			if (!q.mapping || !Array.isArray(q.mapping) || q.mapping.length === 0) {
				throw new ValidationError(
					`Вопрос #${i + 1} психологического теста должен содержать непустой массив mapping.`,
				);
			}
		}
	}

	return true;
}
