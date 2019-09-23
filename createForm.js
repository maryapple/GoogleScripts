var questionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Вопросы");
var studentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Студенты");
var answerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ответы из форм");

function countQuestions() {
	var range = questionSheet.getRange(2, 1, 30).getValues();
	var quantityOfQuestions = 0;

	for (var rowNumber = 2; questionSheet.getRange('A' + rowNumber).getValue() != ''; rowNumber++) {
		quantityOfQuestions++;
	}
	return quantityOfQuestions;
}

function makeRandomNumbers() {
	var arr = [];

	for (var i = 0; i < 5; i++) {
		var n = randomNum();
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
	return arr;
}

// Generates a number between 1 and 10
function randomNum() {
	return (Math.round(Math.random()*10) + 1);
}

function selectFieldsOfQuestion(index, amountOfAnswers) {
	var question = questionSheet.getRange('B' + index).getValue();
	var answers = [];
	for (var i = 0; i < amountOfAnswers; i++) {
		answers[i] = questionSheet.getRange(index, 7 + i).getValue();
	}
	var obj = {
		question: question,
		answers: answers
	};
	return obj;
}

function getDataForForm() {
	var array = makeRandomNumbers();
	var ind = 0;
	var amountOfAnswers = 0;
	var questionWithAnswers = {};
	var dataset = [];

	for (i in array) {
		ind = array[i];
		amountOfAnswers = questionSheet.getRange('F' + ind).getValue();
		questionWithAnswers = selectFieldsOfQuestion(ind, amountOfAnswers);
		dataset.push(questionWithAnswers);
	}
	return dataset;
}

// Create unique form for one person
function makeForm() {
	var dataset = getDataForForm();

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
    	form.addCheckboxItem()
    	.setTitle(dataset[i].question)
    	.setChoiceValues(dataset[i].answers);
    }
}