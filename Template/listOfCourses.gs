function getCourses() {
    var obj = Classroom.Courses.list();
    var arrayOfCourses = obj.courses
//    var idOfCourse, nameOfCourse
//    for(elem in arrayOfCourses) {
//        idOfCourse = arrayOfCourses[elem].id
//        nameOfCourse = arrayOfCourses[elem].name
//        Logger.log(idOfCourse + nameOfCourse)
//    }
    Logger.log(arrayOfCourses)
    return arrayOfCourses
}