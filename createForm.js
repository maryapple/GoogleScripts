var currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var questionSheet = currentSpreadsheet.getSheetByName("Вопросы");
var answerSheet = currentSpreadsheet.getSheetByName("Ответы");

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
	// Logger.log(dataset);
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
    	if (dataset[i].type == "много") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img)
    				.setTitle(i + 1 + ". " + dataset[i].question);
				item = form.addCheckboxItem();
	    	}
	    	else {
	    		item = form.addCheckboxItem();
	    		item.setTitle(i + 1 + ". " + dataset[i].question);
	    	}
	    	item.setChoiceValues(dataset[i].answers);
		}
    	else if (dataset[i].type == "один") {
    		if (dataset[i].code != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img)
    				.setTitle(i + 1 + ". " + dataset[i].question);
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
    				.setImage(img)
    				.setTitle(i + 1 + ". " + dataset[i].question);
				item = form.addTextItem();
			}
			else {
	    		form.addTextItem()
	    		.setTitle(i + 1 + ". " + dataset[i].question);
			}
    	}
    }

    PropertiesService.getScriptProperties().setProperty("tempId", formId);

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

function onFormSubmit(e) {
	var form = e.source;

	// Поиск пустой строки
	var lineNumber;
	for (lineNumber = 2; lineNumber < 2000; lineNumber++) {
		if (answerSheet.getRange("A" + lineNumber).getValue() === "") {
			break;
		}
	}

	// Записываем Id формы
	answerSheet.getRange("A" + lineNumber).setValue(form.getId());

	// Достаем ответ на вопрос из формы
	var formResponses = form.getResponses(); // Массив ответов на форму от разных людей
	var formResponse = formResponses[formResponses.length - 1]; // Проход по массиву formResponses. formResponse - текущий массив ответов от одного человека
	var itemResponses = formResponse.getItemResponses(); // Массив ответов из formResponse
	
	for (var j = 0; j < itemResponses.length; j++) {
		var itemResponse = itemResponses[j]; // itemResponse - текущий ответ из ответа студента

		// Logger.log('Response to the question "%s" was "%s"',
		// 		itemResponse.getItem().getTitle(),
		// 		itemResponse.getResponse()
		// 	);

		// Запишем ответы на вопросы в пустые ячейки
		answerSheet.getRange(String.fromCharCode(65 + j + 1) + lineNumber).setValue(itemResponse.getResponse().toString());
	}
	// Принимаем не более одного ответа
  	form.setAcceptingResponses(false);

	deleteTriggerById(form.getId());
}

function addTrigger() {
    var trigger = ScriptApp.newTrigger('onFormSubmit')
        .forForm(makeForm())
        .onFormSubmit()
        .create();

    PropertiesService.getScriptProperties().setProperty(
    	PropertiesService.getScriptProperties().getProperty("tempId"), 
    	trigger.getUniqueId());	
}

function deleteTriggerById(formId) {
	var triggerId = PropertiesService.getScriptProperties().getProperty(formId);
	var triggers = ScriptApp.getProjectTriggers();

	for (var i = 0; i < triggers.length; i++) {
		if (triggers[i].getUniqueId() === triggerId) {
			ScriptApp.deleteTrigger(triggers[i]);
		}
	}
}

function onOpen(e) {
	var menu = SpreadsheetApp.getUi().createAddonMenu();
	menu.addItem('Создать форму', 'addTrigger');
	menu.addToUi();
}