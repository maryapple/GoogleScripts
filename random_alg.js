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

function getLink() {
    var folderLink = configSheet.getRange("B4").getValue()
	folderLink = folderLink.slice(folderLink.indexOf('id') + 3)
	Logger.log(folderLink)
}