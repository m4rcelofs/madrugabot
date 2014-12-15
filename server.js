var irc = require('irc');
var madruga = require('./madruga');

var client = new irc.Client(process.env.MADRUGA_HOST,  process.env.MADRUGA_USER, {
    channels: process.env.MADRUGA_CHANNELS.split(' '),
});

var identify = function(message) {
    console.log('Registered: ' + JSON.stringify(message));
    if(process.env.MADRUGA_PASS) {
    	client.say('nickserv', 'IDENTIFY ' + process.env.MADRUGA_PASS);
    	console.log('Sent IDENTIFY');
    }
};

var onCtcp = function (from, to, text, type, message) {
    console.log('CTCP (' + type +'): ' + from + ' > ' + to + ', ' + JSON.stringify(message));
};

var onError = function(message) {
    console.log('error: ', JSON.stringify(message));
};

var onPvt = function(from, text) {
	var join = /^\.join\s+(#[\w\.]*)$/;
	if(text && join.test(text)){
		var parsedJoin = join.exec(text);
		if(parsedJoin) {
			joinChannel(from, parsedJoin[1]);
		}
		return;
	}
	
	var leave = /^\.leave\s+(#[\w\.]*)$/;
	if(text && leave.test(text)){
		var parsedLeave = leave.exec(text);
		if(parsedLeave){
			leaveChannel(from, parsedLeave[1]);
		}
		return;
	}
	
	client.say(from, "I'm a bot! Digite '.join #canal' ou '.leave #canal'.");
};

var joinChannel = function(whoAsked, channel) {
	client.join(channel, function(){
		client.say(channel, 'Olá a todos! O ' + whoAsked + ' pediu pra eu entrar aqui (:');
		client.say(whoAsked, 'Ok, entrei no canal ' + channel);
	});
};

var leaveChannel = function(whoAsked, channel) {
	client.part(channel, 'O ' + whoAsked + ' pediu pra eu sair daqui ):', function() {
		client.say(whoAsked, 'Ok, saí do canal ' + channel);
	});
};

var onMessage = function (from, to, message) {
	var answer = madruga.onMessage(from, to, message, client);
	if(answer) {
		client.say(to, answer);
	}
}; 



client.addListener('registered', identify);
client.addListener('ctcp', onCtcp);
client.addListener('error', onError);

client.addListener('pm', onPvt);
client.addListener('message#', onMessage);
//client.addListener('message#channel', function (from, message){});