var currentSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
var questionSheet = currentSpreadsheet.getSheetByName("Вопросы")
var answerSheet = currentSpreadsheet.getSheetByName("Ответы")
var formSheet = currentSpreadsheet.getSheetByName("Формы")
var studentTESTSheet = currentSpreadsheet.getSheetByName("СтудентыTEST")
var studentSheet

// Если обработка ошибки идет внутри getCourses, то можно убрать try catch отсюда
try {
	var arrayOfCourses = getCourses()
} catch (e) {
	var arrayOfCourses = []
}

function getCourses() {
    var obj = Classroom.Courses.list(teacherId = 123456)
    var arrayOfCourses = obj.courses
    return arrayOfCourses
}

// Создание панели меню
function onOpen(e) {
	var menu = SpreadsheetApp.getUi().createAddonMenu()
	menu.addItem('Инициализировать меню', 'initializeMenu')
	menu.addToUi()
}

function initializeMenu() {
	addGroupsToMenu()
	addCoursesToMenu()
}

function addGroupsToMenu() {
	var menu = SpreadsheetApp.getUi().createAddonMenu()
	// Выбор группы
	// Тестовая группа
	menu.addItem('Создать формы для группы', 'groupTest')

/*	// Реальные группы
	menu.addItem('БИВ181', 'group181')
	menu.addItem('БИВ182', 'group182')
	menu.addItem('БИВ183', 'group183')
	menu.addItem('БИВ184', 'group184')
	menu.addItem('БИВ185', 'group185')
	menu.addItem('БИВ186', 'group186')*/
	menu.addToUi()
}

function addCoursesToMenu() {
	var menu = SpreadsheetApp.getUi().createAddonMenu()
	// Выбор дисциплины
	// Добавочное меню с выбором дисциплин
	var spreadsheet = SpreadsheetApp.getActive()
	var idOfCourse, nameOfCourse
	var menuItems = []
	for (var n = 0 n < arrayOfCourses.length n++) {
		idOfCourse = arrayOfCourses[n].id
		nameOfCourse = arrayOfCourses[n].name
		var obj = {
			name: nameOfCourse.toString(), 
			functionName: 'course_' + arrayOfCourses[n].id
		}
		menuItems.push(obj)
	}
	spreadsheet.addMenu('Выбрать дисциплину', menuItems)
}

// Создание функций для каждой дисциплины. При выборе дисциплины запустится нужная функция
var evalString = ''
for (var n = 0 n < arrayOfCourses.length n++) {
	evalString += 'function course_' + arrayOfCourses[n].id + '() { writeCurrentId(' + arrayOfCourses[n].id + ') }'
}
// Создадутся: function course_11111() { writeCurrentId(11111) }function course_22222() { writeCurrentId(22222) }function course_33333() { writeCurrentId(33333) }
eval(evalString)

// Запись id курса на конфигурационный лист
function writeCurrentId(id) {
	configSheet = currentSpreadsheet.getSheetByName("Config")
	configSheet.getRange('A1').setValue(id)
}

// Запуск функции для тестовой группы
function groupTest() {
	studentSheet = currentSpreadsheet.getSheetByName("СтудентыTEST")
	makeFormForGroup(studentSheet)
}

// Вызовы функций генерации форм
function makeFormForGroup(studentSheet) {
	var amountOfPeople = studentSheet.getLastRow() + 1
	var studentEmail
	var formId
	var cwId
	var id
	var flag = false
	var arrayOfEmails = getArrayOfEmails()
	createTimeDrivenTriggers()
	for (var i = 3 i < amountOfPeople i++) {
		
		// Генерация формы для текущего студента
		studentEmail = studentSheet.getRange('A' + i).getValue()
		flag = checkstudentEmail(studentEmail, arrayOfEmails)
		if (flag) {
			id = makeForm(studentEmail, studentSheet)
			// Запись id формы текущего студента в колонку B
			studentSheet.getRange('B' + i).setValue(id)
			// Создание и запись задания текущего студента
			cwId = createCW(id, studentEmail, i, studentSheet)
			studentSheet.getRange('E' + i).setValue(cwId)
		}
		
	}
}

function getArrayOfEmails() {
	var courseId = configSheet.getRange(1, 1).getValue()
	var arrayOfEmails = []

	var pageTokenStudents = null
	do {
		if (pageTokenStudents) {
			response = Classroom.Courses.Students.list(courseId, { pageToken: pageTokenStudents })
		}
		else {
			response = Classroom.Courses.Students.list(courseId)
		}

		listOfStudents = response.students
		pageTokenStudents = response.nextPageToken

		for each(var student in listOfStudents) {
			arrayOfEmails.push(student.profile.emailAddress)
		}
	} while (pageTokenStudents)

	return arrayOfEmails
}

function checkstudentEmail(studentEmail, arrayOfEmails) {
	for (var i = 0 i < arrayOfEmails.length i++) {
		if (arrayOfEmails[i] === studentEmail) {
			return true
		}
	}
	return false
}