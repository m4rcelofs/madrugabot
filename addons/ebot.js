var setId = require('../commands/id').set;
var strip = require('irc-colors').stripColorsAndStyle;

module.exports = function(client) {
	client.addListener('message#', function(from, to, message) {
		try {
			if('e-bot' === from) {
				message = strip(message);
				var fcLp = /:: ([\w\s\.]+) \[(\d+)\]( {2,3})(Elite Citizen)?( {2,3})?::/;
				var link = /:: ([\w\s\.]+) \((\d+)\) :: Profile Link/;
				var parsed = fcLp.exec(message) || link.exec(message);
				if(parsed) {
					var nick = parsed[1];
					var id = parseInt(parsed[2]);
					setId(nick, {
						id: id,
						ingame: true
					});
					if(process.env.MADRUGA_DEBUG) {
						console.log('Got info from e-bot: ' + nick + ' [' + id + ']');
					}
				}
			}	
		} catch(e){
			console.log(e);
		}
	});
};