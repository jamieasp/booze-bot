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



