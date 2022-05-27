console.log("Connected to Sudoku.js!");
const gameTitle = "Sudoku";

var numSelected = null;
var tileSelected = null;

var errors = 0;
var correct = 0;

// Board Array

var board = [
  "--74916-5",
  "2---6-3-9",
  "-----7-1-",
  "-586----4",
  "--3----9-",
  "--62--187",
  "9-4-7---2",
  "67-83----",
  "81--45---",
];

// Solution board

var solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763",
];

window.onload = function () {
  setGame();
};

// Starts the game and sends to server

function sendDataToServer() {
  console.log("Starting to match...");
  const timeStamp = Date.now();
  console.log(timeStamp);
  const data = { title: gameTitle };
  fetch("/start-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Sends finished game information to database

function updateDataOnServer() {
  console.log("finished matching!");
  const data = { title: gameTitle };
  fetch("/finish-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Create board and give each grid space a event listener

function setGame() {
  sendDataToServer();
  for (let i = 1; i <= 9; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("digits").appendChild(number);
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      if (board[r][c] != "-") {
        tile.innerText = board[r][c];
        tile.classList.add("tile-start");
      }
      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }
      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }
      tile.addEventListener("click", selectTile);
      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }
}

// Adds / Remove number from slot

function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }

  numSelected = this;
  numSelected.classList.add("number-selected");
}

// Select a tile

function selectTile() {
  if (numSelected) {
    if (this.innerText != "") {
      return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (solution[r][c] == numSelected.id) {
      this.innerText = numSelected.id;
      correct++;
    } else {
      errors += 1;
      document.getElementById("errors").innerText = errors;
    }

    // if the ammount of correct guesses you get match the empty spaces you win

    if (correct == 46) {
      Swal.fire({
        title: "Congratulations",
        text: "You won!!",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      updateDataOnServer();
    }
  }
}


document.getElementById("sudokuHelp").addEventListener("click", function(e) {
  e.preventDefault();
  console.log("Rules");
  Swal.fire(
      'Put numbers into the grid!',
      "Each row and column must contain numbers from 1-9 without any repetition",
      'info',
      
  );
}) ;
