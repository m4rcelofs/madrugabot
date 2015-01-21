var request = require('request');
var getId = require('./id').get;

var search = function(to, id, client) {
	var url = process.env.MADRUGA_IMPORTIO_API;
	request.post({
		url: url,
		json: true,
		body: {
			input: {
				"webpage/url": "http://www.erepublik.com/en/citizen/profile/" + id
			}
		}
	}, function(error, response, body){
		if(error || body.error) {
			client.say(to, 'A API está offline ): [http ' + response.statusCode + ']');
			console.log(error);
			return;
		}
		var player = body.results[0];
		var referer = 'Nenhum amigo encontrado';
		if(player['referrer/_title']){
			referer = player['referrer/_title'];
		}
		client.say(to, 'Primeiro amigo (provável referer) do jogador ' + player.name + ': ' + referer);
	});
};

module.exports = function (from, to, param, client) {
	if(/^\d+$/.test(param.trim())) {
		search(to, param, client);
	} else {
		param = param || from;
		getId(param, function(id){
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