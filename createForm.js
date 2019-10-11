var currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var questionSheet = currentSpreadsheet.getSheetByName("Вопросы");
var answerSheet = currentSpreadsheet.getSheetByName("Ответы");
var formSheet = currentSpreadsheet.getSheetByName("Формы");

// Counts the amount of questions in the question sheet
function countQuestions() {
	var range = questionSheet.getRange(2, 1, 30).getValues();
	var quantityOfQuestions = 0;

	for (var rowNumber = 2; questionSheet.getRange('A' + rowNumber).getValue() != ''; rowNumber++) {
		quantityOfQuestions++;
	}
	return quantityOfQuestions;
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
function makeForm() {
	var dataset = makeQuestionset();

	var studentEmail = 'marrryapple@gmail.com';

	var formName = SpreadsheetApp.getActiveSpreadsheet().getName() + ' - ' + studentEmail;
    var form = FormApp.create(formName);

	var formId = form.getId();
    var formURL = form.getPublishedUrl();
    var formEditURL = form.getEditUrl();

    form.setDescription('Тест по Алгоритмизации');
    form.setLimitOneResponsePerUser(true);
    form.setRequireLogin(true);

    for (var i = 0; i < 5; i++) {
    	var item;
    	var imgId;
    	var arr = [];
    	var a = '';
    	if (dataset[i].type == "много") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
    				// .setTitle(i + 1 + ". " + dataset[i].question);
				item = form.addCheckboxItem();
				item.setTitle(i + 1 + ". " + dataset[i].question);
	    	}
	    	else {
	    		item = form.addCheckboxItem();
	    		item.setTitle(i + 1 + ". " + dataset[i].question);
	    	}
	    	item.setChoiceValues(dataset[i].answers);

			/*for (var t = 0; t < 5; t++) {
				a = dataset[i].answers[t];
				arr.push(("item.createChoice("+a+")"));
			}
			item.setChoices(arr);*/
		}
    	else if (dataset[i].type == "один") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
    				// .setTitle(i + 1 + ". " + dataset[i].question);
				item = form.addMultipleChoiceItem();
	    	}
	    	else {
	    		item = form.addMultipleChoiceItem();
	    		item.setTitle(i + 1 + ". " + dataset[i].question);
	    	}
    		item.setChoiceValues(dataset[i].answers);
    	}
    	else if (dataset[i].type == "строка") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
    				// .setTitle(i + 1 + ". " + dataset[i].question);
				item = form.addTextItem();
				item.setTitle(i + 1 + ". " + dataset[i].question);
			}
			else {
	    		form.addTextItem()
	    		.setTitle(i + 1 + ". " + dataset[i].question);
			}
    	}
    }

    PropertiesService.getScriptProperties().setProperty("tempId", formId);

    var lineNumber;
	for (lineNumber = 2; lineNumber < 2000; lineNumber++) {
		if (formSheet.getRange("A" + lineNumber).getValue() === "") {
			break;
		}
	}

	// Записываем Id формы
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

// Проверка текущего ответа (одного ответа) на правильность
function isResponseCorrect(resp) {
	var quest = resp.getItem().getTitle();
	quest = quest.slice(3);
	for (var i = 2; i < 2000; i++) {
		if (questionSheet.getRange('B' + i).getValue() === quest) {
			// Если тип вопроса - Единственный выбор
			if (questionSheet.getRange('D' + i).getValue() === 'один') {
				correct = questionSheet.getRange(70 + questionSheet.getRange('E' + i).getValue(), i).getValue();
				if (resp.getResponse() === correct) {
					return true;
				}
				else {
					return false;
				}
			}

			else if (questionSheet.getRange('D' + i).getValue() === 'строка') {
				if (questionSheet.getRange('E' + i).getValue() === quest.getResponse()) {
					return true;
				}
				else {
					return false;
				}
			}

			// Если тип вопроса - Множественный выбор
			else if (questionSheet.getRange('D' + i).getValue() === 'много') {
				// Формируем массив. состоящий из правильных ответов. Массив состоит из строк
				var answers = [];
				for (var q = 0; q < questionSheet.getRange('E' + i).getValue().length; q++) {
					correctAnsw = questionSheet.getRange('E' + i).getValue();
					if (correctAnsw / 10 > 0) {
						var t = correctAnsw % 10;
						answers.push(questionSheet.getRange(i, 70 + t).getValue());
						correctAnsw /= 10;
					}
					else {
						answers.push(questionSheet.getRange(i, 70 + correctAnsw).getValue());
					}
				}
				
				var answersCurrent = resp.getResponse();
				// Logger.log(answersCurrent);
				var cntr = 0;
				for (var q = 0; q < answersCurrent.length; q++) {
					 
					if (answers.indexOf(answersCurrent[q] === -1)) {
						return false;
					}
					else {
						cntr++;
					}
				}

				if (cntr === answers.length) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	}
}

// Подсчет оценки
// function computeTheGrade() { }

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
			if (formSheet.getRange("C" + lineNumber).getValue() === "") {
				id_ = formSheet.getRange("A" + (lineNumber)).getValue();
				form = FormApp.openById(id_);
				formResponses = form.getResponses();
				// Если на форму есть ответы
				if (formResponses.length > 0) {
					formSheet.getRange("C" + (lineNumber)).setValue("*");
					var formResponse = formResponses[formResponses.length - 1]; // Проход по массиву formResponses. formResponse - текущий массив ответов от одного человека
					var itemResponses = formResponse.getItemResponses(); // Массив ответов из formResponse

					// Находим пустую строку для записи ответов
					var lineNumberOfAnswer;
					for (lineNumberOfAnswer = 2; lineNumberOfAnswer < 2000; lineNumberOfAnswer++) {
						if (answerSheet.getRange("A" + lineNumberOfAnswer).getValue() === "") {
							break;
						}
					}
					
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

				  	// computeTheGrade();
				}
			}	
		} else {
			break;
		}
	}
}

function onOpen(e) {
	var menu = SpreadsheetApp.getUi().createAddonMenu();
	menu.addItem('Создать формы', 'makeForm');
	menu.addToUi();
}