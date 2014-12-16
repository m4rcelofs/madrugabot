var colors = require('irc-colors').global();

module.exports = {
  onMessage: function (from, to, text, client) {
	  if(text && /^\.[a-z]+/.test(text)) {
		  return parseMessage(from, to, text, client);  
	  }
	  return null;
  } 
};

var parseMessage = function (from, to, text, client) {
	var parsed = /^\.([a-z]+)\s?(.*)/.exec(text);
	if(!parsed) {
		return null;
	}
	
	var command = parsed[1];
	var param = parsed[2];
	
	if(phrases[command]) {
		return phrases[command];
	}
	
	if(cmd[command]) {
		return cmd[command](from, to, param, client);	
	} 
	
	return null;
};

var download = function(url, callback) {
	var data = '';
	var request = require('https').get(url, function(res) {
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			callback(data);
		});
	});
	request.on('error', function(e) {
		console.error("Download error: " + e.message);
	}); 
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
}

var phrases = {
	abs: 'abspt',
	alone: 'Cri... cri... cri...',
	blackhigh: 'Black today,  Black tomorrow, Black forever xD',
	bozo: 'VÃO TOMAR NO CU TODOS VOCÊS',
	chain: 'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
	chaingunmax: 'ELA ELA ELA ABAIXO A PANELA',
	cp: 'IMPEACH NELE AGORA!',
	dino: 'RAWRRRRRRR',
	donate: 'Ajude a pagar meu aluguel! http://www.erepublik.com/en/economy/donate-money/5313713',
	fakes: 'Fakes, fakes everywhere!',
	fenix: 'A periquita tá pegando fogo!',
	go: 'GO GO power rangers!!',
	jailson: 'AI QUE DELÍCIA CARA!',
	jazar: 'todo mundo com dedo no cu menos eu!',
	kisk: 'KISK,KISK. Inglês e espanhol é kisk.',
	kongha: 'Kongha la Kongha',
	lag: 'Fiz minha conta no ORKUT hoje',
	lol: 'LOL',
	madruga: 'A vingança nunca é plena, mata a alma e a envenena',
	maxi: 'Não seja gay',
	moni: 'Ei, você aí, me dá um dinheiro aí, me dá um dinheiro aí',
	mua: 'Muahahahahah',
	nb: 'Você é muito noob!',
	okay: 'Okay :/',
	pau: 'PaulWarfield está pensando na mandioca do nW0lf',
	quero: 'Quero ver... Outra vez... Seus olhinhos de noite serena.',
	sai: 'GET THE FUCK OUT!!!',
	silmarienn: 'nW0lf S2 Silmarienn',
	treta: 'É muita treta!',
	trollface: 'Problem?',
	vish: 'Vish, muita treta, vish... Muita treta... É muita treta',
	wolf: 'Awooooooooooooooooooooooooooooooooooooooooooooooooo',
};

var cmd = {};

cmd.bg = function(from, to, param, client) {
	return 'Vocês tem 4 dias para ' + param;
};

cmd.md = function(from, to, param, client) {
	var url = 'https://docs.google.com/spreadsheet/pub' +
				'?key=0AtKIBJ-62ILkdGNuYWNfZ2RhalVNaVltbkNTLUpEelE' +
				'&single=true' +
				'&gid=0' +
				'&range=A2%3AI8' +
				'&output=csv';
	download(url, function(data){
		sendOrders(data, to, client);
	});
	return 'Buscando ordens...';
};

cmd.up = function(from, to, param, client) {
	var uptimeHours = process.uptime() / 3600;
	return 'Estou online por ~' + uptimeHours + 'h';
};

cmd.sorteio = function(from, to, param, client) {
	if(!param) { return null; }
	client.once('names',  function(channel, nicks) {
		if(to === channel) {
			var array = [];
			for(var nick in nicks) {
				array.push(nick);
			}
			var chosen = array[Math.floor(Math.random()*array.length)];
			client.say(to, 'Parabéns ' + chosen +', você acabou de ganhar ' + param + '!');
		}
	});
	client.send('names', to);
	return null;
};

cmd.test = function(from, to, param, client) {
	//example function
	console.log('test: ' + from + ', ' + to + ', ' + param);
	return "IT'S ALIVE!";
};

cmd.v = function(from, to, param, client) {
	var pkg = require('./package.json');
	return pkg.name + ' ' + pkg.version;
}