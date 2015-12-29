function irc(from, to, param, client) {
    return telegram().irc.white.bgblack();
}

function telegram(from, to, param, bot) {
	return ' O Ministério da Saúde informa: O movimento na FC é tão bom e intenso que causa ejaculação precoce ';
}

module.exports = {
	irc : irc,
	telegram : telegram
};