var currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var questionSheet = currentSpreadsheet.getSheetByName("Вопросы");
var answerSheet = currentSpreadsheet.getSheetByName("Ответы");
var formSheet = currentSpreadsheet.getSheetByName("Формы");
var studentTESTSheet = currentSpreadsheet.getSheetByName("СтудентыTEST");
var studentSheet;

function onOpen(e) {
	var menu = SpreadsheetApp.getUi().createAddonMenu();
	menu.addItem('Создать формы для группы', 'test');
	menu.addToUi();

	var spreadsheet = SpreadsheetApp.getActive()
	var arrayOfCourses = getCourses()
	var idOfCourse, nameOfCourse
	var obj = {
		name: 'Prepare sheet...', 
		functionName: 'prepareSheet_'
	}
	var menuItems = []
	for(elem in arrayOfCourses) {
		idOfCourse = arrayOfCourses[elem].id
		nameOfCourse = arrayOfCourses[elem].name
		obj.name = nameOfCourse.toString()
		obj.functionName = 'prepareSheet_'
		menuItems.push(obj)
	}
	Logger.log(menuItems)
/*	var menuItems = [
		{name: 'Prepare sheet...', functionName: 'prepareSheet_'},
		{name: 'Generate step-by-step...', functionName: 'generateStepByStep_'}
	];*/
	spreadsheet.addMenu('Выбрать дисциплину', menuItems);
}

//function onOpenAddCourses(e) {
//	var menu = SpreadsheetApp.getUi().createAddonMenu()
//    var obj = getCourses() 
//    Logger.log(obj)
//	menu.addItem('Выбрать дисциплину', 'test')
//	menu.addToUi()
//}

function test() {
	studentSheet = currentSpreadsheet.getSheetByName("СтудентыTEST");
	makeFormForGroup(studentSheet);
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

/*function onOpen() {
	var spreadsheet = SpreadsheetApp.getActive()
	var arrayOfCourses = getCourses()
	var idOfCourse, nameOfCourse
	var obj = {
		name: 'Prepare sheet...', 
		functionName: 'prepareSheet_'
	}
	var menuItems = []
	for(elem in arrayOfCourses) {
		idOfCourse = arrayOfCourses[elem].id
		nameOfCourse = arrayOfCourses[elem].name
		obj.name = nameOfCourse
		obj.functionName = 'prepareSheet_'
		menuItems.push(obj)
	}
	// var menuItems = [
	// 	{name: 'Prepare sheet...', functionName: 'prepareSheet_'},
	// 	{name: 'Generate step-by-step...', functionName: 'generateStepByStep_'}
	// ];
	spreadsheet.addMenu('Выбрать дисциплину', menuItems);
}
*/