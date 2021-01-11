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



