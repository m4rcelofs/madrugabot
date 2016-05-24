var debug = process.env.MADRUGA_DEBUG || false;
var quietList = process.env.MADRUGA_QUIET_LIST || '';

var Bot = require('node-telegram-bot');
var bot;

function start() {
	bot = new Bot({
		token: process.env.MADRUGA_TELEGRAM || 'TOKEN HERE'
	  })
	  .on('message', handleMessage)
	  .on('error', function (message) {
		  console.error('It seems like we lost the connection...');
		  throw new Error('Telegram error:', message);
	  })
	  .start();
}

function handleMessage(message) {
	console.log(message);
	if (message && message.text && /^\/[a-zA-Z]+/.test(message.text)) {
		var parsed = /^\/([a-zA-Z]+)\s?(.*)/.exec(message.text);
		if (!parsed) { return; }
		var command = parsed[1];
		var param = parsed[2];
		try {
			if (debug) {
				console.log('received /' + command + ' ' + param);
			}
			var cmd = require('./commands/' + command.toLowerCase());
			if ((typeof cmd !== 'function') && cmd.telegram) {
				cmd = cmd.telegram;
			}
			param = param ? param.replace(/@\w+/, '').trim() : ''; // telegram sends /command@bot_name
			var answer = cmd(message.from, message.chat, param, bot);
			if (answer && quietList.indexOf(message.chat.id) === -1) {
				bot.sendMessage({
					chat_id: message.chat.id,
			        text: answer,
			        reply_to_message_id: message.message_id,
			        disable_web_page_preview: true
				}, function (err, msg) {
					if (debug) { console.log('executed /' + command); }
					if(err) { console.log(err); }
				});
			}
		} catch (e) {
			if (debug) {
				console.log(e);
			}
		}
	}
}

function sendMessage(destination, text) {
	console.log('sending message to ', destination);
	bot.sendMessage({
		chat_id: destination,
        text: text,
        disable_web_page_preview: true
	});
}

module.exports = {
	start: start,
	bot: bot,
	sendMessage: sendMessage,
};