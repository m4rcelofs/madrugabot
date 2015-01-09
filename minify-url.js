var request = require('request');

module.exports = function(url, callback) {
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
		}
	});
}