var courseId = 23948313103;

// Make a task in Google Classroom
function createCW(id) {
  var existingForm = FormApp.openById(id);
  var courseWork = {
      "title"       : "Тест №1",
      "materials"   : { "link" : { "url" : existingForm.getPublishedUrl() } },
      "state"       : "DRAFT",
      "maxPoints"   : 10,
      "workType"    : "ASSIGNMENT"
    }
  Classroom.Courses.CourseWork.create(courseWork, courseId);
}

/*// Get the id of student
function getSubId(courseId, courseworkId, studentEmail) {
  var studentId;
  var subId;
  var listOfStudents;
  var listOfSubs;
  var response;
  
  return subId
}*/