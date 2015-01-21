var cheerio = require('cheerio');
var moment = require('moment-timezone');
var request = require('request');

module.exports = function(from, to, param, client) {

	var erTimeZone = 'America/Los_Angeles';
	
	moment.locale('pt-br');
	var today = moment.tz(erTimeZone);

	var regex = /^(\d{4}-\d{2}-\d{2})? ?(\w+)?$/;
	var exec = regex.exec(param ? param.trim() : '');
	var date = exec[1];
	if(!date || moment.tz(date, 'YYYY-MM-DD', erTimeZone).isAfter(today)) {
		date = today.format('YYYY-MM-DD');
	}
	var country = exec[2] || 'Brazil';
	
	date = date.trim();
	country = country.trim();
	
	request.post({
		url : 'http://ereptools.tk/newbs/result.php',
		form : {
			country : country,
			from : 0,
			go : 'SUBMIT',
			date : date
		}
	}, function(error, response, body) {
		if (error) {
			client.say(to,
					'O servidor de novos jogadores está offline ): [http ' + response.statusCode + ']');
		} else {
			var $ = cheerio.load(body);
			var newUsers = $('.page-header > h1').text();
			var titleRegex = /^(\d+).*$/;
			if(titleRegex.test(newUsers)){
				newUsers = titleRegex.exec(newUsers)[1] +
							' novos jogadores se registraram dia ' +
							date + ' no ' + country;
				var flag = '['.irc.green.bggreen() + 
							'<'.irc.yellow.bggreen() + 
							'o'.irc.blue.bggreen() + 
							'>'.irc.yellow.bggreen() + 
							']'.irc.green.bggreen();
				newUsers += ' ' + flag + ' http://jackson-bot.appspot.com '.irc.yellow.bggreen() + flag;
			} else {
				newUsers = 'Sem dados para o dia ' + date + ' no ' + country;
			}
			client.say(to, newUsers);
		}
	});
	return 'Procurando novos jogadores...';
};