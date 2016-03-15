console.log('Starting MadrugaBot...');

console.log('Environment is:');
for(var env in process.env) {
	if(/MADRUGA_\w*/.test(env)) {
		console.log(env + ': ' + process.env[env]);
	}
}

require('opbeat').start()
require('./telegram').start();
require('./irc').start();

console.log('MadrugaBot started successfully');