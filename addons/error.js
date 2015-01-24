module.exports = function(client) {
	client.addListener('error', function(message) {
		console.error('error: ', JSON.stringify(message));
	});
};