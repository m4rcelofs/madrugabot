var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');

var db = new Firebase('https://madruga.firebaseio.com');

var doAuth = function(callback) {
	var pass = process.env.MADRUGA_FIREBASE_PASS;
	if(!pass) { console.log('MADRUGA_FIREBASE_PASS not set'); }
	var token= new FirebaseTokenGenerator(pass).createToken({uid: 'madruga'});
	db.authWithCustomToken(token, function(error, authData){
		if(error) {
			console.log('Erro na autenticação com o FirebaseIO', error);
		} else {
			console.log('Autenticado no FirebaseIO');
		}
		if(callback) {
			callback(error);
		}
	});	
};
doAuth();

var checkAuth = function(callback) {
	var auth = db.getAuth();
	if(auth) {
		callback();
	} else {
		doAuth(callback);
	}
};
db.onAuth(function(data){
	checkAuth();
});

var update = function(path, obj, callback) {
	if(!callback) { callback = function(){}; }
	checkAuth(function(authError) {
		if(authError) {
			callback(authError);
		} else {
			db.child(path).update(obj, function(error) {
		    	if(error) {
		    		console.log(error);
		    		callback(error);
		    		return;
		    	} 
		    	callback();
		    });			
		}
	});
};

module.exports = {
	db: db,
	update: update,
	run: function(){}
};