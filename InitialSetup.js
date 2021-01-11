/**
 * Connects the bot to the webapp. Only needs to run once, initially
 */
function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  spreadsheetLog("Webhook set", response);
}
