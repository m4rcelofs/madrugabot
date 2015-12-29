var request = require('request');
	
var irc = function(from, to, param, client) {
	if(param && param.trim()) {
		minify(param, function(body){
			if(body && body.longUrl && body.id && body.id.irc) {
				client.say(to, 'Link encurtado de ' + body.longUrl + ' para ' + body.id.irc.bold());			
			}
		});		
	}
};

/*
 * callback(response)
 * response.longUrl (original link)
 * response.id (goo.gl link)
 */
var minify = function(url, callback) {
	var google = 'https://www.googleapis.com/urlshortener/v1/url?fields=id%2ClongUrl';
	if(process.env.MADRUGA_GOOGLE_API_KEY) {
		google += '&key=' + process.env.MADRUGA_GOOGLE_API_KEY; 
	}
	var body = {
		'longUrl' : url
	};
	var options = {
		url : google,
		json : true,
		body : body
	};
	request.post(options, function(error, response, body) {
		if (!error && response.statusCode === 200 && !body.error) {
			callback(body);
		} else {
			callback(error || body.error);
		}
	});
};

var telegram =  function(from, to, param, bot){
	//TODO
};

module.exports = {
	irc: irc,
	telegram: telegram,
	minify: minify
};