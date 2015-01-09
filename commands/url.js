var minify = require.main.require('./minify-url');

module.exports = function(from, to, param, client) {
	minify(param, function(body){
		if(body) {
			client.say(to, 'Link encurtado de ' + body.longUrl + ' para ' + body.id.irc.bold());			
		}
	});
};