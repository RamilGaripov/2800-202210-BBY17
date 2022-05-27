/**
 * Javascript for Match Application
 * 
 * @author Ferenc Almasi
 * @see https://www.webtips.dev/memory-game-in-javascript
 */

// defines the name of the game
const gameTitle = "Match";

// defines selectors for each aspect of the game
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
};

// defines default state for start of game
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

// creates an array for tiles
const shuffle = array => {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];

        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
};

// randomly places tiles on board, so not the same each time
const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
};

// creates game, by inserting html and shuffling tiles with animal emojis
const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }

    const emojis = ['🐶', '🐱', '🐼', '🐯', '🐵', '🐸', '🐷', '🐮', '🐴', '🐦'];
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `;
    
    const parser = new DOMParser().parseFromString(cards, 'text/html');

    selectors.board.replaceWith(parser.querySelector('.board'));
};

// defines what will happen upon clicking the start button
const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');
    sendDataToServer();
    document.getElementById("startbtn").style.display = "none";
    state.loop = setInterval(() => {
        state.totalTime++;

        selectors.moves.innerText = `${state.totalFlips} moves`;
        selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
};

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

// flips cards back around, if the two are not matching
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });

    state.flippedCards = 0;
};

// when a user clicks any tile
const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    <p>Congrats! You won 25 reward points!</p>
                    <p>In <span class="highlight">${state.totalFlips}</span> moves <br>
                    under <span class="highlight">${state.totalTime}</span> seconds</p>
                </span>
            `;

            clearInterval(state.loop);
        }, 250);
        updateDataOnServer();
        document.getElementById("homebtn").style.display = "block";
    }
};

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
    });
}

// listens for when a tile has been clicked
const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
};

generateGame();
attachEventListeners();

// redirect back to the home page
document.querySelector("#homebtn").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.replace("/main");
});

// shows pop up upon clicking the rules button
document.getElementById("matchHelp").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Rules");
    Swal.fire(
        'Click on a tile to reveal it!',
        "Match the pictures on the tiles together!",
        'info',
        
    );
}) ;