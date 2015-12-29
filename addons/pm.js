module.exports = function(client) {
	client.addListener('pm', function(from, message) {
		if (message && /^\.[a-z]+/.test(message)) {
			var parsed = /^\.([a-z]+)\s?(.*)/.exec(message);
			if (!parsed) { return;	}
			var command = parsed[1];
			var param = parsed[2];
			try {
				var cmd = require('../pvt/' + command.toLowerCase());
				var answer = cmd(from, param ? param.trim() : '', client);
				if (answer) {
					client.say(from, answer);
				}
			} catch (e) {
				client.say(from, "?");
			}
		} else {
			client.say(from,
					"I'm a bot! Digite '.join #canal', '.leave #canal' ou '.help'.");
		}
	});
};