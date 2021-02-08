/**
 * Some functions for manual testing, to the test chatroom
 */

function debugSend() {
	var message = "Test from Jamie";
    return sendQuestion(debugChatId, message);
}

function testAskAlcohol() {
	return askAlcohol(debugChatId);
}


function recordResponseTest() {
  SpreadsheetApp.openById(spreadsheetId).getSheetByName("Data")
    .appendRow([Utilities.formatDate(new Date(), 'America/Los_Angeles', 'D MMM'), "Jamie", "Hi", "Hi"]);
}

function testTotals() {
    sendTotals(debugChatId);
}


function testSendChart(chartUrl) {
  return sendImageByUrl(debugChatId, chartUrl);
}

function testSendDryDayChart() {
  var chartUrl = "https://image-charts.com/chart?chs=700x190&cht=bvg&chd=a:16,21,14,18,21,8,13,16,7,9,12&chxt=x,y&chxl=0:|Adam|Dan|Dave|Ed|Eleanor|Gemma|Gina|James|Jamie|Liam|Richard|&chl=16|21|14|18|21|8|13|16|7|9|12&chf=b0,lg,90,e9c46a7C,0,f4a2617C,1&chg=0,1&chlps=anchor,end&chtt=Dry+Days";
  return testSendChart(chartUrl);
}

function testTotalsChart() {
  var chartUrl = "https://image-charts.com/chart?chs=700x190&cht=bvg&chd=a:8,1,14,11,1,25,23,14,23,34,26&chxt=x,y&chxl=0:|Adam|Dan|Dave|Ed|Eleanor|Gemma|Gina|James|Jamie|Liam|Richard|&chl=8|1|14|11|1|25|23|14|23|34|26&chf=b0,lg,90,03a9f47C,0,3f51b57C,1&chg=0,1&chlps=anchor,end&chtt=Total+Drinks+YTD";
  return testSendChart(chartUrl);
}

function testBubbleChart() {
  var chartUrl = "https://image-charts.com/chart?cht=bb&chs=500x500&chd=a:6,1.3,8,_,1,1.0,1,_,7,1.9,13,_,4,2.8,11,_,1,1.0,1,_,12,1.8,22,_,8,2.6,21,_,4,2.3,9,_,13,1.5,20,_,12,2.7,32,_,9,2.7,24&chl=Adam|Dan|Dave|Ed|Eleanor|Gemma|Gina|James|Jamie|Liam|Richard|&&chxt=x,y&chma=10,10,10,10&chco=fca56b7C,febc6c7c,d1c2887c,91b0707c,6666667c,1a9be07c,7f96cd7c,c2caf87c,ff92037c,7d9cc27c,929d907c&chxr=1,1,3,0.5&chg=1,1&chtt=Drinks+per+session+vs+Days+with+Booze";
  return testSendChart(chartUrl);
}