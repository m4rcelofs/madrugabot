var moment = require('moment');
var request = require('request');

var getVotes = function(callback) {
	var date = moment().date(5);
	if(date.isAfter(moment())) {
		date = date.subtract(1, 'months');
	}
	var url = 'http://api.erepublik-deutschland.de/countryapi/cpvotes/9/' + date.format('YYYY-MM-DD');
	console.log('requesting votes from server', url);
	request(url, function(error, response, body){
		if (!error && response.statusCode === 200) {
			if(callback) {
				callback(format(JSON.parse(body).votes));
			}
		} else {
			console.log(response.statusCode, error);
		}
	});
};

var format = function(votes) {
	var total = {};
	for(var i=votes.length-1; i>=0; i--) {
		var target = votes[i];
		if(total[target.citizen_id]) {
			break;
		}
		total[target.citizen_id] = target;		
	}
	var sorted = [];
	for(var v in total) {
		sorted.push(total[v]);
	}
	return sorted.sort(function(a, b){
		return b.votes - a.votes;
	});	
};

function telegram(from, to, param, bot) {
  getVotes(function(votes) {
	  var results = '\[<o>\] Eleições eBrasileiras \[<o>\]\n\n';
	  votes.forEach(function(item){
		  results += '[' + item.name + '](https://www.erepublik.com/br/citizen/profile/' + item.citizen_id + '):';
		  results += item.votes;
		  results += '\n';
	  });
	  results += 'Última atualização: ' + votes[0].added;
	  bot.sendMessage({
			chat_id: to.id,
	        text: results,
	        parse_mode: 'Markdown',
	        disable_web_page_preview: true
	  });
  });
}

function irc(from, to, param, client) {
	  getVotes(function(votes) {
		  var results = '[<o>] Eleições eBrasileiras [<o>]\n';
		  votes.forEach(function(item){
			  results += item.name + ': ';
			  results += item.votes;
			  results += '\n';
		  });
		  results += 'Última atualização: ' + votes[0].added;
		  client.say(to, results);
	  });
}

module.exports = {
  irc : irc,
  telegram : telegram
};
