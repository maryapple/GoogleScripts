//var currentSheet = SpreadsheetApp.getActiveSpreadsheet().getActivesheet;
var questionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Вопросы");

function createForm(){
	var range = questionSheet.getRange(2, 1, 30).getValues();
	var quantityOfQuestions = 0;

	for (var rowNumber = 2; questionSheet.getRange('A' + rowNumber).getValue() != ''; rowNumber++) {
		quantityOfQuestions++;
	}

	var arr = [];

	for (var i = 0; i < 2; i++) {
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

	for (var i = 0; i < 5; i++) {
			
	}
}

function randomNum() { // Генерирует до 10
	return Math.round(Math.random()*10);
}