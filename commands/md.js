var request = require('request');
var debug = process.env.MADRUGA_DEBUG || false;

var url = 'https://docs.google.com/spreadsheets/d' +
			'/1OIX6ugsuPPMAUhhostxNhLI7Lfg-o1vTkWE8tBK_NWc/pub' +
			'?single=true' +
			'&gid=0' +
			'&range=A2%3AI8' +
			'&output=csv';

function md(from, to, param, client, type) {
	if(debug) {
		console.log('.md requesting table');
	}
	
	request(url, function(error, response, body){
		if (!error && response.statusCode === 200) {
			if(debug) {
				console.log('table received');
			}
			switch(type) {
		  		case 'IRC':
		  			sendOrdersIrc(body, to, client);
		  			break;
		  		case 'TELEGRAM':
		  			sendOrdersTelegram(body, to, client);
		  			break;
			}		
		} else {
			console.log(error);
		}
	});
}

var sendOrdersIrc = function(data, to, client) {
	if(debug) {
		console.log('sending orders');
	}
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
			prio = ' '.irc.bgblack() + prio.irc.bgred() + ' '.irc.bgblack();
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
	if(debug) {
		console.log('orders sent');
	}
};


var sendOrdersTelegram = function(data, to, bot) {
	if(debug) {
		console.log('sending orders');
	}
	var flag = '[<o>]';
	var toSay = flag + 
				' Ministério da Defesa - Ordens de Batalha ' + 
				flag + 
				'\n\n';
	var lines = data.split('\n');
	for(var i=0; i < lines.length - 1; i++) {
		var cells = lines[i].split(',');
		var type = (' (' + cells[2] + '): ');
		var region = (' ' + cells[0] + ' ');
		var link = (' ' + cells[1] + ' ');
		var ally = (' ' + cells[4] + ' ');
		var vs = (' ' + cells[5] + 'x' + cells[6] + ' ');
		var enemy = (' ' + cells[7] + ' ');
		var prio = ' ' + cells[3] + ' ';
		if(cells[0]) {
			toSay += region + type + '\n' + ally + vs + enemy + '\n' + prio + '\n' + link + '\n\n';	
		}
	}
	var latestUpdate = lines[lines.length - 1].split(',');
	toSay += flag + (' Último update: ' + 
						latestUpdate[1] + 
						' @ ' + 
						latestUpdate[2] + 
					' ') + 
			 flag + '\n';
	toSay += flag + ' Planilha:  http://goo.gl/zLp8hn ' + flag;
	bot.sendMessage({
		chat_id: to.id,
        text: toSay,
        disable_web_page_preview: true
	});
	if(debug) {
		console.log('orders sent');
	}
};

module.exports = {
	irc : function(from, to, param, client){
		md(from, to, param, client, 'IRC');
	},
	telegram : function(from, to, param, bot){
		md(from, to, param, bot, 'TELEGRAM');
	}
};