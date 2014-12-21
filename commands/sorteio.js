module.exports = function(from, to, param, client) {
	if(!param) { return null; }
	client.once('names',  function(channel, nicks) {
		if(to === channel) {
			var array = [];
			for(var nick in nicks) {
				array.push(nick);
			}
			var chosen = array[Math.floor(Math.random() * array.length)];
			client.say(to, 'Parabéns ' + chosen +', você acabou de ganhar ' + param + '!');
		}
	});
	client.send('names', to);
	return null;
};