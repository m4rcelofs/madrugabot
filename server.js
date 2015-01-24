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
    	autoRejoin: true,
    	autoConnect: false, 
    	showErrors: true,
    	debug: process.env.MADRUGA_DEBUG || false,
    	userName: 'madruga',
    	realName: 'madruga IRC bot',
    	floodProtection: true,
    	floodProtectionDelay: 300,
	}
);

console.log('Loading addons...');
var addons = require("path").join(__dirname, "addons");
require("fs").readdirSync(addons).forEach(function(file) {
	var addon = require("./addons/" + file);
	if ((typeof addon !== 'function') && addon.run) {
		addon = addon.run;
	}
	addon(client);
	console.log('Addon loaded: ' + file);
});

client.connect(function(){
	console.log('Connected to ' + process.env.MADRUGA_HOST + ' as ' + process.env.MADRUGA_USER);
});

console.log('MadrugaBot started successfully');