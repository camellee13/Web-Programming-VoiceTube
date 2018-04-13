


var url = window.location.href;
console.log(url); 
var id;
//get url id
for(var i = url.length, ref = url.length; i >=0 ; i = i -1){
    if(url[i] == '/'){
        id = parseInt(url.substring(i+1, ref));
        break;
    }
}
var subtitlePath = "./js/"+id+".js";
console.log(subtitlePath);
$.getScript(subtitlePath, function() {
    content.forEach(function(element, index) {
    var link = $(document.createElement('a'));
    $("#subtitle_block").append("<a id='" + index + "'' class='subtitle' href='#' >" + element["text"] + "</a>");
});
});
var id = url.substring()
var tag = document.createElement('script');
var stopTime = -1; // -1 means no need to stop
var startTime = -1;
var time
var repeat = true;
var HR_TIME = 3600,
    MIN_TIME = 60;
var timeOut;
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var timeout = 0;



$(".subtitle").click(
    function() {
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
        } else {

            timeout = setTimeout(checkIfStop, (parseFloat(stopTime) - parseFloat(currentTime)) * 1000);

        }
    }
}


function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '8Jg3ZNJJRqU',
        events: {
            //'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.PLAYING) {
        if (event.data == YT.PlayerState.PLAYING && timeout > 0) {
            if (stopTime > -1) {
                timeout = setTimeout(checkIfStop, (parseFloat(stopTime) - parseFloat(currentTime)) * 1000);
            }
            //debugger;
            //        setTimeout(pauseVideo, timeout);
            //        timeout = 0;
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
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