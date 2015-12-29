var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var NodeCache = require('node-cache');

var db = new Firebase('https://madruga.firebaseio.com/users');

var tokenize = function(nick) {
	return nick.toLowerCase().replace(/[\.#$\[\]]/, '');
};

var cache = new NodeCache();
var get = function(nick, callback) {
	//cache.get('key') returns { "key": value }
	var key = 'ID.' + tokenize(nick);
	var cached = cache.get(key)[key]; 
	if(cached) {
		callback(cached);	
	} else {
		db.child(tokenize(nick) + '/id').once("value", 
		   function(data) {
		 	 cache.set(key, data.val());
		 	 callback(data.val());
		}, function(error){
			 console.log(error);
			 callback(error);
		});
	}
};

var doAuth = function(callback) {
	var pass = process.env.MADRUGA_FIREBASE_PASS;
	if(!pass) { console.log('MADRUGA_FIREBASE_PASS not set'); }
	var token= new FirebaseTokenGenerator(pass).createToken({uid: 'madruga'});
	db.authWithCustomToken(token, function(error, authData){
		if(error) {
			console.log('Erro na autenticação com o FirebaseIO', error);
		}
		if(callback) {
			callback(error);
		}
	});	
};

var checkAuth = function(callback) {
	var auth = db.getAuth();
	if(auth) {
		callback();
	} else {
		doAuth(callback);
	}
};

var set = function(nick, idObj, callback) {
	if(!callback) { callback = function(){}; }
	checkAuth(function(authError) {
		if(authError) {
			callback(authError);
		} else {
			idObj.original = nick;
			db.child(tokenize(nick)).update(idObj, function(error) {
		    	if(error) {
		    		console.log(error);
		    		callback(error);
		    		return;
		    	} 
		    	cache.set('ID.' + tokenize(nick), idObj.id);
		    	callback();
		    });			
		}
	});
};

var irc = function(from, to, param, client) {
	param = param || from;
	get(param, function(id){
		if(id) {
			client.say(to, 'O nick ' + param + ' registrou a ID ' + id);
		} else {
			client.say(to, 'Não há ID registrada para o nick ' + param);
		}
	});
};

var telegram = function(from, to, param, bot) {
	//TODO
};

module.exports = {
	irc : irc,
	telegram : telegram,
	get : get,
	set : set
};