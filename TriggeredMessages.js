/**
 * Asks the user(s) how much alcohol they had today. It generates
 * the keyboard, which is the set of canned responses
 */
function askAlcohol() {
	// first send the latest rankings
    sendTotals(chatId);
    
    // then ask for the drink volume
    var message = "How many drinks did you have today, " + weekdayAndDate() + "?";
  
    var alcoholKeyboard = {inline_keyboard: [[{text: "🚫", callback_data: "0"}, 
                                              {text: "🍺", callback_data: "1"},
                                              {text: "🍺🍺", callback_data: "2"},
                                              {text: "🥴 3+", callback_data: "3+"}
                                            ]]};
        
    return sendQuestion(chatId, message, keyboard = alcoholKeyboard);
}


/**
 * Pulls the summary statistics, then sends them to the group
 *
 */
function sendTotals(chat_id = chatId) {
  var totals = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Summary")
    .getDataRange().getValues();
  
  var user_position = totals[0].indexOf("User");
  var total_drinks_position = totals[0].indexOf("Gap_filled_total_drinks");
  var dry_days_position = totals[0].indexOf("Responses_without_drink");
  
  var totalsString = "   Name  DryDays DrinksYTD\n";
  var totals_no_header = totals.slice(1,totals.length);
  totals_no_header.sort(function(a,b) { return b[total_drinks_position] - a[total_drinks_position]; });

  
  for (row in totals_no_header) {
    var userName = padSpaces(totals_no_header[row][user_position], 7);
    var dryDays = padSpaces(totals_no_header[row][dry_days_position].toFixed(0), 9);
    var totalDrinks = padSpaces(totals_no_header[row][total_drinks_position].toFixed(0), 10);
    
    var userString = userName + dryDays + totalDrinks + "\n";
    //Logger.log(userString); 
    totalsString += userString;
  }
  
  Logger.log(totalsString);
  sendMessage(chat_id, "<pre>" + totalsString + "</pre>");
}

/**
 * Helper function that prepares the right date format for the AskAlcohol message
 *
 */
function weekdayAndDate() {
  var current_date = new Date();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayName = days[current_date.getDay()];  
  var dateString =  Utilities.formatDate(current_date, 'GMT', 'D MMMM');
  return dayName + " " + dateString;
}

/**
 * Helper function for ensuring strings of equal length, for nice layouts
 *
 * @param {string} text The string to pad or truncate
 * @param {string} totalLength The length we want to pad or truncate to
 */
function padSpaces(text, totalLength) {
  var textLength = text.length;
  if (textLength <= totalLength) {
    var delta = totalLength - textLength;
    return(" ".repeat(delta) +  text);
  }
  else {
    return(text.substring(0, totalLength));
  }
}
