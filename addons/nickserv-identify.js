module.exports = function(client) {
	client.addListener('registered', function(message) {
		if (process.env.MADRUGA_PASS) {
			client.say('nickserv', 'IDENTIFY ' + process.env.MADRUGA_PASS);
		}
	});
};