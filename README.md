# MadrugaBot


## Usage

* **MADRUGA_HOST**: the IRC host

* **MADRUGA_USER**: the bot's username

* **MADRUGA_PASS**: the bot's password

* **MADRUGA_CHANNELS**: a space separated list of channels to join when connecting ('#chan1 #chan2 #chan3')


`docker run -d --name madruga -e MADRUGA_USER=YourUsername MADRUGA_PASS=YourPass -e MADRUGA_CHANNELS="#channel"` 