var questionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Вопросы");

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

	for (i in array) {
		ind = array[i];
		amountOfAnswers = questionSheet.getRange('F' + ind).getValue();
		questionWithAnswers = selectFieldsOfQuestion(ind, amountOfAnswers);
	}
	return questionWithAnswers;
}