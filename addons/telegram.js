var debug = process.env.MADRUGA_DEBUG || false;
var quietList = process.env.MADRUGA_QUIET_LIST || '';

var Bot = require('node-telegram-bot');
var bot;

module.exports = function() {
	bot = new Bot({
		token: process.env.MADRUGA_TELEGRAM || 'TOKEN HERE'
	  })
	  .enableAnalytics(process.env.MADRUGA_BOTAN_IO)
	  .on('message', handleMessage)
	  .start();
};

function handleMessage(message) {
	console.log(message);
	if (message && message.text && /^\/[a-z]+/.test(message.text)) {
		var parsed = /^\/([a-z]+)\s?(.*)/.exec(message.text);
		if (!parsed) { return; }
		var command = parsed[1];
		var param = parsed[2];
		try {
			if (debug) {
				console.log('received /' + command + ' ' + param);
			}
			var cmd = require('../commands/' + command);
			if ((typeof cmd !== 'function') && cmd.telegram) {
				cmd = cmd.telegram;
			}
			var answer = cmd(message.from, message.chat, param ? param.trim() : '', bot);
			if (answer && quietList.indexOf(message.chat.id) === -1) {
				bot.sendMessage({
					chat_id: message.chat.id,
			        text: answer,
			        reply_to_message_id: message.message_id
				});
				if (debug) { console.log('executed /' + command); }
			}
		} catch (e) {
			if (debug) {
				console.log(e);
			}
		}
	}
}