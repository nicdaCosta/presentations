//var moduleUsed = ( 'AudioContext' in window || 'webkitAudioContext' in window ) ? 'webAudioAPI' : 'audioTag';
var moduleUsed ='audioTag';

require.config({
	paths: {
		socketio : 'socketio.min',
		requestAnimationFrame : 'requestanimationframe'
	},
	map: {
		'soundEngine' : {
			'soundElement' : moduleUsed
		}
	},
	shim : {
		socketio : {
			exports : 'io'
		}
	}
});

require( [ 'soundEngine' , 'socketio' , 'requestAnimationFrame' ] , function( Conductor , io ) {

	'use strict'

	console.log( 'Oi...stop digging through the console and pay attention ;)' );

	// create new instance of sound Engine and other variable
	var socket = io.connect('http://10.11.13.148:8000'),
		objSettings = {

			url : 'sounds/soundSprite.mp3',
			spriteName : 'awesome',
			spriteMap : {},
			loadCallback : function() {
				socket.emit( 'loaded' , {} );
			}
		},
		side,
		soundEngine = new Conductor( objSettings ),
		areaStage = document.querySelector( '.stageContainer' ),
		areaWelcome = document.querySelector( '.welcomeContainer' ),
		areaWait = document.querySelector( '.waitingContainer' ),
		btnGetStarted = document.getElementById( 'btnWelcome' ),
		btn2 = document.querySelector( '.data' ),
		arrLateny = [];

	document.querySelector( 'h5 > span' ).textContent = moduleUsed;

	var selectSide = function( e ) {

		e.preventDefault();

		var srcElement = e.target || e.srcElement;

		if ( srcElement.tagName === 'BUTTON' ) {

			side = srcElement.getAttribute( 'data-side' );

			areaStage.removeEventListener( 'touchstart' , selectSide , false );
			areaStage.removeEventListener( 'MSPointerUp' , selectSide , false );
			areaStage.removeEventListener( 'click' , selectSide , false );

			areaWait.className = 'waitingContainer show animate';

			// not using classList due to certain android not supporting this. rather be safe than sorry as is a quick demo
			areaStage.className = 'stageContainer hidden';
			// fade in ready message , waiting to begin msg

		}

	};
	
	var handleWelcome = function( e ) {

		e.preventDefault();

		btnGetStarted.removeEventListener( 'touchstart' , handleWelcome , false );
		btnGetStarted.removeEventListener( 'MSPointerUp' , handleWelcome , false );
		btnGetStarted.removeEventListener( 'click' , handleWelcome , false );

		areaStage.className = 'stageContainer show animate';

		areaWelcome.className = 'welcomeContainer hidden';


	};

	var getMean = function( arrData ) {

		arrData.sort();

		if ( !arrData.length ) {

			return 0;

		}

		var half = Math.floor( arrData.length / 2 );
	 
			return ( ( arrData.length % 2 ) ? arrData[ half ] : ( arrData[ half-1 ] + arrData[ half ] ) / 2.0 ) / 1000;

	};

	// pushes anyw arnnings to server and thus to myself
	var warn = function( stack ) {

		var warnData = { stack : stack , ua : window.navigator.userAgent };

		sendData( 'warn' , warnData );

	};

	var sendData = function( eventName , data ) {

		socket.emit( eventName , data );

	};

	socket.on( 'playSound' , function( data ) {

		var _spriteName = data.spriteName,
			// add a small buffer if is HTML5 audio tag as is not as precise in playback
			_startTime = ( data.startTime * 1 ) + getMean( arrLateny ) + ( ( moduleUsed === 'audioTag' ) ? 0.1 : 0),
			_endTime = ( data.endTime * 1 );

		try {

			soundEngine.play( _spriteName , _startTime , _endTime );

		} catch( e ) {

			warn( e.stack );

		}

	} );

	socket.on( 'stopSound' , function( data ) {
		
		soundEngine.stop( data.spriteName );

	} );

	socket.on( 'message' , function( objTimes ) { 

		var	responseReceived = new Date().getTime(),
			serverTime,
			original,
			difference,
			latency;

		try {

			objTimes = JSON.parse( objTimes );

			serverTime = objTimes.server;
			original = objTimes.original;

			latency = Math.round( ( responseReceived - original ) * 0.5 );

			responseReceived -= latency;

			difference = responseReceived - serverTime;

		} catch( e ) {

		}

		arrLateny.push( latency );

	} );

	// this is to track the latency of the device
	var intervalID = window.setInterval( function() {

		sendData( 'ping' , new Date().getTime() );

	} , 2500 );

	areaStage.addEventListener( 'touchstart' , selectSide , false );
	areaStage.addEventListener( 'MSPointerUp' , selectSide , false );
	areaStage.addEventListener( 'click' , selectSide , false );
	
	btnGetStarted.addEventListener( 'touchstart' , handleWelcome , false );
	btnGetStarted.addEventListener( 'MSPointerUp' , handleWelcome , false );
	btnGetStarted.addEventListener( 'click' , handleWelcome , false );

	// send through which module the device is using. Will also act as the number of people connected
	sendData( 'userConnected' , moduleUsed );

} );