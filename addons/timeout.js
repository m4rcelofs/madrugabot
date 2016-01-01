module.exports = function(client) {
	var disconnect = function() {
		console.error('It seems like we lost the connection...');
		throw new Error('Server timeout');
	};
	var timeout = null;
	var resetTimeout = function() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(disconnect, 300000); // 5min
	};
	client.addListener('ping', resetTimeout);
	client.addListener('notice', resetTimeout);
	client.addListener('message', resetTimeout);
	resetTimeout();
};