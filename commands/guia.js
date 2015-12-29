function irc(from, to, param, client) {
	return telegram().irc.bold();
}

function telegram(from, to, param, bot) {
	return 'Guia do eRepublik: ' + 'https://guiadoerepublik.wordpress.com/';
}

module.exports = {
	irc : irc,
	telegram : telegram
};