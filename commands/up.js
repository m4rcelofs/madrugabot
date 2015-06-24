var moment = require('moment');

module.exports = function(from, to, param, client) {
	var up = moment().locale('pt-br').subtract(process.uptime(), 'seconds');
	return 'Entrei online ' + up.fromNow();
};