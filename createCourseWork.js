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