var debug = process.env.MADRUGA_DEBUG || false;
module.exports = function(client) {
	client.addListener('message#', function(from, to, message) {
		if (message && /^\.[a-z]+/.test(message)) {
			var parsed = /^\.([a-z]+)\s?(.*)/.exec(message);
			if (!parsed) { return; }
			var command = parsed[1];
			var param = parsed[2];
			try {
				if (debug) {
					console.log('received .' + command + ' ' + param);
				}
				var cmd = require('../commands/' + command);
				if ((typeof cmd !== 'function') && cmd.run) {
					cmd = cmd.run;
				}
				var answer = cmd(from, to, param ? param.trim() : '', client);
				if (answer) {
					client.say(to, answer);
				}
				if (debug) {
					console.log('executed .' + command);
				}
			} catch (e) {
				if (debug) {
					console.log(e);
				}
			}
		}
	});
};