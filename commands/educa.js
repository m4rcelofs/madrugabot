function irc(from, to, param, client) {
	return 'Novo no jogo? Inscreva-se no EDUCA e consiga um tutor! ' + 
			'http://www.erepublik.com/en/article/2488915'.irc.red();
}

function telegram(from, to, param, bot) {
	return 'Novo no jogo? Inscreva-se no EDUCA e consiga um tutor! \n' + 
			'http://www.erepublik.com/en/article/2488915';
}

module.exports = {
	irc : irc,
	telegram : telegram
};