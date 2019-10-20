var courseId = 23843643021;
var answerSheet = currentSpreadsheet.getSheetByName("Ответы");
// var studentSheet = currentSpreadsheet.getSheetByName("Студенты");

var studentTESTSheet = currentSpreadsheet.getSheetByName("СтудентыTEST");

var studentSheet = studentTESTSheet;

// Make a task in Google Classroom
function createCW(id, studentEmail, i) {
	var existingForm = FormApp.openById(id);
	var swId;
	var courseWork = {
		"title"		 : "Экзамен",
		"materials"	 : { "link" : { "url" : existingForm.getPublishedUrl() } },
		"state"		 : "PUBLISHED",
		"maxPoints"	 : 10,
		"workType"	: "ASSIGNMENT",
		"assigneeMode": "INDIVIDUAL_STUDENTS",
		"individualStudentsOptions": { "studentIds": [studentEmail] }
	}
	responseCourseWork = Classroom.Courses.CourseWork.create(courseWork, courseId);
	getSubId(studentEmail, responseCourseWork.id, i);
	return responseCourseWork.id;
}

// Get the id of student
function getSubId(studentEmail, cwId, i) {
	Logger.log('studentEmail: ' + studentEmail);
	var studentId;
	var listOfStudents;
	var response;
	var pageTokenSubs;
	var listOfSubs;
	
	var pageTokenStudents = null;
	do {
		if (pageTokenStudents) {
			response = Classroom.Courses.Students.list(courseId, {pageToken: pageTokenStudents});
		} 
		else {
			response = Classroom.Courses.Students.list(courseId);
		}
		
		listOfStudents = response.students;
		pageTokenStudents = response.nextPageToken;
		
		for each(var student in listOfStudents) {
			if (student.profile.emailAddress === studentEmail) {
				studentId = student.profile.id;
				pageTokenStudents = null;
				break;
			}
		}
	} while(pageTokenStudents);
	
	studentSheet.getRange('C' + i).setValue(studentId);
	// Find submission for this student
	pageTokenSubs = null;
	do {
		if (pageTokenSubs) {
			response = Classroom.Courses.CourseWork.StudentSubmissions.list(courseId, cwId, {pageToken: pageTokenSubs});
		} 
		else {
			response = Classroom.Courses.CourseWork.StudentSubmissions.list(courseId, cwId);
		}
		
		listOfSubs = response.studentSubmissions;
		pageTokenSubs = response.nextPageToken;
		
		for each(var sub in listOfSubs) {
			if (sub.userId === studentId) {
				subId = sub.id;
				pageTokenSubs = null;
				break;
			}
		}
	} while (pageTokenSubs);
	Logger.log(subId);
	studentSheet.getRange('D' + i).setValue(subId);
	return subId;	
}


function setGradeToClassroom(grade, lineNumberOfAnswer, id) {
	var formId = id;
	Logger.log('formId: ' + formId);
	var studentEmail;
	var subId;
	var studentId;
	var cwId;
	//get student's email
	for (var i = 3; i < studentSheet.getLastRow(); i++) {
		if (studentSheet.getRange('B' + i).getValue() === formId) {
			studentEmail = studentSheet.getRange('A' + i).getValue();
			studentId = studentSheet.getRange('C' + i).getValue();
			subId = studentSheet.getRange('D' + i).getValue();
			cwId = studentSheet.getRange('E' + i).getValue();
			break;
		}
	}
	Logger.log(formId, studentEmail, studentId, subId, cwId);

	//set grades
	var resource = {'draftGrade' : grade};
	var updateMask = {'updateMask' : 'draftGrade'};
	Logger.log('formId: ' + formId + 'studentEmail: ' + studentEmail + 'studentId' +  studentId + ' subid: ' + subId + 'swID' +  cwId);
	var result = Classroom.Courses.CourseWork.StudentSubmissions.patch(resource, courseId, cwId, subId, updateMask);
	Logger.log(result);

	resource = {'assignedGrade' : grade};
	updateMask = {'updateMask' : 'assignedGrade'};
	result = Classroom.Courses.CourseWork.StudentSubmissions.patch(resource, courseId, cwId, subId, updateMask);
	Logger.log(result);
}