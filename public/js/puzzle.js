/**
 * Javascript for Puzzle Application
 * 
 * @author Crypters Infotech
 * @see https://www.youtube.com/watch?v=6mgsMcOwfoE
 */


// defines the name of the game
const gameTitle = "Puzzle";

// run when document is loaded
$(document).ready(function () {

    // picks random number for the choosing of 10 images
    var randompuz = Math.floor(Math.random() * 10 + 1);

    sendDataToServer();
    var pieces = createPieces(true);
    $("#puzzlecontainer").html(pieces);

    // listens for when start button is clicked
    $("#btnstart").click(function () {
        var pieces = $("#puzzlecontainer div");

        // randomly scrambles pieces into container
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

        // shows the reset button
        $("#btnreset").show();

        // hides the back button
        $("#btnback").hide();
        implementLogic();
    });

    // listens for when the reset button is clicked
    $("#btnreset").click(function () {
        var newPieces = createPieces(true);
        $("#puzzlecontainer").html(newPieces);
        $(this).hide();

        // shows start button
        $("#btnstart").show();

        // hides back button
        $("#btnback").hide();

        // hides winning message
        $("#winmessage").hide();

        // hides lossing message
        $("#lossmessage").hide();

        // reset the pieces container
        $("#piececontainer").empty();
    });

    // picks the images and insets it into the game
    function createPieces(withImage) {
        var pieces = "";
        var rows = 4, 
            columns = 4;  

        // defines variable that will act as the class name for the pieces
        var classname = "";

        // recives random number and assigns classname
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

        // creates 16 pieces will all unique background positioning, which makes up the whole image
        for (var i = 0, top = 0, order = 0; i < rows; i++, top -= 100) {
            for (var j = 0, left = 0; j < columns; j++, left -= 100, order++) {

                // inserts html for pieces
                if (withImage) {
                    pieces += "<div style='background-position:" + left + "px " + top + "px;' class='piece " + classname + "' data-order=" + order + "></div>";
                } else {
                    pieces += "<div style='background-image: none;' class='piece " + classname + " droppablespace'></div>";
                }

            }
        }
        return pieces;

    }

    // checks if the puzzle is solved or not
    function checkIfPuzzleSolved() {

        // checks if all 16 pieces are placed
        if ($("#puzzlecontainer .droppedPiece").length != 16) {
            return false;
        }
        for (var k = 0; k < 16; k++) {
            var item = $("#puzzlecontainer .droppedPiece:eq(" + k + ")");
            var order = item.data("order");
            if (k != order) {
                $("#lossmessage").show();
                $("#btnreset").show();
                $("#piececontainer").text("Oops, please try again.");
                return false; /* loss */
            } else {
                $("#piececontainer").text("Congrats! You won 25 reward points!");
                $("#winmessage").show();
                $("#btnreset").hide();
                $("#btnback").show();
                updateDataOnServer();
                return true; /* win */
            }
        }
    }

    // applys the use of jquery ui with draggable and droppable
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


// contacts the database that the game has been started
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

// contacts the database that the game has been complete
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

// redirect back to the home page
document.querySelector("#btnback").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.replace("/main");
});

// displays pop up when rules button is clicked
document.getElementById("puzzleHelp").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Rules");
    Swal.fire(
        'Complete the picture!',
        "Drag the tiles in the left frame into the right!",
        'info',
        
    )
}) 