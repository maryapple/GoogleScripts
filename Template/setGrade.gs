// Выставление оценки в таблицу
function setGradeToTable(grade, lineNumberOfAnswer) {
	var gradeFinal = 0;
	switch (grade) {
		case 0:
			gradeFinal = 0;
			break;
		case 1:
			gradeFinal = 4;
			break;
		case 2:
			gradeFinal = 7;
			break;
		case 3:
			gradeFinal = 10;
			break;
	}
	answerSheet.getRange("G" + lineNumberOfAnswer).setValue(gradeFinal * 10);
	answerSheet.getRange("H" + lineNumberOfAnswer).setValue(gradeFinal);
	return gradeFinal;
}