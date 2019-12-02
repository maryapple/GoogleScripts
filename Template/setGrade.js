configSheet = currentSpreadsheet.getSheetByName("Config")
var courseId = configSheet.getRange('A1').getValue()

// Выставление оценки в таблицу
function setGradeToTable(grade, lineNumberOfAnswer) {
	var gradeFinal = 0;
	switch (grade) {
		case 0:
			gradeFinal = 0;
			break;
		case 1:
			gradeFinal = 4;
			break;
		case 2:
			gradeFinal = 7;
			break;
		case 3:
			gradeFinal = 10;
			break;
	}
	answerSheet.getRange("G" + lineNumberOfAnswer).setValue(gradeFinal * 10);
	answerSheet.getRange("H" + lineNumberOfAnswer).setValue(gradeFinal);
	return gradeFinal;
}

function setGradeToClassroom(grade, lineNumberOfAnswer, id, studentSheet) {
	var formId = id;
	// Logger.log('formId: ' + formId);
	var studentEmail;
	var subId;
	var studentId;
	var cwId;
	//get student's email
	for (var i = 3; i <= studentSheet.getLastRow(); i++) {
		if (studentSheet.getRange('B' + i).getValue() === formId) {
			studentEmail = studentSheet.getRange('A' + i).getValue();
			studentId = studentSheet.getRange('C' + i).getValue();
			subId = studentSheet.getRange('D' + i).getValue();
			cwId = studentSheet.getRange('E' + i).getValue();
			break;
		}
	}
	// Logger.log(formId, studentEmail, studentId, subId, cwId);

	//set grades
	var resource = {'draftGrade' : grade};
	var updateMask = {'updateMask' : 'draftGrade'};
	// Logger.log('formId: ' + formId + 'studentEmail: ' + studentEmail + 'studentId' +  studentId + ' subid: ' + subId + 'swID' +  cwId);
	var result = Classroom.Courses.CourseWork.StudentSubmissions.patch(resource, courseId, cwId, subId, updateMask);
	// Logger.log(result);

	resource = {'assignedGrade' : grade};
	updateMask = {'updateMask' : 'assignedGrade'};
	result = Classroom.Courses.CourseWork.StudentSubmissions.patch(resource, courseId, cwId, subId, updateMask);
	// Logger.log(result);
}