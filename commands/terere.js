module.exports = function(from, to, param, client) {
	var nicks = param.split(' ');
	var terere = nicks[0];
	if(nicks.length > 1) {
		for(var i = 1; i<nicks.length - 1; i++) {
			terere += ', ' + nicks[i];
		}	
		terere += ' e ' + nicks[nicks.length - 1];
	}
	return 'Serve uma rodada de terere para ' + terere;
};