//this is testing new commit
var bgArray=[
			{url: "images/bg/1.jpg", annote: "\'Mountain\' by Atölye member Deniz"},
			{url: "images/bg/2.jpg", annote: "\'Alleyway\' by Atölye member Deniz"},
			{url: "images/bg/3.jpg", annote: "\'Looking up!\' by Atölye member Deniz"},
			{url: "images/bg/4.jpg", annote: "\'Waves\' by Atölye member Deniz"}	];

function swipeBG (i){
	if (typeof(i)==="undefined"){var i=0;}
	else { i = (i+1) % bgArray.length; }
	i = i++ % bgArray.length;
	$(".bgimg").css("background","transparent url("+bgArray[i].url+") no-repeat center center fixed");
	$(".bgimg").css("background-size","cover");
	$(".bganno").text(bgArray[i].annote);
	return i;
}

function addBG(newBG, user, timer) {	// if image is bigger/smaller than screen, make necessary adjustments.
	$(".bgimg").css("background","url("+newBG+") no-repeat center center fixed");
	$(".bgimg").css("background-size","cover");
	$(".bganno").text("image submitted by Atölye member "+user);
	bgArray.push({url:newBG, annotate: "image submitted by Atölye member "+user});
	clearInterval(timer);
	return timer= setInterval(function(){counter = swipeBG(counter);}, bgInterval);
}

function adjustsize(text){
	var textLength = text.length;
	if(textLength < 20) { // do nothing.			// @20
	} else if (textLength < 117 ) {					// @20-116
		$(".msgtext").css('font-size', '85%');
	} else if (textLength < 157) {					// @116-157
		$(".msgtext").css('font-size', '70%');
	} else if (textLength > 157){					// @157- ...
		$(".msgtext").css('font-size', '70%');
		text= text.slice(0,157)+" ...";
	}
	return text;
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
// console.log(thisevent);
		if (thisevent.type==="message"){
			userid= thisevent.user;
			var username= usersbynum[userid].real_name;
			username=username.split(' ');
			username= username[0]; // slack wall is on a first name basis with members. :)
			var iurl= usersbynum[userid].profile.image_512;

			if (thisevent.subtype !== null && thisevent.subtype === "file_share"){					// Drag & Drop image
				var pic_url= thisevent.file.url_private;
				var pic_dl = thisevent.file.url_private_download;
				timer= addBG(pic_url, username, timer);
			} else if (thisevent.text.slice(0,6)=== 'speak:'){									 	// Speak command
				$(".msgimg").attr("src", iurl);
				$(".msg").fadeIn(300);
				$(".msgtext").text('\"'+thisevent.text.slice(7)+'\"');
				setTimeout(function(){ $(".msg").fadeOut(300); }, messageOnTime);
				if ('speechSynthesis' in window) {
					var msg = new SpeechSynthesisUtterance(thisevent.text.slice(7));
					window.speechSynthesis.speak(msg);
				}
			} else if (thisevent.text.slice(0,3)=== 'bg:') {								// bg image url
				timer= addBG(thisevent.text.slice(4,-1), username, timer);
			} else {																		// Regular message
				$(".msgimg").attr("src", iurl);
				$(".msg").fadeIn(300);
				$(".name").text(username);
				var text= adjustsize(thisevent.text);
				$(".msgtext").text('\"'+text+'\"');
				setTimeout(function(){ $(".msg").fadeOut(600); }, messageOnTime);
			}
			return timer;
		}};}

var bgInterval = 5000;
var noticeInterval = 5000;
var messageOnTime = 5000;
var counter = -1;

window.onload = function(){
	var timer= setInterval(function(){counter = swipeBG(counter);}, bgInterval);
	slackConnect(messageOnTime, timer);
};
