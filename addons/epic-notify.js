var db = require('./firebase').db;
var request = require('request');
var moment = require('moment');

var key = process.env.MADRUGA_PUSHBULLET || '';

module.exports = function(client) {
	subscribe('epics/D1', 'D1', '@epics1');
	subscribe('epics/D2', 'D2', '@epics2');
	subscribe('epics/D3', 'D3', '@epics3');
	subscribe('epics/D4', 'D4', '@epics');
	
	function subscribe(path, div, destination) {
		var limit = Date.now() - 1000 * 60 * 5;
		db.child(path).orderByChild('reported').startAt(limit).on('child_added', function(s) {notify(s, div, destination);});
		db.child(path).orderByChild('reported').startAt(limit).on('child_changed', function(s) {notify(s, div, destination);});
	}
	
	function notify(snapshot, div, destination) {
		console.log('notifying new epic battle');
		var battle = snapshot.val();
		if (battle.round <= battle.posted) { return; }
		
		notifyTelegram(battle, destination);
		notifyIrc(battle, div);
		
		snapshot.ref().child('posted').set(battle.round);
	}
	
	function notifyTelegram(battle, destination) {
		var text = battle.status + ': ' + battle.time + '\n';
		if(battle.attacker && battle.defender) {
			text += battle.attacker + ' vs ' + battle.defender + '\n';
		}
		text += battle.region + '\n';
		text += 'Source: ' + (battle.source || 'unknown') + '\n';
		text += 'http://www.erepublik.com/en' + battle.href;
		
		console.log('posting ' + battle.href + ' to ' + destination);
		require('../telegram').sendMessage(destination, text);
	}
	
	function notifyIrc(battle, div) {
		var sep = ' :: '.irc.green();
		var text = sep + ('Epic Battle ' +  div).irc.red()+ sep;
		if(battle.attacker && battle.defender) {
			text += battle.attacker + ' vs ' + battle.defender + ' in ';
		}
		text += battle.region + sep;
		text += battle.time.irc.black() + sep;
		text += 'http://www.erepublik.com/en' + battle.href + sep;
		text += 'Source: ' + (battle.source || 'unknown') + sep;
		
		console.log('shouting ' + battle.href);
		client.say('#madruga', text);
	}
};