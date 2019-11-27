function getCourses() {
    var obj = Classroom.Courses.list();
    var arrayOfCourses = obj.courses
    return arrayOfCourses
}