var cheerio = require('cheerio');
var moment = require('moment-timezone');
var request = require('request');

function getNew(param, callback) {
	var erTimeZone = 'America/Los_Angeles';
	
	moment.locale('pt-br');
	var today = moment.tz(erTimeZone);
	var date = today.format('YYYY-MM-DD');
	var country = 'Brazil';

	var dateRegex = /[\w\s]*(\d{4}-\d{2}-\d{2})[\w\s]*/;
	if(dateRegex.test(param)) {
	  var exec = dateRegex.exec(param.trim());
	  if(moment.tz(exec[1], 'YYYY-MM-DD', erTimeZone).isBefore(today)) {
		date = exec[1].trim();
	  }
	}
	
	var countryRegex = /[\d-\s]*([a-zA-Z]+)[\d-\s]*/;
	if(countryRegex.test(param)) {
	  var exec = countryRegex.exec(param.trim());
   	  country = exec[1].trim();
	}	

    console.log("requesting new users data for", country, date);
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