var request = require('request');

var getEnergy = function(param, callback) {
	param = (param || 'Brazil').trim();
	var url = 'https://erpk.creativeslabs.com/API/military?country=' + param;
	console.log('requesting as info from server', url);
	request(url, function(error, response, body){
		if (!error && response.statusCode === 200) {
			if(callback) {
				var status = JSON.parse(body);
				
				var results = '';
				
				results += 'Energia: ';
				results += status.as.energy.percentage + '% (';
				results += status.as.energy.current + ' / ';
				results += status.as.energy.required + ')\n';
				
				results += 'Moeda: ';
				results += status.as.currency.percentage + '% (';
				results += status.as.currency.current + ' / ';
				results += status.as.currency.required + ')\n';
				
				callback(results);
			}
		} else {
			console.log(response.statusCode, error);
		}
	});
};

function telegram(from, to, param, bot) {
	getEnergy(param, function(results) {
	  results = '`Status do AirStrike` (' + (param || 'Brasil').trim() + ') \n\n' + results;
	  bot.sendMessage({
			chat_id: to.id,
	        text: results,
	        parse_mode: 'Markdown',
	        disable_web_page_preview: true
	  });
  });
}

function irc(from, to, param, client) {
	getEnergy(function(results) {
		results = 'Status do AirStrike (' + (param || 'Brasil').trim() + ') \n\n' + results;
		client.say(to, results);
	});
}

module.exports = {
  irc : irc,
  telegram : telegram
};
