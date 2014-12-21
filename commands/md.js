var request = require('request');

module.exports = function (from, to, param, client) {
	var url = 'https://docs.google.com/spreadsheet/pub' +
	'?key=0AtKIBJ-62ILkdGNuYWNfZ2RhalVNaVltbkNTLUpEelE' +
	'&single=true' +
	'&gid=0' +
	'&range=A2%3AI8' +
	'&output=csv';
	request(url, function(error, response, body){
		if (!error && response.statusCode === 200) {
			sendOrders(body, to, client);
		}
	});
	return 'Buscando ordens...';
};

var sendOrders = function(data, to, client) {
	var flag = '['.irc.green.bggreen() + 
				'<'.irc.yellow.bggreen() + 
				'o'.irc.blue.bggreen() + 
				'>'.irc.yellow.bggreen() + 
				']'.irc.green.bggreen();
	var toSay = flag + 
				' Ministério da Defesa - Ordens de Batalha '.irc.yellow.bggreen() + 
				flag + 
				'\n';
	var lines = data.split('\n');
	for(var i=0; i < lines.length - 1; i++) {
		var cells = lines[i].split(',');
		var type = (' (' + cells[2] + '): ').irc.bgolive();
		var region = (' ' + cells[0] + ' ').irc.bggrey();
		var link = (' ' + cells[1] + ' ').irc.bglightgray();
		var ally = (' ' + cells[4] + ' ').irc.bglightgreen();
		var vs = (' ' + cells[5] + 'x' + cells[6] + ' ').irc.bglightgray();
		var enemy = (' ' + cells[7] + ' ').irc.bgred();
		var prio = ' ' + cells[3] + ' ';
		switch(cells[3]) {
		case 'MÁXIMA':
			prio = prio.irc.red.bgblack();
			break;
		case 'ALTA':
			prio = ' '.irc.bgblack() + prio.irc.bgred();
			break;
		case 'MÉDIA':
			prio = prio.irc.bgolive();
			break;
		case 'BAIXA':
			prio = prio.irc.bgyellow();
			break;
		case 'SEGURA':
			prio = prio.irc.bggreen();
			break;
		case 'PERDIDA':
		case 'NÃO LUTAR':
			prio = prio.irc.bglightgray();
			break;
		}
		if(cells[0]) {
			toSay += region + type + ally + vs + enemy + prio + link + '\n';	
		}
	}
	var latestUpdate = lines[lines.length - 1].split(',');
	toSay += flag + (' Último update: ' + 
						latestUpdate[1] + 
						' @ ' + 
						latestUpdate[2] + 
					' ').irc.yellow.bggreen() + 
			 flag + '\n';
	toSay += flag + ' Planilha:  http://goo.gl/zLp8hn '.irc.yellow.bggreen() + flag;
	client.say(to, toSay);
};