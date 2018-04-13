var url = window.location.href;
url.replace('#', '');
var id;
//get url id
for (var i = url.length, ref = url.length; i >= 0; i = i - 1) {
    if (url[i] == '/') {
        id = url.substring(i + 1, ref - 6);
        break;
    }
}


var subtitleName = "_"+id;
console.log(subtitleName);
var content = window[subtitleName];

$(window).on('load', function() {
    var contentSize = content.length;
    content.slice(1, contentSize).forEach(function(element, index) {
        var link = $(document.createElement('a'));
        $("#subtitle_block").append("<a id='" + index + "'' class='subtitle' href='#' >" + element["text"] + "</a>");
    });
});

var tag = document.createElement('script');
var stopTime = -1; // -1 means no need to stop
var startTime = -1;
var repeat = false;
var HR_TIME = 3600,
    MIN_TIME = 60;
var timeOut;
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var timeout = 0;

$(document).on('click', '.subtitle', function() {
    var startTimeReformat = (content[this.id]["start_time"]).replace(',', '');
    var length = startTimeReformat.length;
    var startHr = parseInt(startTimeReformat.substring(0, 2), 10);
    var startMin = parseInt(startTimeReformat.substring(3, 5), 10);
    var startSec = parseInt(startTimeReformat.substring(6, length), 10);
    startTime = startHr * HR_TIME + startMin * MIN_TIME + startSec / 1000;
    console.log("starttime: " + startTime);
    player.seekTo((startHr * HR_TIME + startMin * MIN_TIME + startSec / 1000));
    player.playVideo();
    var endTimeReformat = (content[this.id]["end_time"]).replace(',', '');
    var length = endTimeReformat.length;
    var endHr = parseInt(endTimeReformat.substring(0, 2), 10);
    var endMin = parseInt(endTimeReformat.substring(3, 5), 10);
    var endSec = parseInt(endTimeReformat.substring(6, length), 10);
    stopTime = (endHr * HR_TIME + endMin * MIN_TIME + endSec / 1000);
    console.log("stoptime: " + stopTime);
    //if state == pause not need to set timer

    timeout = setTimeout(checkIfStop, (parseFloat(stopTime) - parseFloat(startTime)) * 1000);

});

function checkIfStop() {
    if (stopTime != -1) {
        var currentTime = player.getCurrentTime();

        console.log("currentTime: " + currentTime);
        //console.log("stopTime: " + stopTime);
        //console.log("result: " + (parseFloat(currentTime) >= parseFloat(stopTime)));
        if ((parseFloat(currentTime) >= parseFloat(stopTime))) {
            if (repeat) {
                console.log("in repeat");
                player.seekTo(startTime);
                player.playVideo();
                timeout = setTimeout(checkIfStop, (parseFloat(stopTime) - parseFloat(startTime)) * 1000);
            } else {
                player.pauseVideo();
                stopTime = -1;
            }

      }  /* else {

            timeout = setTimeout(checkIfStop, (parseFloat(stopTime) - parseFloat(currentTime)) * 1000);

        }*/

    }
}


function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: id,
        events: {
            //'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.PLAYING) {
        if (stopTime > -1) {
            timeout = setTimeout(checkIfStop, (parseFloat(stopTime) - parseFloat(currentTime)) * 1000);
        }
    }
}

$(window).on('load', function() {
    jQuery('#test').click(function() {
        console.log('test');
        console.log(player);
        player.pauseVideo();
        player.seekTo(25);
        timeout = 10000;
        player.playVideo();
        return false;
    });
});

$(window).on('load', function() {
    jQuery('#test2').click(function() {
        console.log('test2');
        console.log(player);
        player.pauseVideo();
        player.seekTo(35);
        //debugger;
        timeout = 10000;
        player.playVideo();
        return false;
    });
});

function pauseVideo() {
    player.pauseVideo();
}