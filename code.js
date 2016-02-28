function startGaReminder() {
  // GAデータを取得
  var gaData = getGaData();
  
  // GAデータをslackに投げやすい形式に整形
  gaText = createGaText(gaData[0]);
  
  // Slackに投げる。
  sendPepperBot("gas_prac02", gaText);
}


// 前日のセッション数やCV数を取得する
function getGaData() {
  // profile_idの設定
  var PROFILE_ID = "ga:88170321";

  // https://developers.google.com/analytics/devguides/reporting/core/dimsmets#view=detail&group=goal_conversions&jump=ga_goalxxvalue
  var metrics = "ga:sessions, ga:pageviews, ga:GoalCompletionsAll, ga:Goal2Completions";
  var optArgs = {
    'dimensions': '',
  };
  
  // TODO 日付
  var date = new Date();
  var yesterDay = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate() - 1)).slice(-2);
  
  var startDate = yesterDay;
  var endDate = yesterDay;

  var gaData = Analytics.Data.Ga.get(PROFILE_ID, startDate, endDate, metrics, optArgs).rows;
  
  // SpreadSheet
  var sheet = SpreadsheetApp.getActiveSheet();
  // シート初期化
  sheet.clear();
  sheet.getRange(1, 1, gaData.length, gaData[0].length).setValues(gaData); 
 
  for (i = 0; i < gaData.length; i++) {
    Logger.log(gaData[i]);
  }
  
  return gaData;
}

function createGaText(gaData) {
  // textの初期化と宣言
  gaText = "";
  
  gaText += "昨日のGAから取得したデータを送信します\n";
  gaText += "セッション数　　　： " + gaData[0] + "\n";
  gaText += "ビュー数　　　　　： " + gaData[1] + "\n";
  gaText += "全コンバージョン数： " + gaData[2] + "\n";
  gaText += "コンバージョン２数： " + gaData[3] + "\n";
  
  return gaText; 
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
