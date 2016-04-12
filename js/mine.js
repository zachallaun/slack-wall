var xhr = new XMLHttpRequest();
xhr.open("GET", "https://slack.com/api/rtm.start?token=xoxb-32090694308-jaywKcTWKCtRb3AF4lipnhcd&pretty=1", false);
xhr.send();
initresponse= JSON.parse(xhr.response); 
url= initresponse.url; 

//https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
var sock = new WebSocket(url);
sock.onmessage = function (event) {
	thisevent= JSON.parse(event.data); 
	if (thisevent.type==="message"){
		console.log(thisevent.text);
		userSend(thisevent.text);
	}
  // console.log(event.data);
}

























//////////////////////////////////////////////////////////// SLACBOTS.JS SOLUTION>>>>>
// var SlackBot = require('slackbots');
// // create a bot 
// var bot = new SlackBot({
//     token: 'xoxb-32090694308-jaywKcTWKCtRb3AF4lipnhcd', // Add a bot https://my.slack.com/services/new/bot and put the token  
//     name: 'wallbot'
// });
// bot.on('start', function() {
//     // more information about additional params https://api.slack.com/methods/chat.postMessage 
//     var params = {
//         icon_emoji: ':cat:'
//     };
//     // // define channel, where bot exist. You can adjust it there https://my.slack.com/services  
//     bot.postMessageToChannel('wallbotchannel', 'meow!', params);
//     // define existing username instead of 'user_name' 
//     bot.postMessageToUser('denizkusef', 'meow!', params); 
//     // // define private group instead of 'private_group', where bot exist 
//     // bot.postMessageToGroup('private_group', 'meow!', params); 
// });
// alldata= bot.on('message', function(data) {
//     // all ingoing events https://api.slack.com/rtm 
//     console.log(data);
// });
// botbot= alldata; // to prevent overwrite