// Generates array of random values
// function makeRandomNumbers(amountOfTasks) {
// 	var arr = [];
// 	var amountOfQuestionsTable = questionSheet.getLastRow() - 1
// 	var first = 0, last = 0, next = 0, i = 0;
// 	var range = amountOfQuestionsTable / amountOfTasks
// 	var flag
// 	(amountOfQuestionsTable % amountOfTasks === 0) ? flag = true : flag = false
// 	for (i = 1, next = 2; i <= amountOfTasks; i++ ) {
// 		first = next
// 		if (flag) {
// 			last = i * range + 1
// 		}
// 		else {
// 			if (i * range + range >= amountOfQuestionsTable) {
// 				last = i * range + (amountOfQuestionsTable - i * range)
// 			}
// 			else { last = i * range + 1 }
// 		}
		
// 		next = last + 1
//         arr.push(randomNum(first, last))
// 	}
// 	return arr;
// }

function generateRandomArray(amountOfTasks) {
	var arr = []
	for (var i = 0; i <= amountOfTasks; i++) {
		var num = randomNum(2, questionSheet.getLastRow())
		while (arr.indexOf(num) !== -1) {
			num = randomNum(2, questionSheet.getLastRow())
		}
		arr.push(num)
	}
	return arr
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
	var hasImage = questionSheet.getRange('C' + index).getValue();

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
		image: hasImage,
		answers: answers,
		amountOfAnswers: amountOfAnswers,
		correctAnswer: correctAnswer
	};

	return obj;
}

function makeQuestionset(amountOfTasks) {
	var array = generateRandomArray(amountOfTasks);  // Array of random values
	Logger.log(array)
	var questionset = {}; // Object hat contains a line with question
	var dataset = []; // Array of questionets

	for (i in array) {
		var ind = array[i];
		questionset = makeObject(ind);
		// Logger.log(questionset)
		dataset.push(questionset);
	}
	return dataset;
}

// Create unique form for one person
function makeForm(studentEmail, studentSheet) {
	var configSheet = currentSpreadsheet.getSheetByName("Config")
	var amountOfTasks = configSheet.getRange('B5').getValue()
	var dataset = makeQuestionset(amountOfTasks);
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

	var folderLink = configSheet.getRange("B4").getValue()
	folderLink = folderLink.slice(folderLink.indexOf('id') + 3)
	Logger.log(folderLink)
	DriveApp.getFolderById(folderLink).addFile(file)
	// DriveApp.getFolderById('1dmCfYN5inqEsDf2ifgAACfMRto6bv62W').addFile(file);

	// Создание формы из вопросов
	
    for (var i = 0; i < amountOfTasks; i++) {
    	var item;
    	var imgId;
    	if (dataset[i].type == "много") {
    		if (dataset[i].image != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
	    	}
	    	item = form.addCheckboxItem();
	    	item.setTitle(i + 1 + ". " + dataset[i].question);
	    	item.setChoiceValues(dataset[i].answers);
		}
    	else if (dataset[i].type == "один") {
    		if (dataset[i].image != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
	    	}
	    	item = form.addMultipleChoiceItem();
    		item.setTitle(i + 1 + ". " + dataset[i].question);
    		item.setChoiceValues(dataset[i].answers);
    	}
    	else if (dataset[i].type == "строка") {
    		if (dataset[i].image != "") {
    			imgId = getImageId(dataset[i]);
    			var img = DriveApp.getFileById(imgId);
    			form.addImageItem()
    				.setImage(img);
			}
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

function getImageId(obj) {
	var idLink = obj.image;
	if (idLink.slice(obj.image).indexOf("=") === -1) {
		idLink = idLink.slice((obj.image).indexOf("/d/") + 3);
	}
	else {
		idLink = idLink.slice((obj.image).indexOf("=") + 1);
	}
	return idLink;
}