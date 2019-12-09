function createTimeDrivenTriggers() {
	ScriptApp.newTrigger('handleTheForm')
				.timeBased()
				.everyMinutes(1)
				.create()
}

function handleTheForm() {
	// lineNumber -номер строки, в которой форма еще не проверена, но пройдена учеником
	var lineNumber
	var id_
	var form
	var formResponses
	var grade
	var gradeIdeal
	var gradeFinal
	var studentSheet
	var studentSheetName
	for (lineNumber = 2; lineNumber < 2000; lineNumber++) {
		// Если найдена форма
		if (formSheet.getRange("A" + lineNumber).getValue() !== "") {
			// Если Форма еще не обработана
			if (formSheet.getRange("B" + lineNumber).getValue() === "") {
				id_ = formSheet.getRange("A" + (lineNumber)).getValue()
				form = FormApp.openById(id_)
				formResponses = form.getResponses()
				grade = 0
				gradeIdeal = 0
				// Если на форму есть ответы
				if (formResponses.length > 0) {
					formSheet.getRange("B" + (lineNumber)).setValue("*")
					studentSheetName = formSheet.getRange("C" + (lineNumber)).getValue()
					studentSheet = currentSpreadsheet.getSheetByName(studentSheetName)
					// Проход по массиву formResponses. formResponse - текущий массив ответов от одного человека
					var formResponse = formResponses[formResponses.length - 1]
					// Массив ответов из formResponse
					var itemResponses = formResponse.getItemResponses()

					// Находим пустую строку на листе Ответы для записи ответов
					var lineNumberOfAnswer = answerSheet.getLastRow() + 1
					answerSheet.getRange(String.fromCharCode(65) + lineNumberOfAnswer).setValue(id_)
					for (var j = 0; j < itemResponses.length; j++) {
						var itemResponse = itemResponses[j]
						if ( 67 + j + 1 <= 90) {
							answerSheet
								.getRange(String.fromCharCode(67 + j + 1) + lineNumberOfAnswer)
								.setValue(itemResponse.getResponse().toString())
						}
						
						if (isResponseCorrect(itemResponse) === true) {
							grade++
						}
						gradeIdeal++
					}
					// Принимаем не более одного ответа
				  	form.setAcceptingResponses(false)

				  	gradeFinal = setGradeToTable(grade, gradeIdeal, lineNumberOfAnswer)

				  	setGradeToClassroom(gradeFinal, lineNumberOfAnswer, id_, studentSheet)
				}
			}
		}
		else {
			break
		}
	}
}

// Проверка текущего ответа (одного ответа) на правильность
function isResponseCorrect(resp) {
	var quest = resp.getItem().getTitle();
	quest = quest.slice(3);
	var correct;
	for (var i = 2; i < 100; i++) {
		if (questionSheet.getRange('B' + i).getValue() === quest) {
			if (questionSheet.getRange('D' + i).getValue() === 'один') {
				var num = questionSheet.getRange('E' + i).getValue();
				correct = questionSheet.getRange(String.fromCharCode(70 + num) + i).getValue();
				if (resp.getResponse() === correct) {
					return true;
				}
				else {
					return false;
				}
			}

			else if (questionSheet.getRange('D' + i).getValue() === 'строка') {
				correct = questionSheet.getRange('E' + i).getValue().toString();
				if (correct === resp.getResponse().toString() || correct.toLowerCase() === resp.getResponse().toString()) {
					return true;
				}
				else {
					return false;
				}
			}

			else if (questionSheet.getRange('D' + i).getValue() === 'много') {
				// Формируем массив, состоящий из правильных ответов (не из цифровой комбинаций, а из значений ответов, соотв. этой комбинации)
				var strCorr = questionSheet.getRange('E' + i).getValue().toString();
				var answers = strCorr.split('');
				for (var q = 0; q < answers.length; q++) {
					answers[q] = questionSheet.getRange(String.fromCharCode(70 + Number(answers[q])) + i).getValue();
				}
				// Текущие ответы из формы
				var answersCurrent = resp.getResponse();

				// Logger.log('Correct answ: ' + answers + '\nCur resp: ' + answersCurrent);

				// Сверка ответов
				var cnt = 0;
				for (var q = 0; q < answersCurrent.length; q++) {
					var index = answers.indexOf(answersCurrent[q]);
					if (index === -1) {
						return false;
					}
					else {
						cnt++;
					}
				}

				if (cnt === answers.length) {
					// Logger.log('response is correct 3');
					return true;
				}
				else {
					return false;
				}
			}
			break;
		}
	}
}