var cheerio = require('cheerio');
var moment = require('moment-timezone');
var request = require('request');

function getNew(param, callback) {
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
	}, callback);
}

function irc(from, to, param, client) {
	getNew(param, function(error, response, body) {
		if (error) {
			client.say(to,
					'O servidor de novos jogadores está offline ): [http ' + response.statusCode + ']');
		} else {
			var $ = cheerio.load(body);
			var newUsers = $('.page-header > h1').text();
			var titleRegex = /^(\d+).*$/;
			if(titleRegex.test(newUsers)){
				newUsers = titleRegex.exec(newUsers)[1] +
							' novos jogadores se registraram neste dia';
				var flag = '['.irc.green.bggreen() + 
							'<'.irc.yellow.bggreen() + 
							'o'.irc.blue.bggreen() + 
							'>'.irc.yellow.bggreen() + 
							']'.irc.green.bggreen();
				newUsers += ' ' + flag + ' http://jackson-bot.appspot.com '.irc.yellow.bggreen() + flag;
			} else {
				newUsers = 'Sem dados para o dia';
			}
			client.say(to, newUsers);
		}
	});	
}

function telegram(from, to, param, bot) {
	getNew(param, function(error, response, body) {
		if (error) {
			bot.sendMessage({
				chat_id: to.id,
		        text: 'O servidor de novos jogadores está offline ): [http ' + response.statusCode + ']'
			});
		} else {
			var $ = cheerio.load(body);
			var newUsers = $('.page-header > h1').text();
			var titleRegex = /^(\d+).*$/;
			if(titleRegex.test(newUsers)){
				newUsers = titleRegex.exec(newUsers)[1] +
							' novos jogadores se registraram neste dia';
				var flag = '[<o>]';
				newUsers += '\n\n ' + flag + ' http://jackson-bot.appspot.com ' + flag;
			} else {
				newUsers = 'Sem dados para o dia';
			}
			bot.sendMessage({
				chat_id: to.id,
		        text: newUsers,
		        disable_web_page_preview: true
			});
		}
	});	
}

module.exports = {
	irc : irc,
	telegram : telegram
};