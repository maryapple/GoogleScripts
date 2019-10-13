// Создание задания в Classroom

function createCW() {
  var courseId = 23948313103;
  var courseWork = {
    "title" : "Тест №1",
    "state" : "DRAFT",
    "maxPoints" : 10,
    "workType": "ASSIGNMENT"
  }
  Classroom.Courses.CourseWork.create(courseWork, courseId);
}

// Находим id студента

function getSubId(courseId, courseworkId, studentEmail) {
  var studentId;
  var subId;
  var listOfStudents;
  var listOfSubs;
  var response;
  
  return subId
}

function setGrades() {
	
}