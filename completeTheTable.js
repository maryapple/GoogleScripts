var app = SpreadsheetApp;
var initialSheet = app.getActiveSpreadsheet().getActiveSheet();
var targetSheet = app.getActiveSpreadsheet().getSheetByName("Таблица для сайта");

// Get response from form and fill in the cells of target sheet
function onSubmit(e){
  var responses = e.response.getItemResponses();
  var form = FormApp.openById('1NfHSL2y2U1zkx-pkNH9KSYxF8KzshdOS_bqdDPm3nX4');
  var currentRow = form.getResponses().length + 1;

  var nameOfDataset = responses[0].getResponse();
  targetSheet.getRange(currentRow, 2).setValue(nameOfDataset);

  var coordinates;

  var strLink = "https://drive.google.com/uc?export=download&id=";
  var linkWithCoordinates = responses[3].getResponse();
  var pos = linkWithCoordinates.indexOf('=') + 1;
  strLink += linkWithCoordinates.slice(pos);
  targetSheet.getRange(currentRow, 4).setValue(strLink);

  targetSheet.getRange(currentRow, 1).setValue(currentRow - 1);
  
//  createMap();
}

//function createMap(){
//  var map = new google.maps.Map()
//}


// Add a trigger which listens for form submit
function addTrigger() {
    ScriptApp.newTrigger('onSubmit')
        .forForm('1NfHSL2y2U1zkx-pkNH9KSYxF8KzshdOS_bqdDPm3nX4')
        .onFormSubmit()
        .create();
}