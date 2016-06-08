
var bgArray=[
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

function addBG(newBG, user, timer) {	// if image is bigger/smaller than screen, make necessary adjustments.
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
// console.log(thisevent);
		if (thisevent.type==="message"){
			userid= thisevent.user;
			var username= usersbynum[userid].real_name;
			var iurl= usersbynum[userid].profile.image_512;

			if (thisevent.subtype !== null && thisevent.subtype === "file_share"){       // Drag & Drop image
// console.log(thisevent);
				var pic_url= thisevent.file.url_private;
				var pic_dl = thisevent.file.url_private_download;
				timer= addBG(pic_url, username, timer);
			}
			else if (thisevent.text.slice(0,6)=== 'speak:'){									 	// Speak command
				$(".messageim").attr("src", iurl);
				$(".msg").fadeIn(300);
				$(".msg p").text('\"'+thisevent.text.slice(7)+'\"');
				setTimeout(function(){ $(".msg").fadeOut(300); }, messageOnTime);
				if ('speechSynthesis' in window) {
					var msg = new SpeechSynthesisUtterance(thisevent.text.slice(7));
			    	window.speechSynthesis.speak(msg);
				}
			} else if (thisevent.text.slice(0,3)=== 'bg:') {								// bg image url
				timer= addBG(thisevent.text.slice(4,-1), username, timer);
			} else {																		// Regular message
				$(".messageim").attr("src", iurl);
				$(".msg").fadeIn(300);
				$(".msg p").text('\"'+thisevent.text+'\"');
				setTimeout(function(){ $(".msg").fadeOut(300); }, messageOnTime);
			}
			return timer;
		}}; }


var bgInterval=5000;
var noticeInterval=5000;
var messageOnTime= 5000;
var counter= -1;

window.onload = function(){
	var timer= setInterval(function(){counter = swipeBG(counter);}, bgInterval);
	slackConnect(messageOnTime, timer);
	// $(".messageim").attr("src", 'img/backgrounds/3.jpg');
	// $(".msg").fadeIn(300);
	// $(".msg p").text('\"hey\"');
	// setTimeout(function(){ $(".msg").fadeOut(300); }, messageOnTime);
};
