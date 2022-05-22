/**
 * Javascript for Puzzle Application
 * 
 * @author Crypters Infotech
 * @see https://www.youtube.com/watch?v=6mgsMcOwfoE
 */

const gameTitle = "Puzzle";

$(document).ready(function () {

    var randompuz = Math.floor(Math.random() * 10 + 1);

    sendDataToServer();
    // console.log(pieces);
    var pieces = createPieces(true);
    $("#puzzlecontainer").html(pieces);


    $("#btnstart").click(function () {
        // sendDataToServer();
        var pieces = $("#puzzlecontainer div");
        pieces.each(function () {
            var leftposition = Math.floor(Math.random() * 290) + "px";
            var topposition = Math.floor(Math.random() * 290) + "px";
            $(this).addClass("draggablepiece").css({
                position: "absolute",
                left: leftposition,
                top: topposition
            })
            $("#piececontainer").append($(this));
        });
        var emptystring = createPieces(false);
        $("#puzzlecontainer").html(emptystring);
        $(this).hide();
        $("#btnreset").show();
        $("#btnback").hide();
        implementLogic();
    });
    $("#btnreset").click(function () {
        var newPieces = createPieces(true);
        $("#puzzlecontainer").html(newPieces);
        $(this).hide();
        $("#btnstart").show();
        $("#btnback").hide();
        $("#winmessage").hide();
        $("#lossmessage").hide();
        $("#piececontainer").empty();
    });

    function createPieces(withImage) {
        var pieces = "";
        var rows = 4, columns = 4;  

        var classname = "";

        switch (randompuz) {
            case 1:
                classname = "puz1";
                isChanged = 1;
                break;

            case 2:
                classname = "puz2";
                isChanged = 1;
                break;

            case 3:
                classname = "puz3";
                isChanged = 1;
                break;

            case 4:
                classname = "puz4";
                isChanged = 1;
                break;

            case 5:
                classname = "puz5";
                isChanged = 1;
                break;

            case 6:
                classname = "puz6";
                isChanged = 1;
                break;

            case 7:
                classname = "puz7";
                isChanged = 1;
                break;

            case 8:
                classname = "puz8";
                isChanged = 1;
                break;

            case 9:
                classname = "puz9";
                isChanged = 1;
                break;

            case 10:
                classname = "puz10";
                isChanged = 1;
                break;
        }



        for (var i = 0, top = 0, order = 0; i < rows; i++, top -= 100) {
            for (var j = 0, left = 0; j < columns; j++, left -= 100, order++) {

                if (withImage) {
                    pieces += "<div style='background-position:" + left + "px " + top + "px;' class='piece " + classname + "' data-order=" + order + "></div>";
                } else {
                    pieces += "<div style='background-image: none;' class='piece " + classname + " droppablespace'></div>";
                }

            }
        }
        return pieces;

    }

    function checkIfPuzzleSolved() {
        if ($("#puzzlecontainer .droppedPiece").length != 16) {
            return false;
        }
        for (var k = 0; k < 16; k++) {
            var item = $("#puzzlecontainer .droppedPiece:eq(" + k + ")");
            var order = item.data("order");
            if (k != order) {
                $("#lossmessage").show();      
                // $("#piececontainer").text("Oops, thats incorrect.");

                return false; /* loss */
            } else {
                // $("#piececontainer").text("Congrats! You won 25 reward points!");
                $("#winmessage").show();
                $("#btnreset").hide();
                $("#btnback").show();
                updateDataOnServer();
                return true; /* win */
            }
        }
    }

    function implementLogic() {
        $(".draggablepiece").draggable({
            revert: "invalid",
            start: function () {
                if ($(this).hasClass("droppedPiece")) {
                    $(this).removeClass("droppedPiece");
                    $(this).parent().removeClass("piecePresent");
                }
            }
        });
        $(".droppablespace").droppable({
            hoverClass: "ui-state-highlight",
            accept: function () {
                return !$(this).hasClass("piecePresent")
            },

            drop: function (event, ui) {
                var draggableElement = ui.draggable;
                var droppedOn = $(this);
                droppedOn.addClass("piecePresent");
                $(draggableElement).addClass("droppedPiece").css({
                    top: 0,
                    left: 0,
                    position: "relative"
                }).appendTo(droppedOn);
                checkIfPuzzleSolved();
            }
        });
    }
});

function sendDataToServer() {

    console.log("Starting to match...");
    const timeStamp = Date.now(); 
    console.log(timeStamp);
    const data = {title: gameTitle};
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
    const data = {title: gameTitle};
    fetch("/finish-game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
}

document.querySelector("#btnback").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.replace("/main");
});

// function pickPuzzle() {
    
//     const images = [
//         'url("/img/puzzle/1.jpg")',
//         'url("/img/puzzle/2.jpg")',
//         'url("/img/puzzle/3.jpg")',
//         'url("/img/puzzle/4.jpg")',
//         'url("/img/puzzle/5.jpg")',
//         'url("/img/puzzle/6.jpg")',
//         'url("/img/puzzle/7.jpg")',
//         'url("/img/puzzle/8.jpg")',
//         'url("/img/puzzle/9.jpg")',
//         'url("/img/puzzle/10.jpg")'
//     ];

//     const bg = images[Math.floor(Math.random() * 
//     images.length)];

//     const piecesection = document.querySelectorAll(".piece");
   
    // const piecesection = document.getElementsByClassName("piece")[0];

    // const piecesection = document.getElementById("piecepart");


    // const piecesection = document.getElementsByClassName("piece")[p];

    // console.log(piecesection);


    // console.log(bg);

    // piecesection.style.backgroundImage = bg;

    // document.getElementsByClassName("piece").style.backgroundImage = bg;
    
    // piecesection.style.backgroundImage = bg;

    // piecesection.setAttribute("src", bg); 
// }