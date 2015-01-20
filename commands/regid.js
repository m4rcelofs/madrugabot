var Firebase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");
var NodeCache = require('node-cache');

var id;
var nick;
var client;
var channel;

module.exports = function (from, to, param, c) {
	if(!param || !/\d+/.test(param)) {
		client.say(to, from + ', pfv digite ".regid id do erepublik"');
		return; 
	}
	
	id = parseInt(param, 10);
    nick = from;
    client = c;
    channel = to;
    	
	client.once('notice', onNickServStatus);
    client.say('nickserv', 'STATUS ' + nick);
	return null;
};

var onNickServStatus = function(from, to, text, message) {
	if('NickServ' !== from || (('STATUS ' + nick + ' 3') !== text)) {
		client.say(channel, nick + ', por favor registre seu nick na Rizon primeiro');
		return;
	}
	var db = new Firebase("https://madruga.firebaseio.com/users");
	doAuth(db, function(error){ onDBAuth(db, error); });
};

var doAuth = function(db, callback) {
	var pass = process.env.MADRUGA_FIREBASE_PASS;
	if(!pass) {
		callback('MADRUGA_FIREBASE_PASS not found');
		return;
	}
	var auth = new FirebaseTokenGenerator(pass).createToken({uid: 'madruga'});
	db.authWithCustomToken(auth, callback);
};

var onDBAuth = function(db, error) {
   	if(error) {
   		client.say(channel, 'Não foi possível salvar ' + nick + ' como ' + id + ' ):');
   		console.log('Erro na autenticação com o FirebaseIO', error);
   		return;
   	}
   	db.child(nick).update({
    	id : id
    }, onSave);
};

var cache = new NodeCache();
var onSave = function(error) {
	if(error) {
		client.say(channel, 'Não foi possível salvar ' + nick + ' como ' + id + ' ):');
		console.log(error);
		return;
	} 
	cache.set('ID.' + nick, id);
	client.say(channel, id + ' registrado como ' + nick);
};