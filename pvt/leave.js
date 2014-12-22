module.exports = function(from, param, client) {
	var leave = /^#[\w\.]*$/;
	if(param && leave.test(param)){
		client.say(param, 'O ' + from + ' pediu pra eu sair daqui ):');
		client.part(param, 'bye bye', function() {
			client.say(from, 'Ok, saí do canal ' + param);
		});
	}
	return null;
};