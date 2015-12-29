var getId = require('./id').get;

var search = function(to, id, client, nick){
	var sep = '::'.irc.green();
	var response = sep;
	if(nick) {
		response += ' ' + nick;
	}
	response += ' (' + id + ') ' + sep + 
				' http://www.erepublik.com/en/citizen/profile/' + id +
				' ' + sep + 
				' http://www.egov4you.info/citizen/history/' + id + 
				' ' + sep;
	client.say(to, response);
};

function irc(from, to, param, client) {
	if(/^\d+$/.test(param.trim())) {
		search(to, param, client);
	} else {
		getId(param || from, function(id){
			if(id) {
				search(to, id, client, param || from);	
			}
		});		
	}
	return null;
}

function telegram(from, to, param, bot) {
	//TODO
}

module.exports = {
	irc : irc,
	telegram : telegram
};