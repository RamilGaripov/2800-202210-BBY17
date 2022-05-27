const gameTitle = "Video";

var randomMed = Math.floor(Math.random() * 10 + 1);

console.log(randomMed);

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

var yogaVideoId = "";

function onYouTubeIframeAPIReady() {

    switch (randomMed) {

        case 1:
            yogaVideoId = "FcXEZF6y5WQ";
            break;

        case 2:
            yogaVideoId = "8TuRYV71Rgo";
            break;

        case 3:
            yogaVideoId = "t3joHNOOyYY";
            break;

        case 4:
            yogaVideoId = "4pKly2JojMw";
            break;

        case 5:
            yogaVideoId = "xcMOYrdHrkE";
            break;

        case 6:
            yogaVideoId = "CmSDHoFR4a4";
            break;

        case 7:
            yogaVideoId = "mj2RGYpknzA";
            break;

        case 8:
            yogaVideoId = "4TQsfBYCyKQ";
            break;

        case 9:
            yogaVideoId = "X3-gKPNyrTA";
            break;

        case 10:
            yogaVideoId = "uQ2yJhF4zZY";
            break;
    }
    



    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: yogaVideoId,
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  sendDataToServer();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED && !done) {
        setTimeout(stopVideo, 6000);
        videoEnded();
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}

function videoEnded() {
    document.getElementById("homebtn").style.visibility = "visible";
    document.getElementById("winmessage").style.visibility = "visible";
    updateDataOnServer();
}

document.querySelector("#homebtn").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.replace("/main");
});

function sendDataToServer() {

    console.log("Starting to match...");
    const timeStamp = Date.now();
    console.log(timeStamp);
    const data = {
        title: gameTitle
    };
    fetch("/start-game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

function updateDataOnServer() {
    console.log("finished matching!");
    const data = {
        title: gameTitle
    };
    fetch("/finish-game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}