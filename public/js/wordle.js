// Wordle Tutorial: https://www.youtube.com/watch?v=j7OhcuZQ-q8

ready(function() {


        console.log("wordle js works");
  
    
        createSquares();

        let guessWords = [[]];
        let availableSpace = 1;
        let word = "dairy";
        let guessWordCount = 0;


        function getTileColor(letter, index) {
            const isCorrectLetter = word.includes(letter)

            if (!isCorrectLetter) {
                return "rgb(58, 58, 60)";
            }

            const letterInThatPosition = word.charAt(index);
            const isCorrectPosition = (letter === letterInThatPosition);

            if (isCorrectPosition) {
                return "rgb(83, 141, 78)";
            }

            return "rgb(181, 159, 59)";
        }



        function handleSubmitWord() {
            const currentWordArray = getCurrentWordArray();
            if (currentWordArray.length !== 5) {
                window.alert("Word must be 5 letters");
            }

            const currentWord = currentWordArray.join("");

            const firstLetterId = guessWordCount * 5 + 1;

            const interval = 200;
            currentWordArray.forEach((letter, index) => {
                setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color: ${tileColor};border-color:${tileColor}`    
                }, interval * index);
            })

            guessWordCount += 1;

            if (currentWord === word) {
                window.alert("Congratulations!");
            }


            if (guessWords.length === 6) {
                window.alert(`Sorry you have no more guess! The word is ${word}.`);
            }

            guessWords.push([]);
        }
    
        function createSquares() {
            const gameBoard = document.getElementById("board");
    
            for (let index = 0; index < 30; index++) {
                let square = document.createElement("div");
                square.classList.add("square");
                square.classList.add("animate_animated");
                square.setAttribute("id", index + 1);
                gameBoard.appendChild(square);
            }
        }
    

        const keys = document.querySelectorAll('.keyboard-row button')


      

        function getCurrentWordArray() {
            const numberOfGuessWords = guessWords.length;
            return guessWords[numberOfGuessWords -1];
        }

        function updateGuessedWords(letter) {
            const currentWordArray = getCurrentWordArray();

            if (currentWordArray && currentWordArray.length < 5) {
                currentWordArray.push(letter);

                const availableSpaceEl = document.getElementById(String(availableSpace));
                availableSpace = availableSpace + 1;

                availableSpaceEl.textContent = letter;
            }
        }

        for (let i = 0; i < keys.length; i++) {
            keys[i].onclick = ({ target }) => {
                const letter = target.getAttribute("data-key");

               if (letter === 'enter') {
                   handleSubmitWord()
                   return;
               }

                updateGuessedWords(letter);
            };
        }



});













function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        console.log("Listener was invoked");
    }
}

