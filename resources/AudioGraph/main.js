( function () {
  /* Speed has to be bigger then refresh!! */
  // Speed to move from right to left, the visible amount of time on the x axis (in milliseconds)
  var speed = 20000;
  // Time in milliseconds to redraw chart
  var refresh = 40;
  // Without var to make it a global variable accessable by the html onclick attribute
  audioElement = document.getElementById( 'audioElement');
  var audioCtx = new window.AudioContext();
  var audioSrc = audioCtx.createMediaElementSource( audioElement );
  var analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.connect( analyser );
  audioSrc.connect( audioCtx.destination );
  //Get frequency data (800 = max frequency)
  var frequencyData = new Uint8Array( analyser.frequencyBinCount );
  //Use below to show all frequencies
  //The animation reference
  var animation;
  //Create chart
  var dps = []; // dataPoints
  var chart = new CanvasJS.Chart( "chart", {
    interactivityEnabled: false,
    width: 700,
    height: 500,
    axisX: {
      title: "Time",
      valueFormatString: "mm:ss"
    },
    axisY: {
      title: "dB"
    },
    data: [ {
      type: "line",
      dataPoints: dps
		} ]
  } );
  chart.render();
  //On play
  audioElement.onplay = function () {
    //Start drawing
    animation = setInterval( function () {
      drawWave();
    }, refresh );
  };
  //On pause
  audioElement.onpause = function () {
    //Stop drawing
    clearInterval( animation );
  };
  //On ended
  audioElement.onended = function () {
    //Stop drawing
    clearInterval( animation );
    //Reset time
    time = 0;
    //Reset dataPoints
    dps = [];
    //Prevent audio from looping (you can remove this if you want it to loop)
    audioElement.pause();
  };
  //Max dB
  var max = analyser.maxDecibels;
  //Min dB
  var min = analyser.minDecibels;
  //Time
  var time = 0;
  //Our drawing method
  function drawWave() {
    // Copy frequency data to frequencyData array.
    analyser.getByteFrequencyData( frequencyData );
    //Total loudness of all frequencies in frequencyData
    var totalLoudness = 0;
    for ( var i = 0; i < frequencyData.length; i++ ) {
      totalLoudness += frequencyData[ i ];
    }
    //Average loudness of all frequencies in frequencyData on scale from 0 to 255
    var averageLoudness = totalLoudness / frequencyData.length / 255;
    //Decibels
    var decibels = min + averageLoudness * Math.abs( min - max );
    //Increase time
    time += refresh;
    //Add to chart
    dps.push( {
      x: new Date( time ),
      y: decibels
    } );
    //Maximum x values to draw based on speed ad refresh
    if ( dps.length > speed / refresh ) {
      dps.shift();
    }
    //Draw new chart
    chart.render();
  }
} )();
