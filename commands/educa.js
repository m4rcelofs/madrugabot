function irc(from, to, param, client) {
	return 'Novo no jogo? Inscreva-se no EDUCA e consiga um tutor! ' + 
			'http://tinyurl.com/VouProEDUCA'.irc.red();
}

function telegram(from, to, param, bot) {
	return 'Novo no jogo? Inscreva-se no EDUCA e consiga um tutor! \n' + 
			'http://tinyurl.com/VouProEDUCA';
}

module.exports = {
	irc : irc,
	telegram : telegram
};