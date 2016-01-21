require('irc-colors').global();
var assert = require('assert');
var moment = require('moment-timezone');
var nock = require('nock');
var sinon = require('sinon');

var cmd = require('../commands/new.js').irc;

var erTimeZone = 'America/Los_Angeles';
var today = moment().tz(erTimeZone).format('YYYY-MM-DD');
var tomorrow = moment().tz(erTimeZone).add(1, 'days').format('YYYY-MM-DD');

var template = function(country, day){
	return '<div class="page-header"><h1>22 new {country} citizens for the day of {day}!</h1><br></div>'
			.replace('{country}', country)
			.replace('{day}', day);
};

describe('.new', function() {
		it('should run the command', function(done) {
			nock('http://ereptools.tk')
				.post('/newbs/result.php')
				.reply(200, template('Brazil', today));
			var client = {
				say : function(to, text) {
					assert(text.indexOf('22 novos jogadores se registraram neste dia') > -1);
					done();
				}
			};
			cmd('from', 'to', '', client);
		});
});