// Make a task in Google Classroom
function createCW() {
  var courseId = 23948313103;
  var courseWork = {
    "title"       : "Тест №1",
    "materials"   : { "link" : { "url" : `${form.getPublishedUrl()}` } },
    "state"       : "DRAFT",
    "maxPoints"   : 10,
    "workType"    : "ASSIGNMENT",
    "individualStudentsOptions": {"studentIds": subId}
  }
  Classroom.Courses.CourseWork.create(courseWork, courseId);
}

// Get the id of student
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