var db = require('./firebase').db;
var request = require('request');
var moment = require('moment');

var key = process.env.MADRUGA_PUSHBULLET || '';

module.exports = function() {
	subscribe('epics/D1', 'erepublik_d1');
	subscribe('epics/D2', 'erepublik_d2');
	subscribe('epics/D3', 'erepublik_d3');
	subscribe('epics/D4', 'erepublik');
	
	function subscribe(path, destination) {
		var limit = Date.now() - 1000 * 60 * 5;
		db.child(path).orderByChild('reported').startAt(limit).on('child_added', function(s) {notify(s, destination);});
		db.child(path).orderByChild('reported').startAt(limit).on('child_changed', function(s) {notify(s, destination);});
	}
	
	function notify(snapshot, destination) {
		var battle = snapshot.val();
		var text = '';
		if(battle.attacker && battle.defender) {
			text += battle.attacker + ' vs ' + battle.defender + ' in ';
		}
		text += battle.region + '\n';
		text += battle.time + '\n';
		
		var up = moment(battle.reported);
		text += 'Reported ' + up.fromNow() + '\n';
		
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
		
		request(options, function(error, response, body) {
			console.log('posted epic ' + snapshot.key() + ' to pushbullet');
			console.log(body);
		});
	}
};