function startGaReminder() {
  // GAデータを取得
  var gaData = getGaData();
  
  // GAデータをslackに投げやすい形式に整形
  gaText = createGaText(gaData);
  
  // Slackに投げる。
  sendPepperBot("gas_prac02", gaText);
}

function getGaData() {
  var PROFILE_ID = "ga:88170321";

  var metrics = "ga:sessions, ga:percentNewSessions, ga:newVisits";
  var optArgs = {
    'dimensions': 'ga:keyword, ga:region, ga:networkDomain',
  };
  var startDate = "2016-02-27";
  var endDate = "2016-02-28";

  var gaData = Analytics.Data.Ga.get(PROFILE_ID, startDate, endDate, metrics, optArgs).rows;
  var sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange(1, 1, gaData.length, gaData[0].length).setValues(gaData); 
  
  for (i = 0; i < gaData.length; i++) {
    Logger.log(gaData[i]);
  }
  
  return gaData;
}

function createGaText(gaData) {
  return gaData; 
}

function sendPepperBot(channel, text) {
  // 引数がなかった場合
  if (!channel) {
    channel = "kuwako_test";
  };
  if (!text) {
    text = "Hi, I am Pepper. How are you?"; 
  }
  
  var slack_url = "https://hooks.slack.com/services/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";
  
  res = UrlFetchApp.fetch(slack_url, {
    payload : JSON.stringify({
      channel : channel,
      text : text,
    })
  });
  
  Logger.log(res);
}
