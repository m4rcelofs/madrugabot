# MadrugaBot


## Usage

* **MADRUGA_HOST**: the IRC host (default `'irc.rizon.net'`)

* **MADRUGA_PORT**: the IRC host port (default `6667`)

* **MADRUGA_LOCALPORT**: the localPort to use when connecting (default `50555`)

* **MADRUGA_USER**: the bot's username (default `'Madruga'`)

* **MADRUGA_PASS**: the bot's password (optional, nickserv registered nick only)

* **MADRUGA_CHANNELS**: a space separated list of channels to join when connecting (optional, '#chan1 #chan2 #chan3')

* **MADRUGA_DEBUG**: debug mode (default `false`)

* **MADRUGA_GOOGLE_API_KEY**: Google's [URL Shortener API](https://developers.google.com/url-shortener/v1/getting_started) key (optional, default `null`)

* **MADRUGA_FIREBASE_PASS**: Secret key from [FirebaseIO](https://firebase.com)

* **MADRUGA_IMPORTIO_API**: Complete [import.io](https://import.io) API url, with key

* **MADRUGA_TELEGRAM**: Telegram Bot Key (get from BotFather)


`docker run -d --name madruga --net=host marcelofs/madrugabot` 

## How to contribute?

#### Commands:

Send your pull request with a custom command:

	[./commands/{commandName}.js]
	function telegram(from, to, param, bot) {
		// do your stuff here, use bot.sendMessage() if you need async messages
		return 'synchronous message to be sent to channel';
	}

	function irc(from, to, param, client) {
		// do your stuff here, use client.say() if you need async messages 
		return 'synchronous message to be sent to channel';
	};

	module.exports = {
		irc : irc,
		telegram : telegram
	};	

Check `/commands` for examples.

#### Addons:

Send your pull request with an addon to the core (mostly for IRC stuff):

	[./addons/{addonName}.js]
	module.exports = function (client) {
		//client.addListener(...)
	};

or

    [./commands/{commandName}.js]
    var run = function (client) {};
    var otherFct = function() {};
    module.exports = {
      run: run,
      exportedFct: otherFct
    };

Check `/addons` for examples.