var currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var questionSheet = currentSpreadsheet.getSheetByName("Вопросы");
var answerSheet = currentSpreadsheet.getSheetByName("Ответы");
var formSheet = currentSpreadsheet.getSheetByName("Формы");
var studentTESTSheet = currentSpreadsheet.getSheetByName("СтудентыTEST");
var studentSheet;

var arrayOfCourses = getCourses();

function onOpen(e) {
	var menu = SpreadsheetApp.getUi().createAddonMenu();
	menu.addItem('Создать формы для группы', 'test');
	menu.addToUi();

	var spreadsheet = SpreadsheetApp.getActive();
	var idOfCourse, nameOfCourse;
	
	var menuItems = []
	for (var n = 0; n < arrayOfCourses.length; n++) {
		idOfCourse = arrayOfCourses[n].id
		nameOfCourse = arrayOfCourses[n].name
		var obj = {
			name: nameOfCourse.toString(), 
			functionName: 'course_' + arrayOfCourses[n].id
		}
		menuItems.push(obj)
	}
	// Logger.log(menuItems)
	spreadsheet.addMenu('Выбрать дисциплину', menuItems);
}

var evalString = '';
for (var n = 0; n < arrayOfCourses.length; n++) {
	evalString += 'function course_' + arrayOfCourses[n].id + '() { test(' + arrayOfCourses[n].id + ') }';
}
eval(evalString);

// СОЗДАЕТСЯ
// function course_123() { test(123) }function course_234() { test(234) }function course_345() { test(345) }

function test(id) {
	Logger.log(id)
	studentSheet = currentSpreadsheet.getSheetByName("СтудентыTEST");
	studentSheet.getRange('F2').setValue(id)
}

function makeFormForGroup(studentSheet) {
	var amountOfPeople = studentSheet.getLastRow() + 1;
	var studentEmail;
	var formId;
	var cwId;
	var id;
	for (var i = 3; i < amountOfPeople; i++) {
		studentEmail = studentSheet.getRange('A' + i).getValue();
		id = makeForm(studentEmail, studentSheet);
		studentSheet.getRange('B' + i).setValue(id);
		cwId = createCW(id, studentEmail, i, studentSheet);
		studentSheet.getRange('E' + i).setValue(cwId);
	}
}
