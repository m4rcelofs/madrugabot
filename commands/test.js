function telegram(from, to, param, bot) {
	//example function
	console.log('test: ' + from + ', ' + to + ', ' + param);
	return "IT'S ALIVE!";
}

function irc(from, to, param, client) {
	//example function
	console.log('test: ' + from + ', ' + to + ', ' + param);
	return "IT'S ALIVE!";
}

module.exports = {
	irc : irc,
	telegram : telegram
};
