function startGaReminder() {
  // GAデータを取得
  var gaData = getGaData();
  
  // GAデータをslackに投げやすい形式に整形
  gaText = createGaText(gaData[0]);
  
  // Slackに投げる。
  sendPepperBot("your_slack_channel_name", gaText);
}

// PepperBotにslackを送ってもらう関数
function sendPepperBot(channel, text) {
  // 引数がなかった場合
  if (!channel) {
    channel = "gas_prac02";
  };
  if (!text) {
    text = "Hi, I am Pepper. How are you?"; 
  }
  
  var slack_url = "https://hooks.slack.com/services/xxxxxx/yyyyyy/zzzzzzzzzzz";
  
  res = UrlFetchApp.fetch(slack_url, {
    payload : JSON.stringify({
      channel : channel,
      text : text,
    })
  });
}

// 前日のセッション数やCV数を取得する関数
function getGaData() {
  
  // profile_idの設定。GAのアドレス(pの後の数字)から取得可能。
  var PROFILE_ID = "ga:xxxxxxxxxx";

  // GAから取得する値を設定。具体的なパラメータは以下参照
  // https://developers.google.com/analytics/devguides/reporting/core/dimsmets
  var metrics = "ga:sessions, ga:pageviews, ga:GoalCompletionsAll, ga:Goal2Completions";
  var optArgs = {
    'dimensions': '',
  };
  
  // 昨日の日付をyyyy-mm-dd形式で作成
  var date = new Date();
  var yesterDay = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate() - 1)).slice(-2);
  
  var startDate = yesterDay;
  var endDate = yesterDay;

  // GAのデータ取得
  var gaData = Analytics.Data.Ga.get(PROFILE_ID, startDate, endDate, metrics, optArgs).rows;
  
  // SpreadSheet周り（時間があればやる。）
  var sheet = SpreadsheetApp.getActiveSheet();
  // シート初期化
  sheet.clear();
  sheet.getRange(1, 1, gaData.length, gaData[0].length).setValues(gaData); 
 
  for (i = 0; i < gaData.length; i++) {
    Logger.log(gaData[i]);
  }
  
  return gaData;
}

// GAから取ってきたデータをslackに送るようの文字列にする関数
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
