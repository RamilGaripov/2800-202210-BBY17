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

var medVideoId = "";

function onYouTubeIframeAPIReady() {

    switch (randomMed) {

        case 1:
            medVideoId = "aEqlQvczMJQ";
            break;

        case 2:
            medVideoId = "tC6PzcgK370";
            break;

        case 3:
            medVideoId = "ez3GgRqhNvA";
            break;

        case 4:
            medVideoId = "ZgPHetPG4MY";
            break;

        case 5:
            medVideoId = "OccjH_2ddQc";
            break;

        case 6:
            medVideoId = "5itkfGLcb5E";
            break;

        case 7:
            medVideoId = "vj0JDwQLof4";
            break;

        case 8:
            medVideoId = "z6X5oEIg6Ak";
            break;

        case 9:
            medVideoId = "tuiQxBB67wI";
            break;

        case 10:
            medVideoId = "uTN29kj7e-w";
            break;
    }
    



    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: medVideoId,
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
    })
}