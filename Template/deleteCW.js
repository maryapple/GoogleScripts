function deleteCW() {
	var arr = Classroom.Courses.CourseWork.list(courseId).courseWork
	Logger.log(arr)
    for each (var cw in arr) {
		Classroom.Courses.CourseWork.remove(courseId, cw.id)
	}
}