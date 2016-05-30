
var bgArray=[
			{url: "img/notices/1.jpg", annote: " "},
			{url: "img/notices/2.jpg", annote: " "},
			{url: "img/backgrounds/1.jpg", annote: "\'Mountain\' by Atölye member Deniz"},
			{url: "img/backgrounds/2.jpg", annote: "\'Alleyway\' by Atölye member Deniz"},
			{url: "img/backgrounds/3.jpg", annote: "\'Looking up!\' by Atölye member Deniz"},
			{url: "img/backgrounds/4.jpg", annote: "\'Waves\' by Atölye member Deniz"}	];

// {url: "http://upload.wikimedia.org/wikipedia/commons/d/dd/Muybridge_race_horse_animated.gif", annote: " "},

function swipeBG (i){
	if (typeof(i)==="undefined"){var i=0;}
	else { i = (i+1) % bgArray.length; }
	i = i++ % bgArray.length;
	$(".full").css("background","url("+bgArray[i].url+") no-repeat center center fixed");
	$(".full").css("background-size","cover");
	$(".bganno").text(bgArray[i].annote);
	return i;
}

function addBG(newBG, user, timer) {
	$(".full").css("background","url("+newBG+") no-repeat center center fixed");
	$(".full").css("background-size","cover");
	$(".bganno").text("image submitted by Atölye member "+user);
	bgArray.push({url:newBG, annotate: "image submitted by Atölye member "+user});
	clearInterval(timer);
	return timer= setInterval(function(){counter = swipeBG(counter);}, bgInterval);
}

function slackConnect(messageOnTime, timer){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", token, false);
	xhr.send();
	initresponse= JSON.parse(xhr.response);
	url= initresponse.url;
	users= initresponse.users;
	var usersbynum={};
	users.forEach(function(elt){usersbynum[elt.id]=elt; });

	var sock = new WebSocket(url);     //https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
	sock.onmessage = function (event) {
		thisevent= JSON.parse(event.data);
		if (thisevent.type==="message"){
			userid= thisevent.user;
			var username= usersbynum[userid].real_name;
			var iurl= usersbynum[userid].profile.image_512;
			if (thisevent.text.slice(0,6)=== 'speak:'){
				$(".messageim").attr("src", iurl);
				$(".msg").fadeIn(300);
				$(".msg p").text('\"'+thisevent.text.slice(7)+'\"');
				setTimeout(function(){ $(".msg").fadeOut(300); }, messageOnTime);
				if ('speechSynthesis' in window) {
					var msg = new SpeechSynthesisUtterance(thisevent.text.slice(7));
			    	window.speechSynthesis.speak(msg);
				}
			} else if (thisevent.text.slice(0,3)=== 'bg:') {
				timer= addBG(thisevent.text.slice(4,-1), username, timer);
			} else {
				$(".messageim").attr("src", iurl);
				$(".msg").fadeIn(300);
				$(".msg p").text('\"'+thisevent.text+'\"');
				setTimeout(function(){ $(".msg").fadeOut(300); }, messageOnTime);
			}
			return timer;
		}}; }

// $(".messageim").attr("src", 'img/arduino.jpg');
// $(".msg").fadeIn(300);
// var userSend= function(text, url){
// 	$(".msg").fadeIn(300);
// // 	setTimeout(3000);
// // 	$(".pop").fadeOut(300);
// };
// var notificationtimer= setInterval(notify, 30000);
// var notify= function(){
// 	// .msg.display=== "block";
// 	$(".notice").fadeIn(300);
// 	setTimeout(function(){ $(".notice").fadeOut(300); }, 10000);
// };

var bgInterval=5000;
var noticeInterval=5000;
var messageOnTime= 5000;
var counter= -1;

window.onload = function(){
	var timer= setInterval(function(){counter = swipeBG(counter);}, bgInterval);
	slackConnect(messageOnTime, timer);
};
