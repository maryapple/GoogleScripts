var currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var questionSheet = currentSpreadsheet.getSheetByName("Вопросы");
var answerSheet = currentSpreadsheet.getSheetByName("Ответы");
var formSheet = currentSpreadsheet.getSheetByName("Формы");
var studentSheet = currentSpreadsheet.getSheetByName("Студенты");

function onOpen(e) {
	var menu = SpreadsheetApp.getUi().createAddonMenu();
	menu.addItem('Создать формы для группы', 'makeFormForGroup');
	menu.addToUi();
}

// Generates array of values between 2 and 24
function makeRandomNumbers() {
	var arr = [];

	for (var i = 0; i < 5; i++) {
		var n = randomNum();
		if ( i <= 2) {
			if (arr.indexOf(n) == -1) {
				arr.push(n);
			} 
			else {
				n = randomNum();
				if (arr.indexOf(n) == -1) {
					arr.push(n);
				}
				else {
					n = randomNum();
					if (arr.indexOf(n) == -1) {
						arr.push(n);
					}
				}
			}
		}
		else {
			if (arr.indexOf(n * 2) == -1) {
				arr.push(n * 2);
			} 
			else {
				n = randomNum();
				if (arr.indexOf(n * 2) == -1) {
					arr.push(n * 2);
				}
				else {
					n = randomNum();
					if (arr.indexOf(n * 2) == -1) {
						arr.push(n * 2);
					}
				}
			}
		}
	}
	return arr;
}

// Generates a number between 2 and 12
function randomNum() {
	return (Math.round(Math.random() * 10) + 2);
}

function makeObject(index) {
	var qId = questionSheet.getRange('A' + index).getValue();
	var question = questionSheet.getRange('B' + index).getValue();
	var typeOfQuestion = questionSheet.getRange('D' + index).getValue();
	var hasCode = questionSheet.getRange('C' + index).getValue(); // type is string
	
	var answers = [];
	var amountOfAnswers = questionSheet.getRange('F' + index).getValue();
	for (var i = 0; i < amountOfAnswers; i++) {
		answers[i] = questionSheet.getRange(index, 7 + i).getValue();
	}

	var correctAnswer = questionSheet.getRange('E' + index).getValue();

	var obj = {
		id: qId,
		question: question,
		type: typeOfQuestion,
		code: hasCode,
		answers: answers,
		amountOfAnswers: amountOfAnswers,
		correctAnswer: correctAnswer
	};

	return obj;
}

function makeQuestionset() {
	var array = makeRandomNumbers();  // Array of 5 random values
	var questionset = {}; // Object hat contains a line with question
	var dataset = []; // Array of 5 questionets

	for (i in array) {
		var ind = array[i];
		questionset = makeObject(ind);
		dataset.push(questionset);
	}
	return dataset;
}

// Create unique form for one person
function makeForm(studentEmail) {
	var dataset = makeQuestionset();
	var formName = 'Тест 1' + ' - ' + studentEmail;
    var form = FormApp.create(formName);
	var formId = form.getId();

/*	var folderId = '14X-Gl7j9Zm1AAD8ERPKztRPcMF6OzGQr';
	var file = DriveApp.getFileById(formId);
	var folder = DriveApp.getFolderById(folderId);
	var newFile = file.makeCopy(file, folder);

	//Remove file from root folder--------------------------------//
	DriveApp.getFileById(formId).setTrashed(true);*/

    form.setDescription('Тест по Алгоритмизации');
    form.setLimitOneResponsePerUser(true);
    form.setRequireLogin(true);

    Logger.log(studentEmail, formId);

    for (var i = 0; i < 5; i++) {
    	var item;
    	var imgId;
    	var arr = [];
    	var a = '';
    	Logger.log(dataset[i]);
    	if (dataset[i].type == "много") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
	    	}
	    	item = form.addCheckboxItem();
	    	item.setTitle(i + 1 + ". " + dataset[i].question);
	    	item.setChoiceValues(dataset[i].answers);
		}
    	else if (dataset[i].type == "один") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
	    	}
	    	item = form.addMultipleChoiceItem();
    		item.setTitle(i + 1 + ". " + dataset[i].question);
    		item.setChoiceValues(dataset[i].answers);
    	}
    	else if (dataset[i].type == "строка") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
			}
			form.addTextItem()
	    		.setTitle(i + 1 + ". " + dataset[i].question);
    	}
    }

    PropertiesService.getScriptProperties().setProperty("tempId", formId);

	// Записываем Id формы на лист Формы
    var lineNumber = formSheet.getLastRow() + 1;
	formSheet.getRange("A" + lineNumber).setValue(formId);
    return formId;
}

function getImageId(obj) {
	var idLink = obj.code;
	if (idLink.slice(obj.code).indexOf("=") === -1) {
		idLink = idLink.slice((obj.code).indexOf("/d/") + 3);
	}
	else {
		idLink = idLink.slice((obj.code).indexOf("=") + 1);
	}
	return idLink;
}

function createTimeDrivenTriggers() {
	ScriptApp.newTrigger('handleTheForm')
				.timeBased()
				.everyMinutes(1)
				.create();
}

function handleTheForm() {
	// lineNumber -номер строки, в которой форма еще не проверена, но пройдена учеником
	var lineNumber;
	var id_;
	var form;
	var formResponses;
	var grade = 0;
	for (lineNumber = 2; lineNumber < 2000; lineNumber++) {
		// Если найдена форма
		if (formSheet.getRange("A" + lineNumber).getValue() !== "") {
			// Если Форма еще не обработана
			if (formSheet.getRange("B" + lineNumber).getValue() === "") {
				id_ = formSheet.getRange("A" + (lineNumber)).getValue();
				form = FormApp.openById(id_);
				formResponses = form.getResponses();
				// Если на форму есть ответы
				if (formResponses.length > 0) {
					formSheet.getRange("B" + (lineNumber)).setValue("*");
					var formResponse = formResponses[formResponses.length - 1]; // Проход по массиву formResponses. formResponse - текущий массив ответов от одного человека
					var itemResponses = formResponse.getItemResponses(); // Массив ответов из formResponse

					// Находим пустую строку на листе Ответы для записи ответов
					var lineNumberOfAnswer = answerSheet.getLastRow() + 1;
					answerSheet.getRange(String.fromCharCode(65) + lineNumberOfAnswer).setValue(id_);
					for (var j = 0; j < itemResponses.length; j++) {
						var itemResponse = itemResponses[j];
						answerSheet.getRange(String.fromCharCode(65 + j + 1) + lineNumberOfAnswer).setValue(itemResponse.getResponse().toString());
						if (isResponseCorrect(itemResponse) === true) {
							grade++;
						}
					}
					// Принимаем не более одного ответа
				  	form.setAcceptingResponses(false);

				  	// Перевод в 10-бальную систему
				  	grade *= 2;

				  	setGradeToTable(grade, lineNumberOfAnswer);

				  	setGradeToClassroom(grade, lineNumberOfAnswer, id_);
				}
			}	
		} else {
			break;
		}
	}


}

// Проверка текущего ответа (одного ответа) на правильность
function isResponseCorrect(resp) {
	var quest = resp.getItem().getTitle();
	quest = quest.slice(3);
	// Logger.log('The quest from FORM: ' + quest);
	// Ищем на странице с пулом вопросом идентичный вопрос
	for (var i = 2; i < 100; i++) {
		if (questionSheet.getRange('B' + i).getValue() === quest) {

			if (questionSheet.getRange('D' + i).getValue() === 'один') {
				var num = questionSheet.getRange('E' + i).getValue();
				correct = questionSheet.getRange(String.fromCharCode(70 + num) + i).getValue();
				/*Logger.log('The correct resp: ' + correct);
				Logger.log('The current resp: ' + resp.getResponse());*/
				if (resp.getResponse() === correct) {
					// Logger.log('response is correct 1');
					return true;
				}
				else {
					return false;
				}
			}

			else if (questionSheet.getRange('D' + i).getValue() === 'строка') {
				// Logger.log('The correct: ' + questionSheet.getRange('E' + i).getValue().toString() + '\nThe current resp: ' + resp.getResponse().toString());
				if (questionSheet.getRange('E' + i).getValue().toString() === resp.getResponse().toString()) {
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

// Выставление оценки в таблицу
function setGradeToTable(grade, lineNumberOfAnswer) {
	answerSheet.getRange("G" + lineNumberOfAnswer).setValue(grade * 10);
	answerSheet.getRange("H" + lineNumberOfAnswer).setValue(grade);
}

function makeFormForGroup() {
	var amountOfPeople = studentSheet.getLastRow() + 1; // 5
	var studentEmail;
	var formId;
	var cwId;
	for (var i = 3; i < amountOfPeople; i++) {
		studentEmail = studentSheet.getRange('A' + i).getValue();
		var id = makeForm(studentEmail);
		// Запишем id формы на лист Студенты
		studentSheet.getRange('B' + i).setValue(id);
		cwId = createCW(id, studentEmail, i);
		studentSheet.getRange('E' + i).setValue(cwId);
	}
}