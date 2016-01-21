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
		it('should default to current date / Brazil with no args', function(done) {
			nock('http://ereptools.tk')
				.post('/newbs/result.php')
				.reply(200, template('Brazil', today));
			var client = {
				say : function(to, text) {
					assert(text.indexOf('22 novos jogadores se registraram dia ' + today + ' no Brazil') > -1);
					done();
				}
			};
			cmd('from', 'to', '', client);
		});
		
		it('should default to Brazil with "YYYY-MM-DD" arg', function(done) {
			nock('http://ereptools.tk')
				.post('/newbs/result.php')
				.reply(200, template('Brazil', '2010-01-01'));
			var client = {
				say : function(to, text) {
					assert(text.indexOf('22 novos jogadores se registraram dia 2010-01-01 no Brazil') > -1);
					done();
				}
			};
			cmd('from', 'to', '  2010-01-01  ', client);
		});
		
		it('should default to today with "country" arg', function(done) {
			nock('http://ereptools.tk')
				.post('/newbs/result.php')
				.reply(200, template('USA', today));
			var client = {
				say : function(to, text) {
					assert(text.indexOf('22 novos jogadores se registraram dia ' + today + ' no USA') > -1);
					done();
				}
			};
			cmd('from', 'to', '  USA  ', client);
		});
		
		it('should work with "YYYY-MM-DD country" args', function(done) {
			nock('http://ereptools.tk')
				.post('/newbs/result.php')
				.reply(200, template('USA', '2011-11-11'));
			var client = {
				say : function(to, text) {
					assert(text.indexOf('22 novos jogadores se registraram dia 2011-11-11 no USA') > -1);
					done();
				}
			};
			cmd('from', 'to', '  2011-11-11 USA  ', client);
		});
		
		it('should default a future date to today', function(done) {
			nock('http://ereptools.tk')
				.post('/newbs/result.php')
				.reply(200, template('Brazil', today));
			var client = {
				say : function(to, text) {
					assert(text.indexOf('22 novos jogadores se registraram dia ' + today + ' no Brazil') > -1);
					done();
				}
			};
			cmd('from', 'to', tomorrow, client);
		});
		
		it('should not fail if there are no results', function(done) {
			nock('http://ereptools.tk')
				.post('/newbs/result.php')
				.reply(200, 'No new citizens in the database for ' + today + '.');
			var client = {
				say : function(to, text) {
					assert(text.indexOf('Sem dados para o dia ' + today + ' no Brazil') > -1);
					done();
				}
			};
			cmd('from', 'to', today, client);
		});
});