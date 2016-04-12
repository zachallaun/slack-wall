var SlackBot = require('slackbots');
 
// create a bot 
var bot = new SlackBot({
    token: 'xoxb-32090694308-jaywKcTWKCtRb3AF4lipnhcd', // Add a bot https://my.slack.com/services/new/bot and put the token  
    name: 'wallbot'
});
 
bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage 
    var params = {
        icon_emoji: ':cat:'
    };

    // // define channel, where bot exist. You can adjust it there https://my.slack.com/services  
    bot.postMessageToChannel('wallbotchannel', 'meow!', params);
    
    // define existing username instead of 'user_name' 
    bot.postMessageToUser('denizkusef', 'meow!', params); 
    
    // // define private group instead of 'private_group', where bot exist 
    // bot.postMessageToGroup('private_group', 'meow!', params); 
});

alldata= bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm 
    console.log(data);
});
botbot= alldata; // to prevent overwrite



botbot.users[1].profile.image_24
idstovals= botbot.users.map(function(user){
return }

	)