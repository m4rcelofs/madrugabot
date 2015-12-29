function irc(from, to, param, client) {
	client.notice(from, 'Meus comandos: http://goo.gl/ol8pGA');
}

function telegram(from, to, param, bot) {
	return 'Meus comandos: http://goo.gl/ol8pGA';
}

module.exports = {
	irc : irc,
	telegram : telegram
};