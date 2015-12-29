function irc(from, to, param, client) {
	return telegram().irc.white.bgblack();
}

function telegram(from, to, param, bot) {
	return ' As novinhas piram nele, e ele ainda voa.... vem pra Flying Cock! ';
}

module.exports = {
	irc : irc,
	telegram : telegram
};