$(document).ready(function () {

    // console.log(pieces);
    var pieces = createPieces(true);
    $("#puzzlecontainer").html(pieces);


    $("#btnstart").click(function () {
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
        implementLogic();
    });
    $("#btnreset").click(function () {
        var newPieces = createPieces(true);
        $("#puzzlecontainer").html(newPieces);
        $(this).hide();
        $("#btnstart").show();
        $("#piececontainer").empty();
    });

    function createPieces(withImage) {
        var pieces = "";
        var rows = 4,
            columns = 4;
        for (var i = 0, top = 0, order = 0; i < rows; i++, top -= 100) {
            for (var j = 0, left = 0; j < columns; j++, left -= 100, order++) {

                if (withImage) {
                    pieces += "<div style='background-position:" + left + "px " + top + "px;' class='piece' data-order=" + order + "></div>";
                } else {
                    pieces += "<div style='background-image: none;' class='piece droppablespace'></div>";
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
                $("#piececontainer").text("Ouch! Try Again!");
                return false; /* loss */
            } else {
                $("#piececontainer").text("wow! you are a GENIUS");
                return true; /* win */
            }
        }
        // $("#piececontainer").text("wow! you are a GENIUS");
        // return true; /* win */
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