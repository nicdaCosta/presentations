
require.config({
	baseUrl: "js",
	paths: {
		socketio : 'socketio.min'
	},
	shim : {
		socketio : {
			exports : 'io'
		}
	}
});

require( [ 'utils' , "socketio" ] , function( utils , io ) {

	'use strict';

	var socket = io.connect('http://10.11.13.148:8000');

	var btnPlay = document.getElementById( 'play' ),
		btnStop = document.getElementById( 'stop' ),
		noUsers = document.getElementById( 'noUsers' ),
		noLoaded = document.getElementById( 'noSounds' ),
		noWebAudio = document.getElementById( 'noWebAudio' ),
		noHTML5 = document.getElementById( 'noHTML5' );

	var handlePlay = function( e ) {

		e.preventDefault();

		var startTime = document.getElementById( 'startTime' ).value,
			endTime = document.getElementById( 'endTime' ).value;

		sendCommand( 'play' , { spriteName: 'awesome' , startTime : startTime , endTime : endTime } );

	};

	var handleStop = function( e ) {

		e.preventDefault();

		sendCommand( 'stop' , { spriteName : 'awesome' } );

	};

	var sendCommand = function( eventName , data ) {

		socket.emit( eventName , data );

	};		

	btnPlay.addEventListener( 'touchstart' , handlePlay , false );
	btnPlay.addEventListener( 'click' , handlePlay , false );
	
	btnStop.addEventListener( 'touchstart' , handleStop , false );
	btnStop.addEventListener( 'click' , handleStop , false );

	socket.on( 'update' , function( data ) {

		noLoaded = document.getElementById( 'noSounds' );

		noLoaded.textContent = data.totalLoaded;

	} );

	socket.on( 'newUser' , function( data ) {

		noUsers.textContent = data.total;
		noWebAudio.textContent = data.usingWebAudio;
		noHTML5.textContent = data.usingHTMLAudio;

	} );

} );