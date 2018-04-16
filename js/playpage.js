// some var
var player;
var timeoutMillsec = 0;
var timer;
var stopTime = -1;
var startTime = -1;
var subClicked = false;
var v_id;
var s_id = -1; // colored sub id
var url;
var repeat = false;

// get video id
url = window.location.href;
url = url.replace('#', '');

for (var i = url.length, ref = url.length; i >= 0; i = i - 1) {
  if (url[i] == '/') {
    v_id = url.substring(i + 1, ref - 5);
    break;
  }
}

// load video's subtitles
var subtitleName = "_" + v_id;
// console.log(subtitleName);
var content = window[subtitleName];

$(window).on('load', function () {
  content.forEach(function (element, index) {
    $("#subtitle_block").append("<tr><td>" + "<a id='" + index + "'' class='subtitle' href='#' >" + "<i class='far fa-play-circle fa-lg'></i>" + "</a></td>" + "<td><a id='" + index + "'' class='subtitle' href='#' ><span id='subtitle_text_" + index + "' >" + element["text"] + "</span></a></td></tr>");
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
  clearTimeout(timer);
  if (event.data == YT.PlayerState.PLAYING) {
    var currentTime = player.getCurrentTime();
    if (currentTime * 1000 >= startTime && currentTime * 1000 <= stopTime) {
      timeoutMillsec = stopTime - currentTime * 1000;
      if (subClicked) {
        if (repeat) {
          timer = setTimeout(repeatVideo, timeoutMillsec);
        } else {
          timer = setTimeout(pauseVideo, timeoutMillsec);
        }
      }
    }else{
      subClicked = false;
      id = whichSub(currentTime * 1000);
      stopTime = content[id]["end_time"];
      timeoutMillsec = stopTime - currentTime * 1000;
      colorSub(id);
      scrollSub(id);
      timer = setTimeout(function() {sequenceSub(id+1);}, timeoutMillsec);
    }
  }
}

// listen if subtitle is clicked
$(document).on('click', '.subtitle', function () {
  startTime = content[this.id]["start_time"]
  stopTime = content[this.id]["end_time"]
  subClicked = true;
  colorSub(this.id);
  scrollSub(this.id);
  clearTimeout(timer);
  player.pauseVideo();
  player.seekTo(startTime / 1000);
  player.playVideo();
});

// handle subtitle's color
function colorSub(new_id) {
  if (s_id != -1) {
    $("#subtitle_text_" + s_id).css("background-color", "");
  }
  $("#subtitle_text_" + new_id).css("background-color", "#ccc");
  s_id = new_id;
}

// pause video
function pauseVideo() {
  player.pauseVideo();
  subClicked = false;
}

// repeat video
function repeatVideo() {
  player.pauseVideo();
  player.seekTo(startTime / 1000);
  player.playVideo();
}

// find sub id by time
function whichSub(currentTime) {
  var time = 0;
  var id = 0;
  while (time < currentTime) {
    time = content[id]["end_time"];
    id += 1;
  }
  id -= 1;
  return id
}

// sequency change sub color by time
function sequenceSub(id) {
  startTime = content[id]["start_time"];
  stopTime = content[id]["end_time"];
  timeoutMillsec = stopTime - startTime;
  colorSub(id);
  scrollSub(id);
  timer = setTimeout(function() {sequenceSub(id+1);}, timeoutMillsec);
}

// scroll sub to top
function scrollSub(id){
  var topPos = document.getElementById(id).parentNode.parentNode.offsetTop;
  $(".panel").animate({
    scrollTop : topPos
  },250)
}