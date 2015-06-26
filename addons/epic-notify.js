var db = require('./firebase').db;
var request = require('request');
var moment = require('moment');

var key = process.env.MADRUGA_PUSHBULLET || '';

module.exports = function(client) {
	subscribe('epics/D1', 'D1', 'erepublik_d1');
	subscribe('epics/D2', 'D2', 'erepublik_d2');
	subscribe('epics/D3', 'D3', 'erepublik_d3');
	subscribe('epics/D4', 'D4', 'erepublik');
	
	function subscribe(path, div, destination) {
		var limit = Date.now() - 1000 * 60 * 5;
		db.child(path).orderByChild('reported').startAt(limit).on('child_added', function(s) {notify(s, div, destination);});
		db.child(path).orderByChild('reported').startAt(limit).on('child_changed', function(s) {notify(s, div, destination);});
	}
	
	function notify(snapshot, div, destination) {
		var battle = snapshot.val();
		if (battle.posted === true) { return; }
		
		notifyWeb(battle, destination);
		notifyIrc(battle, div);
		
		snapshot.ref().child('posted').set(true);
	}
	
	function notifyWeb(battle, destination) {
		var text = '';
		if(battle.attacker && battle.defender) {
			text += battle.attacker + ' vs ' + battle.defender + ' in ';
		}
		text += battle.region + '\n';
		text += 'Round ' + battle.round + '\n';
		text += battle.time + '\n';
		
		var options = {
				url: 'https://api.pushbullet.com/v2/pushes',
				method: 'POST',
				json: true,
				headers: {
					'Authorization': 'Bearer ' + key
				}, 
				body: {
					'channel_tag': destination,
					'type': 'link',
					'title': battle.status + ': ' + battle.time,
					'url': 'http://www.erepublik.com/en' + battle.href,
					'body': text
				}
		};

		console.log('posting ' + battle.href + ' to @' + destination);
		request(options, function(error, response, body) {
			if(error) { 
				console.log(error);
			}
			console.log(body);
		});
	}
	
	function notifyIrc(battle, div) {
		var sep = ' :: '.irc.green();
		var text = sep + ('Epic Battle ' +  div).irc.red()+ sep;
		if(battle.attacker && battle.defender) {
			text += battle.attacker + ' vs ' + battle.defender + ' in ';
		}
		text += battle.region + sep;
		text += battle.time.irc.black() + sep;
		text += 'Round ' + battle.round + sep;
		text+= 'http://www.erepublik.com/en' + battle.href + sep;
		
		console.log('shouting ' + battle.href);
		client.say('#madruga', text);
	}
};