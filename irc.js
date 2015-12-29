var irc = require('irc');
var colors = require('irc-colors').global();

var client = new irc.Client(process.env.MADRUGA_HOST || 'irc.rizon.net',
		process.env.MADRUGA_USER || 'Madruga', 
	{
		channels: process.env.MADRUGA_CHANNELS ? 
		process.env.MADRUGA_CHANNELS.split(' ') : '',
		port: process.env.MADRUGA_PORT || 6667,
		localPort: process.env.MADRUGA_LOCALPORT || 50555,
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

function start() {
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
}

module.exports = {
	start: start,
};