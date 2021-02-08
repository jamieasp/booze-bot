function triggerGMT() {
   // first send the latest rankings
   return sendTotals(chatId);
   // then ask for the drink volume
   return askAlcohol(chatId);
}

function triggerPST() {
    // ask for the drink volume
	return askAlcohol(pstChatId);
}

/**
 * Asks the user(s) how much alcohol they had today. It generates
 * the keyboard, which is the set of canned responses
 */
function askAlcohol(chat_id) {
    var message = "How many drinks did you have today, " + weekdayAndDate() + "?";
  
    var alcoholKeyboard = {inline_keyboard: [[{text: "🚫", callback_data: "0"}, 
                                              {text: "🍺", callback_data: "1"},
                                              {text: "🍺🍺", callback_data: "2"},
                                              {text: "🥴 3+", callback_data: "3+"}
                                            ]]};
        
    return sendQuestion(chat_id, message, keyboard = alcoholKeyboard);
}


/**
 * Pulls the summary statistics, then sends them to the group
 *
 */
function sendTotals(chat_id) {
  var totals = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Summary")
    .getDataRange().getValues();
  
  var user_position = totals[0].indexOf("User");
  var total_drinks_position = totals[0].indexOf("Gap_filled_total_drinks");
  var dry_days_position = totals[0].indexOf("Responses_without_drink");
  var drinks_per_sesh_position = totals[0].indexOf("Drinks_per_sesh");
  
  var totalsString = "🍺 Drinks YTD\n😇 Dry Days\n🍻 Drinks/Session\n\n";
  totalsString += padSpaces("", 7) + padSpaces("🍺", 5) + padSpaces("😇", 5)  + padSpaces("🍻", 6) + "\n";
  var totals_no_header = totals.slice(1,totals.length);
  totals_no_header.sort(function(a,b) { return b[total_drinks_position] - a[total_drinks_position]; });

  
  for (row in totals_no_header) {
    var userName = padSpaces(totals_no_header[row][user_position], 7);
    var totalDrinks = padSpaces(totals_no_header[row][total_drinks_position].toFixed(0), 5);
    var dryDays = padSpaces(totals_no_header[row][dry_days_position].toFixed(0), 5);
    var drinksPerSesh = padSpaces(totals_no_header[row][drinks_per_sesh_position].toFixed(1), 6);
    
    var userString = userName + totalDrinks + dryDays + drinksPerSesh + "\n";
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
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var dayName = days[current_date.getDay()];  
  var dateString =  Utilities.formatDate(current_date, 'GMT', 'd MMM');
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

function sendChart() {
  var chartUrl = "https://image-charts.com/chart?chs=700x190&cht=bvg&chd=a:8,1,14,11,1,25,23,14,23,34,26&chxt=x,y&chxl=0:|Adam|Dan|Dave|Ed|Eleanor|Gemma|Gina|James|Jamie|Liam|Richard|&chl=8|1|14|11|1|25|23|14|23|34|26&chf=b0,lg,90,03a9f47C,0,3f51b57C,1&chg=0,1&chlps=anchor,end&chtt=Total+Drinks+YTD";
}
