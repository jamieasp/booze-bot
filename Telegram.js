/**
 * Sends a message
 *
 * @param {string} chat_id The chatroom to message
 * @param {string} text The message to send
 */
function sendMessage(chat_id, text, disable_notification = false) {
    Logger.log("Sending to room " + chat_id);
    // Make a POST request with a JSON payload.
    var data = {
      'chat_id': chat_id,
      'text': text,
      'parse_mode': "HTML",
      'disable_notification': disable_notification
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

function sendImageByUrl(chat_id, image_url) {
    var data = {
      'chat_id': chat_id,
      'photo': image_url
    }
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(data)
    };
    var response = UrlFetchApp.fetch(telegramUrl + "/sendPhoto", options);
    spreadsheetLog("Sent image by url", response);
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