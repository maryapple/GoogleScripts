var questionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Вопросы");
/*var studentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Студенты");
var answerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ответы из форм");*/

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

// 
function makeObject(index) {
	var question = questionSheet.getRange('B' + index).getValue();
	var typeOfQuestion = questionSheet.getRange('D' + index).getValue();
	var hasCode = questionSheet.getRange('C' + index).getValue(); // type is string
	// hasCode = (questionSheet.getRange('C' + index).getValue() == undefined) ? null : questionSheet.questionSheet.getRange('C' + index).getValue();

	var answers = [];
	var amountOfAnswers = questionSheet.getRange('F' + index).getValue();
	for (var i = 0; i < amountOfAnswers; i++) {
		answers[i] = questionSheet.getRange(index, 7 + i).getValue();
	}

	var obj = {
		question: question,
		type: typeOfQuestion,
		code: hasCode,
		answers: answers
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
    //form.setDestination(FormApp.DestinationType.SPREADSHEET, answerSheet.getId());

    for (var i = 0; i < 5; i++) {
    	var item;
    	if (dataset[i].type == "много") {
    		if (dataset[i].code != "") {
    			var img = DriveApp.getFileById('1LH6zjXNKbfn6DbHacUGkTJLBVPCpxajn');
    			form.addImageItem()
    				.setImage(img)
    				.setTitle(dataset[i].question);
				item = form.addCheckboxItem();
	    	}
	    	else {
	    		item = form.addCheckboxItem();
	    		item.setTitle(dataset[i].question);
	    	}
	    	item.setChoiceValues(dataset[i].answers);
		}
    	else if (dataset[i].type == "один") {
    		if (dataset[i].code != "") {
    			var img = DriveApp.getFileById('1LH6zjXNKbfn6DbHacUGkTJLBVPCpxajn');
    			form.addImageItem()
    				.setImage(img)
    				.setTitle(dataset[i].question);
				item = form.addMultipleChoiceItem();
	    	}
	    	else {
	    		item = form.addMultipleChoiceItem();
	    		item.setTitle(dataset[i].question);
	    	}
    		item.setChoiceValues(dataset[i].answers);
    	}
    	else if (dataset[i].type == "строка") {
    		form.addTextItem()
    		.setTitle(dataset[i].question);
    	}
    }
}