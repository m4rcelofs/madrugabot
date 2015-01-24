module.exports = function(client) {
	client.addListener('notice', function(nick, to, text, message) {
		if (!process.env.MADRUGA_DEBUG) { // debug already prints those
			console.warn(text);
		}
	});
};