
var bgArray=[ 	"img/backgrounds/1.jpg",
				"img/backgrounds/2.jpg",
				"img/backgrounds/3.jpg",
				"img/backgrounds/4.jpg"	];
i=0;
$(".full").css("background","url("+bgArray[i]+") no-repeat center center fixed");
$(".full").css("background-size","cover");

function addBG(newBG) {
	$(".full").css("background","url("+newBG+") no-repeat center center fixed");
	$(".full").css("background-size","cover");
	bgArray.push(newBG);
}

function swipeBG (){
	i++;
	i = i % bgArray.length;
	$(".full").css("background","url("+bgArray[i]+") no-repeat center center fixed");
	$(".full").css("background-size","cover");
}

var xhr = new XMLHttpRequest();
xhr.open("GET", token, false);
xhr.send();
initresponse= JSON.parse(xhr.response); 
url= initresponse.url;

users= initresponse.users;
var usersbynum={};
users.forEach(function(elt){usersbynum[elt.id]=elt; });

//https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
var sock = new WebSocket(url);
sock.onmessage = function (event) {
	thisevent= JSON.parse(event.data);
	if (thisevent.type==="message"){
		userid= thisevent.user;
		var iurl= usersbynum[userid].profile.image_32;
		activeFab();     // this should be open rather than toggle.
		if (thisevent.text.slice(0,6)=== 'speak:'){
			userSend(thisevent.text.slice(7),iurl);
			botSpeak(thisevent.text.slice(7));
		 }
		 else if (thisevent.text.slice(0,3)=== 'bg:'){
		 	addBG(thisevent.text.slice(4,-1));
		 }
		 else{ userSend(thisevent.text,iurl);}
	}
};

setInterval(swipeBG, 3000);












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
