var request = require('request');
var getId = require('./id').get;

var search = function(to, id, client) {
	request.post({
		url: 'http://sniper.vot.pl/erepublik/names.json',
		form: {
			cid: id
		}
	}, function(error, response, body) {
		if(error) {
			client.say(to, 'O servidor de nicks está offline ): [http ' + response.statusCode + ']');
		} else {
			var data = JSON.parse(body);
			if(data && data.length > 0) {
				var namesHistory = 'Achei os seguintes nicks para o jogador ' + id + ': ';
				for(var i=0; i < data.length; i++) {
					namesHistory += data[i].name.irc.bold() + ' (>' + data[i].erep_day + ') ';
				}
				client.say(to, namesHistory);
			} else {
				client.say(to, 'Não encontrei nicks para o jogador ' + id + '!');
			}
		}
	});
};

module.exports = function (from, to, param, client) {
	if(/^\d+$/.test(param.trim())) {
		search(to, param, client);
	} else {
		getId(param || from, function(id){
			if(id) {
				search(to, id, client);	
			}
			else {
				client.say(to, 'Não sei a ID do ' + param + '... ):');
				return;
			}
		});		
	}
	return null;
};