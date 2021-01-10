/**
 * Connects the bot to the webapp. Only needs to run once, initially
 */
function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  spreadsheetLog("Webhook set", response);
}

/**
 * Sends a message
 *
 * @param {string} chat_id The chatroom to message
 * @param {string} text The message to send
 */
function sendMessage(chat_id, text) {
    // Make a POST request with a JSON payload.
    var data = {
      'chat_id': chat_id,
      'text': text,
      'parse_mode': "HTML"
    };
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(data)
    };
    var response = UrlFetchApp.fetch(telegramUrl + "/sendMessage", options);
    spreadsheetLog("Sent message", response);
}

/**
 * Sends a question (effectively a message, but also with a keyboard)
 *
 * @param {string} chat_id The chatroom to message
 * @param {string} text The message to send
 * @param {keyboard} object The canned responses that the user can tap
 */
function sendQuestion(chat_id, text, keyboard) {
    // Make a POST request with a JSON payload.
    var data = {
      'chat_id': chat_id,
      'text': text,
      'reply_markup': JSON.stringify(keyboard)
    };
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(data)
    };
    var response = UrlFetchApp.fetch(telegramUrl + "/sendMessage", options);
    spreadsheetLog("Sent message", response);
}

/**
 * Acknowledges the user's response - a requirement from Telegram
 *
 * @param {string} callback_query_id Which question the user reponded to
 * @param {string} text The message that shows up in the in-app toast
 */
function answerCallback(callback_query_id, text) {
    // Make a POST request with a JSON payload.
    var data = {
      'callback_query_id': callback_query_id,
      'text': text
    };
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(data)
    };
    var response = UrlFetchApp.fetch(telegramUrl + "/answerCallbackQuery", options);
    spreadsheetLog("Answered callback", response);
}

/**
 * The function that Telegram calls every time a message happens in the chatroom
 *
 * @param {event} e The event parameter of the request from Telegram
 */
function doPost(e) {
  
  // Log the info for future debugging
  // example message contents: {"update_id":424222377,"message":{"message_id":99,"from":{"id":1492723243,"is_bot":false,"first_name":"Jamie","language_code":"en"},"chat":{"id":-410377193,"title":"BotTest","type":"group","all_members_are_administrators":true},"date":1609624230,"text":"Hi"}}
  // example callback contents: {"update_id":424222398,"callback_query":{"id":"6411197511940107894","from":{"id":1492723243,"is_bot":false,"first_name":"Jamie","language_code":"en"},"message":{"message_id":122,"from":{"id":1463181910,"is_bot":true,"first_name":"JamieaspBot","username":"JamieaspBot"},"chat":{"id":-410377193,"title":"BotTest","type":"group","all_members_are_administrators":true},"date":1609626202,"text":"How many drinks did you have today?","reply_markup":{"inline_keyboard":[[{"text":"0","callback_data":"0"},{"text":"1","callback_data":"1"},{"text":"2+","callback_data":"2+"}]]}},"chat_instance":"8359242162032477824","data":"1"}}
  spreadsheetLog("Received message", e.postData.getDataAsString());
  
  var contents = JSON.parse(e.postData.getDataAsString());
  
  // handle responses to the survey
  if('callback_query' in contents) {
    var callback_query_id = contents.callback_query.id;
    var users_choice = contents.callback_query.data;
    var cleaned_choice = users_choice.replace("+", "");
    var message = contents.callback_query.message;
    var responder_first_name = contents.callback_query.from.first_name;
    var original_question = message.text;
    var chatroom_id = message.chat.id;
    
    recordResponse(responder_first_name, original_question, cleaned_choice);
    answerCallback(callback_query_id, "Ack");
    sendMessage(chatroom_id, responder_first_name + " drank " + users_choice );
  }
  // handle regular messages
  else {
    var message = contents.message;
    var sender_id = message.from.id;
    var text = message.text;
    var first_name = message.from.first_name;
    var chatroom_id = message.chat.id;
    var message_id = message.message_id;
    //sendMessage(chatroom_id, "Roger that, " + first_name);
    
    // not currently taking any action for regular messages
  }
}

/**
 * Helper function for writing logs to the spreadsheet, because Stackdriver logging
 * doesn't let you view logs when WebApp initiated 
 *
 * @param {string} note A hardcoded note that explains the context of this log
 * @param {string} log_message The contents of the log
 */
function spreadsheetLog(note, log_message) {
  SpreadsheetApp.openById(spreadsheetId).getSheetByName("Logs")
    .appendRow([Utilities.formatDate(new Date(), 'America/Los_Angeles', 'YYYY-MM-DD HH:mm:ss Z'), note, log_message]);
}

/**
 * Helper function for writing responses to the spreadsheet
 *
 * @param {string} user Which user responded
 * @param {string} question Which question the user was replying to
 * @param {string} response The user's response
 */
function recordResponse(user, question, response) {
  SpreadsheetApp.openById(spreadsheetId).getSheetByName("Data")
    .appendRow([Utilities.formatDate(new Date(), 'America/Los_Angeles', 'YYYY-MM-DD HH:mm:ss Z'), user, question, response]);
}

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
 * Some functions for manual testing, to the test chatroom
 */

function debugSend() {
	var message = "Test from Jamie";
    return sendQuestion(debugChatId, message);
}

function testAskAlcohol() {
	// first send the latest rankings
    sendTotals(debugChatId);
    
    // then ask for the drink volume
    var message = "How many drinks did you have today, " + weekdayAndDate() + "?";
  
    var alcoholKeyboard = {inline_keyboard: [[{text: "🚫", callback_data: "0"}, 
                                              {text: "🍺", callback_data: "1"},
                                              {text: "🍺🍺", callback_data: "2"},
                                              {text: "🥴 3+", callback_data: "3+"}
                                            ]]};
        
    return sendQuestion(debugChatId, message, keyboard = alcoholKeyboard);
}

function recordResponseTest() {
  SpreadsheetApp.openById(spreadsheetId).getSheetByName("Data")
    .appendRow([Utilities.formatDate(new Date(), 'America/Los_Angeles', 'D MMM'), "Jamie", "Hi", "Hi"]);
}



