var pkg = require.main.require('./package.json');

module.exports = function(from, to, param, client) {
	return pkg.name + ' ' + pkg.version + ' (Node.js ' + process.version + ')';
}