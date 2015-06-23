var fb = require('./firebase');
var strip = require('irc-colors').stripColorsAndStyle;

module.exports = function(client) {
	client.addListener('message#', function(from, to, message) {
		try {
			if('e-bot' === from) {
				message = strip(message);
				var epic = /Epic Battle (D[1-4])!  :: \[Round:(\d+)\] \[(\d\dh:\d\dm)\] \[([a-zA-Z\s]+)\] http:\/\/www.erepublik.com\/en([\w\/-]+)/;
				var parsed = epic.exec(message);
				if(parsed) {
					var battle = {
						round: parseInt(parsed[2], 10),
						time: parsed[3],
						region: parsed[4],
						href: parsed[5],
						status: 'Epic Battle',
						reported: {
							'.sv': 'timestamp'
						}
					};
					var div = parsed[1]; 
					var id = battle.href.substring(battle.href.lastIndexOf('/') + 1);
					fb.update('/epics/' + div + '/' + id, battle);
					if(process.env.MADRUGA_DEBUG) {
						console.log('Got info from e-bot: ' + JSON.stringify(battle));
					}
				}
			}	
		} catch(e){
			console.log(e);
		}
	});
};