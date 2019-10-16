var courseId = 23948313103;

// Make a task in Google Classroom
function createCW(id, studentEmail) {
	var existingForm = FormApp.openById(id);
	var swId;
	var courseWork = {
		"title"       : "Тест №1",
		"materials"   : { "link" : { "url" : existingForm.getPublishedUrl() } },
		"state"       : "PUBLISHED",
		"maxPoints"   : 10,
		"workType"    : "ASSIGNMENT",
        "assigneeMode": "INDIVIDUAL_STUDENTS",
		"individualStudentsOptions": { "studentIds": [studentEmail] }
	}
	responseCourseWork = Classroom.Courses.CourseWork.create(courseWork, courseId);
    Logger.log(responseCourseWork.id);
	return responseCourseWork.id;
}

// List of all CW
function getCW() {
	var cwId;
	var courseworks  = Classroom.Courses.CourseWork.list(courseId).courseWork;
	for each(var cw in courseworks) { 
		Logger.log("%s - %s", cw.id, cw.title) 
	}
}

function test() {
  getSubId('user01@');
}

// Get the id of student
function getSubId(studentEmail) {
	Logger.log('studentEmail: ' + studentEmail);
	var studentId;
	var listOfStudents;
	var response;

	var pageTokenStudents = null;
	do {
		if (pageTokenStudents) {
			response = Classroom.Courses.Students.list(courseId, {pageToken: pageTokenStudents});
		} 
		else {
			response = Classroom.Courses.Students.list(courseId);
		}

		listOfStudents = response.students;
		// Logger.log('listOfStudents: ' + listOfStudents);
		for each(var student in listOfStudents) {
			Logger.log('student.profile.emailAddress: ' + student.profile.emailAddress);
			if(student.profile.emailAddress === studentEmail) {
			studentId = student.profile.id;

			return studentId;
			}
		}

		pageTokenStudents = response.nextPageToken;
	} while(pageTokenStudents);

	return null;

	/*var pageTokenStudents = Classroom.Courses.Students.list(courseId).nextPageToken;
	Logger.log('before the cycle');

	// Не получается зайти в цикл
	while(pageTokenStudents) {
		Logger.log('in the cycle');
		response = Classroom.Courses.Students.list(courseId, {pageToken: pageTokenStudents});
		listOfStudents = response.students;
		Logger.log('listOfStudents: ' + listOfStudents);
		for each(var student in listOfStudents) {
			Logger.log('student.profile.emailAddress: ' + student.profile.emailAddress);
			if(student.profile.emailAddress === studentEmail) {
				studentId = student.profile.id;
				break;
			}
		}
		
		pageTokenStudents = response.nextPageToken;
	}
	Logger.log('End f func getSubId');*/	
}