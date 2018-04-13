// some var
var player;
var timeoutMillsec = 0;
var timer;
var stopTime = -1; 
var startTime = -1;
var subClicked = false;
var v_id;
var url

// get video id
url = window.location.href;
url = url.replace('#', '');

for (var i = url.length, ref = url.length; i >= 0; i = i - 1) {
  if (url[i] == '/') {
      v_id = url.substring(i + 1, ref-5);
      break;
  }
}

// load video's subtitles
var subtitleName = "_" + v_id;
console.log(subtitleName);
var content = window[subtitleName];

$(window).on('load', function() {
    content.forEach(function(element, index) {
        $("#subtitle_block").append("<a id='" + index + "'' class='subtitle' href='#' >" + element["text"] + "</a><br>");
    });
});

// initial youtube iframe api
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: v_id,
    events: {
      //'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && subClicked == true) {
    //debugger;
    clearTimeout(timer);
    var currentTime = player.getCurrentTime();
    if(stopTime>currentTime*1000){
      timeoutMillsec = stopTime - currentTime*1000; 
      timer = setTimeout(pauseVideo, timeoutMillsec);
    }
  }
}

// listen if subtitle is clicked
$(document).on('click', '.subtitle', function() {
  startTime = content[this.id]["start_time"]
  stopTime = content[this.id]["end_time"]
  console.log("starttime: " + startTime);
  console.log("stoptime: " + stopTime);
  subClicked = true;
  clearTimeout(timer);
  player.pauseVideo();
  player.seekTo(startTime/1000);
  player.playVideo();
});

// pause video
function pauseVideo() {
  player.pauseVideo();
}