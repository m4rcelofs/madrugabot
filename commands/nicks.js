var request = require('request');

module.exports = function (from, to, param, client) {
	if(!param || !/^\d+$/.test(param.trim())) { return null; }
	param = param.trim();
	
	request.post({
		url: 'http://sniper.vot.pl/erepublik/names.json',
		form: {
			cid: param
		}
	}, function(error, response, body) {
		if(error) {
			client.say(to, 'O servidor de nicks está offline ): [http ' + response.statusCode + ']');
		} else {
			var data = JSON.parse(body);
			if(data && data.length > 0) {
				var namesHistory = 'Achei os seguintes nomes para o jogador ' + param + ': ';
				for(var i=0; i < data.length; i++) {
					namesHistory += data[i].name.irc.bold() + ' (>' + data[i].erep_day + ') ';
				}
				client.say(to, namesHistory);
			} else {
				client.say(to, 'Não encontrei nicks para o jogador ' + param + '!');
			}
		}
	});
	return 'Procurando nicks...';
};