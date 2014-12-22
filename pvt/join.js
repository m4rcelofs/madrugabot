module.exports = function(from, param, client) {
	var join = /^#[\w\.]*$/;
	if(param && join.test(param)){
		client.join(param, function(){
			client.say(param, 'Olá a todos! O ' + from + ' pediu pra eu entrar aqui (:');
			client.say(from, 'Ok, entrei no canal ' + param);
		});
	}
	return null;
};