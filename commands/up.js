var moment = require('moment');

module.exports = function(from, to, param, client) {
	moment.locale('pt-br');
	var up = moment().subtract(process.uptime(), 'seconds');
	return 'Entrei online ' + up.fromNow();
};