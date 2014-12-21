var irc = require('irc');
var colors = require('irc-colors').global();

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

client.addListener('registered', function(message) {
    if(process.env.MADRUGA_PASS) {
    	client.say('nickserv', 'IDENTIFY ' + process.env.MADRUGA_PASS);
    }
});

client.addListener('notice', function (nick, to, text, message) {
	if(!process.env.MADRUGA_DEBUG){ //debug already prints those
		console.warn(text);
	}
});

var disconnect = function() {
	console.log('It seems like we lost the connection...');
	throw new Error('Server timeout');
};

var timeout = null;
var resetTimeout = function() {
	if(timeout) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(disconnect, 300000); //5min
};
client.addListener('ping', resetTimeout);
client.addListener('notice', resetTimeout);
client.addListener('message', resetTimeout);
resetTimeout();

client.addListener('error', function(message) {
    console.error('error: ', JSON.stringify(message));
});

client.addListener('pm', function(from, text) {
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
});

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

client.addListener('message#', function (from, to, message) {
	if(message && /^\.[a-z]+/.test(message)) {
		var parsed = /^\.([a-z]+)\s?(.*)/.exec(message);
		if(!parsed) { return null; }
		var command = parsed[1];
		var param = parsed[2];
		try {
			var cmd = require('./commands/' + command);
			var answer = cmd(from, to, param, client);
			if(answer) {
				client.say(to, answer);
			}
		} catch(e){}
	}
});

client.connect(function(){
	console.log('Connected to ' + process.env.MADRUGA_HOST + ' as ' + process.env.MADRUGA_USER);
});

console.log('MadrugaBot started successfully');