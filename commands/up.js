module.exports = function(from, to, param, client) {
	var uptimeHours = process.uptime() / 3600;
	return 'Estou online por ~' + uptimeHours + 'h';
};