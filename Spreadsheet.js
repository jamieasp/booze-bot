/**
 * Helper function for writing logs to the spreadsheet, because Stackdriver logging
 * doesn't let you view logs when WebApp initiated 
 *
 * @param {string} note A hardcoded note that explains the context of this log
 * @param {string} log_message The contents of the log
 */
function spreadsheetLog(note, log_message) {
  SpreadsheetApp.openById(spreadsheetId).getSheetByName("Logs")
    .appendRow([Utilities.formatDate(new Date(), 'America/Los_Angeles', 'YYYY-MM-d HH:mm:ss Z'), note, log_message]);
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
    .appendRow([Utilities.formatDate(new Date(), 'America/Los_Angeles', 'YYYY-MM-dd HH:mm:ss Z'), user, question, response]);
}