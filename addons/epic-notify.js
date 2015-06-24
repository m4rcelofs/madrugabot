var db = require('./firebase').db;
var moment = require('moment');

module.exports = function(client) {
	subscribe('epics/D1', 'D1');
	subscribe('epics/D2', 'D2');
	subscribe('epics/D3', 'D3');
	subscribe('epics/D4', 'D4');
	
	function subscribe(path, div) {
		var limit = Date.now() - 1000 * 60 * 5;
		db.child(path).orderByChild('reported').startAt(limit).on('child_added', function(s) {notify(s, div);});
		db.child(path).orderByChild('reported').startAt(limit).on('child_changed', function(s) {notify(s, div);});
	}
	
	function notify(snapshot, div) {
		var battle = snapshot.val();
		if (battle.shouted === true) { return; }
		
		var sep = ' :: '.irc.green();
		var text = 'Epic Battle ' +  div.irc.red()+ sep;
		if(battle.attacker && battle.defender) {
			text += battle.attacker + ' vs ' + battle.defender + ' in ';
		}
		text += battle.region + sep;
		text += battle.time + sep;
		
		var up = moment(battle.reported).locale('en');
		text += 'Reported ' + up.fromNow() + sep;
		
		text+= 'http://www.erepublik.com/en' + battle.href + sep;
		
		console.log('shouting ' + snapshot.key());
		
		client.say('#madruga', text);
		snapshot.ref().child('shouted').set(true);
	}
};