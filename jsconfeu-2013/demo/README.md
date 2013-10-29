# Soundsync

demo for JSConf EU 2013

## Getting Started
Pull down code and run ```node install``` to pull down node packages. These weren't included due to certain issues with github pages failing to build

Once all the necessary packages have been installed, you will need to obtain your machine's IP address. This will be used for the socket connection and will need to be updated in both `composer.js` and `main.js`

Once these have been updated, run

```node app.js```

This will start the server on port 8080. Clients that you wish to play the sound on can go to your IP address with port 8080 in their browser with the master machine accessing `/conductor` to control the sounds.

_eg:_

_Mobile device_ - [http://182.168.1.20:8080](http://182.168.1.20:8080)  
_Host Computer_ - [http://localhost:8080/conductor](http://localhost:8080/conductor)