// Generates array of random values
function makeRandomNumbers() {
	var arr = [];
	// Numeration begins from second row, NOT the first
	arr.push(randomNum(2, 10));
	arr.push(randomNum(11, 19));
	arr.push(randomNum(20, 25));
	return arr;
}

// Generates a number between min, max
function randomNum(min, max) {
	var rand = min - 0.5 + Math.random() * (max - min + 1);
  	return Math.round(rand);
}

function makeObject(index) {
	var qId = questionSheet.getRange('A' + index).getValue();
	var question = questionSheet.getRange('B' + index).getValue();
	var typeOfQuestion = questionSheet.getRange('D' + index).getValue();
	
	var answers = [];
	var amountOfAnswers = questionSheet.getRange('F' + index).getValue();
	for (var i = 0; i < amountOfAnswers; i++) {
		answers[i] = questionSheet.getRange(index, 7 + i).getValue();
	}

	var correctAnswer = questionSheet.getRange('E' + index).getValue();

	var obj = {
		id: qId,
		question: question,
		type: typeOfQuestion,
		answers: answers,
		amountOfAnswers: amountOfAnswers,
		correctAnswer: correctAnswer
	};

	return obj;
}

function makeQuestionset() {
	var array = makeRandomNumbers();  // Array of 5 random values
	Logger.log(array)
	var questionset = {}; // Object hat contains a line with question
	var dataset = []; // Array of 5 questionets

	for (i in array) {
		var ind = array[i];
		questionset = makeObject(ind);
		Logger.log(questionset)
		dataset.push(questionset);
	}
	return dataset;
}

// Create unique form for one person
function makeForm(studentEmail, studentSheet) {
	var dataset = makeQuestionset();
	Logger.log(dataset)
	var formName = 'Тест' + ' - ' + studentEmail;
    var form = FormApp.create(formName);
    form.setLimitOneResponsePerUser(true);
    form.setRequireLogin(true);
	var formId = form.getId();

	// Запись формы в нужную папку
	var file = DriveApp.getFileById(formId);
	var parents = file.getParents();
	while (parents.hasNext()) {
		var parent = parents.next();
		parent.removeFile(file);
	}
	DriveApp.getFolderById('1dmCfYN5inqEsDf2ifgAACfMRto6bv62W').addFile(file);

	// Создание формы из вопросов
    for (var i = 0; i < 3; i++) {
    	var item;
    	Logger.log(dataset[i].type)
    	if (dataset[i].type == "много") {
	    	item = form.addCheckboxItem();
	    	item.setTitle(i + 1 + ". " + dataset[i].question);
	    	item.setChoiceValues(dataset[i].answers);
		}
    	else if (dataset[i].type == "один") {
	    	item = form.addMultipleChoiceItem();
    		item.setTitle(i + 1 + ". " + dataset[i].question);
    		item.setChoiceValues(dataset[i].answers);
    	}
    	else if (dataset[i].type == "строка") {
			form.addTextItem()
	    		.setTitle(i + 1 + ". " + dataset[i].question);
    	}
    }

    PropertiesService.getScriptProperties().setProperty("tempId", formId);

	// Записываем Id формы и группу на лист Формы
    var lineNumber = formSheet.getLastRow() + 1;
	formSheet.getRange("A" + lineNumber).setValue(formId);
	formSheet.getRange("C" + lineNumber).setValue(studentSheet.getName());
    return formId;
}
