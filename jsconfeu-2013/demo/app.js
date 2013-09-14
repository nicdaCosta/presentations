var express = require( 'express' ),
	port = 8000,
	soundServer = express(),
	io = require( 'socket.io' ).listen( soundServer.listen( port ) ),
    numberUsers = { total : 0 , usingWebAudio : 0 , usingHTMLAudio : 0 , totalLoaded : 0 };


soundServer.use( express.static( __dirname + '/src' ) );

soundServer.get( "/" , function( req , res ) {
	
	res.sendfile(__dirname + '/src/index.html');

} );

soundServer.get( "/conductor" , function( req , res ) {
    
    res.sendfile(__dirname + '/src/conductor.html');

} );

io.sockets.on( 'connection' , function ( socket ) {

    socket.on( 'play' , function ( data ) {
    
        io.sockets.emit( 'playSound' , data );
    
    });

    socket.on( 'userConnected' , function ( data ) {

        numberUsers.total++;

        if ( data === 'webAudioAPI' ) {

            numberUsers.usingWebAudio++;

        } else {

            numberUsers.usingHTMLAudio++;

        }
    
        io.sockets.emit( 'newUser' , numberUsers );
    
    });

    socket.on( 'warn' , function ( data ) {
    
        io.sockets.emit( 'warning' , data );
    
    });

    socket.on( 'stop' , function ( data ) {
    
        io.sockets.emit( 'stopSound' , data );
    
    });

     socket.on( 'loaded' , function ( data ) {

        numberUsers.totalLoaded++;
    
        io.sockets.emit( 'update' , numberUsers );
    
    });

    socket.on( 'ping' , function( originalTime ) {

       	var timeStamp = new Date().getTime();
    	socket.send( JSON.stringify( { server : timeStamp , original : originalTime } ) );
    
    } );

});

