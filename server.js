var irc = require('irc');
var madruga = require('./madruga');

console.log('Starting MadrugaBot...');

console.log('Environment is:');
for(var env in process.env) {
	if(/MADRUGA_\w*/.test(env)) {
		console.log(env + ': ' + process.env[env]);
	}
}

var client = new irc.Client(process.env.MADRUGA_HOST || 'irc.rizon.net',
							process.env.MADRUGA_USER || 'Madruga', 
	{
    	channels: process.env.MADRUGA_CHANNELS ? 
    				process.env.MADRUGA_CHANNELS.split(' ') : '',
    	port: process.env.MADRUGA_PORT || 6667,
    	autoConnect: false, 
    	showErrors: true,
    	debug: process.env.MADRUGA_DEBUG || false,
    	userName: 'madruga',
    	realName: 'madruga IRC bot',
    	floodProtection: true,
    	floodProtectionDelay: 300,
	}
);

var identify = function(message) {
    if(process.env.MADRUGA_PASS) {
    	client.say('nickserv', 'IDENTIFY ' + process.env.MADRUGA_PASS);
    }
};

var onNotice = function (nick, to, text, message) {
	if(!process.env.MADRUGA_DEBUG){ //debug already prints those
		console.warn(text);
	}
};

var onError = function(message) {
    console.error('error: ', JSON.stringify(message));
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
client.addListener('notice', onNotice);
client.addListener('error', onError);

client.addListener('pm', onPvt);
client.addListener('message#', onMessage);
//client.addListener('message#channel', function (from, message){});

client.connect(function(){
	console.log('Connected to ' + process.env.MADRUGA_HOST + ' as ' + process.env.MADRUGA_USER);
});


console.log('MadrugaBot started successfully');