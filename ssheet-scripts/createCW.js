configSheet = currentSpreadsheet.getSheetByName("Config")
var courseId = configSheet.getRange('A1').getValue()

function createCW(id, studentEmail, i, studentSheet) {
	var existingForm = FormApp.openById(id);
	var swId;
	var courseWork = {
		"title"		 : "Тест",
		"materials"	 : { "link" : { "url" : existingForm.getPublishedUrl() } },
		"state"		 : "PUBLISHED",
		"maxPoints"	 : 10,
		"workType"	: "ASSIGNMENT",
		"assigneeMode": "INDIVIDUAL_STUDENTS",
		"individualStudentsOptions": { "studentIds": [studentEmail] }
	}
	responseCourseWork = Classroom.Courses.CourseWork.create(courseWork, courseId);
	getSubId(studentEmail, responseCourseWork.id, i, studentSheet);
	return responseCourseWork.id;
}

// Get the id of student
function getSubId(studentEmail, cwId, i, studentSheet) {
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
	studentSheet.getRange('D' + i).setValue(subId);
	return subId;	
}