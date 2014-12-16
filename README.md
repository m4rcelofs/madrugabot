# MadrugaBot


## Usage

* **MADRUGA_HOST**: the IRC host (default 'irc.rizon.net')

* **MADRUGA_PORT**: the IRC host port (default 6667)

* **MADRUGA_USER**: the bot's username (default 'Madruga')

* **MADRUGA_PASS**: the bot's password (optional, nickserv registered nick only)

* **MADRUGA_CHANNELS**: a space separated list of channels to join when connecting (optional, '#chan1 #chan2 #chan3')

* **MADRUGA_DEBUG**: debug mode (default false)


`docker run -d --name madruga marcelofs/madrugabot` 