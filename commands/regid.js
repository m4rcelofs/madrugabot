var setId = require('./id').set;

module.exports = function (from, to, param, client) {
	if(!param || !/\d+/.test(param)) {
		client.say(to, from + ', pfv digite ".regid idNoErepublik"');
		return; 
	}
	param = parseInt(param, 10);
	client.once('notice', function(ns, me, text, message) {
		if('NickServ' !== ns || (('STATUS ' + from + ' 3') !== text)) {
			client.say(to, from + ', por favor registre seu nick na Rizon primeiro');
			return;
		}
		setId(from, param, function(error){
			if(error) {
				client.say(to, from + ', não foi possível registrar a ID ' + param + ' para o seu nick ):');
			} else {
				client.say(to, param + ' registrado com sucesso para ' + from + ' (:');
			}
		});
	});
    client.say('nickserv', 'STATUS ' + from);
	return null;
};