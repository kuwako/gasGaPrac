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
