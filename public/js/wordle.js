/**
 * Javascript for Wordle Application
 * 
 * @author Ian Lenehan
 * @see https://www.youtube.com/watch?v=j7OhcuZQ-q8
 */

document.addEventListener("DOMContentLoaded", () => {
    createSquares();


    let guessedWords = [
        []
    ];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;

    const words = [
        'abuse',
        'adult',
        'agent',
        'anger',
        'apple',
        'award',
        'basis',
        'beach',
        'birth',
        'block',
        'blood',
        'board',
        'brain',
        'bread',
        'break',
        'brown',
        'buyer',
        'cause',
        'chain',
        'chair',
        'chest',
        'chief',
        'child',
        'china',
        'claim',
        'class',
        'clock',
        'coach',
        'coast',
        'court',
        'cover',
        'cream',
        'crime',
        'cross',
        'crowd',
        'crown',
        'cycle',
        'dance',
        'death',
        'depth',
        'doubt',
        'draft',
        'drama',
        'dream',
        'dress',
        'drink',
        'drive',
        'earth',
        'enemy',
        'entry',
        'error',
        'event',
        'faith',
        'fault',
        'field',
        'fight',
        'final',
        'floor',
        'focus',
        'force',
        'frame',
        'frank',
        'front',
        'fruit',
        'glass',
        'grant',
        'grass',
        'green',
        'group',
        'guide',
        'heart',
        'henry',
        'horse',
        'hotel',
        'house',
        'image',
        'index',
        'input',
        'issue',
        'japan',
        'jones',
        'judge',
        'knife',
        'laura',
        'layer',
        'level',
        'lewis',
        'light',
        'limit',
        'lunch',
        'major',
        'march',
        'match',
        'metal',
        'model',
        'money',
        'month',
        'motor',
        'mouth',
        'music',
        'night',
        'noise',
        'north',
        'novel',
        'nurse',
        'offer',
        'order',
        'other',
        'owner',
        'panel',
        'paper',
        'party',
        'peace',
        'peter',
        'phase',
        'phone',
        'piece',
        'pilot',
        'pitch',
        'place',
        'plane',
        'plant',
        'plate',
        'point',
        'pound',
        'power',
        'press',
        'price',
        'pride',
        'prize',
        'proof',
        'queen',
        'radio',
        'range',
        'ratio',
        'reply',
        'right',
        'river',
        'round',
        'route',
        'rugby',
        'scale',
        'scene',
        'scope',
        'score',
        'sense',
        'shape',
        'share',
        'sheep',
        'sheet',
        'shift',
        'shirt',
        'shock',
        'sight',
        'simon',
        'skill',
        'sleep',
        'smile',
        'smith',
        'smoke',
        'sound',
        'south',
        'space',
        'speed',
        'spite',
        'sport',
        'squad',
        'staff',
        'stage',
        'start',
        'state',
        'steam',
        'steel',
        'stock',
        'stone',
        'store',
        'study',
        'stuff',
        'style',
        'sugar',
        'table',
        'taste',
        'terry',
        'theme',
        'thing',
        'title',
        'total',
        'touch',
        'tower',
        'track',
        'trade',
        'train',
        'trend',
        'trial',
        'trust',
        'truth',
        'uncle',
        'union',
        'unity',
        'value',
        'video',
        'visit',
        'voice',
        'waste',
        'watch',
        'water',
        'while',
        'white',
        'whole',
        'woman',
        'world',
        'youth',
        'alcon',
        'aught',
        'hella',
        'one’s',
        'ought',
        'thame',
        'there',
        'thine',
        'thine',
        'where',
        'which',
        'whose',
        'whoso',
        'yours',
        'yours',
        'admit',
        'adopt',
        'agree',
        'allow',
        'alter',
        'apply',
        'argue',
        'arise',
        'avoid',
        'begin',
        'blame',
        'break',
        'bring',
        'build',
        'burst',
        'carry',
        'catch',
        'cause',
        'check',
        'claim',
        'clean',
        'clear',
        'climb',
        'close',
        'count',
        'cover',
        'cross',
        'dance',
        'doubt',
        'drink',
        'drive',
        'enjoy',
        'enter',
        'exist',
        'fight',
        'focus',
        'force',
        'guess',
        'imply',
        'issue',
        'judge',
        'laugh',
        'learn',
        'leave',
        'let’s',
        'limit',
        'marry',
        'match',
        'occur',
        'offer',
        'order',
        'phone',
        'place',
        'point',
        'press',
        'prove',
        'raise',
        'reach',
        'refer',
        'relax',
        'serve',
        'shall',
        'share',
        'shift',
        'shoot',
        'sleep',
        'solve',
        'sound',
        'speak',
        'spend',
        'split',
        'stand',
        'start',
        'state',
        'stick',
        'study',
        'teach',
        'thank',
        'think',
        'throw',
        'touch',
        'train',
        'treat',
        'trust',
        'visit',
        'voice',
        'waste',
        'watch',
        'worry',
        'would',
        'write',
        'above',
        'acute',
        'alive',
        'alone',
        'angry',
        'aware',
        'awful',
        'basic',
        'black',
        'blind',
        'brave',
        'brief',
        'broad',
        'brown',
        'cheap',
        'chief',
        'civil',
        'clean',
        'clear',
        'close',
        'crazy',
        'daily',
        'dirty',
        'early',
        'empty',
        'equal',
        'exact',
        'extra',
        'faint',
        'false',
        'fifth',
        'final',
        'first',
        'fresh',
        'front',
        'funny',
        'giant',
        'grand',
        'great',
        'green',
        'gross',
        'happy',
        'harsh',
        'heavy',
        'human',
        'ideal',
        'inner',
        'joint',
        'large',
        'legal',
        'level',
        'light',
        'local',
        'loose',
        'lucky',
        'magic',
        'major',
        'minor',
        'moral',
        'naked',
        'nasty',
        'naval',
        'other',
        'outer',
        'plain',
        'prime',
        'prior',
        'proud',
        'quick',
        'quiet',
        'rapid',
        'ready',
        'right',
        'roman',
        'rough',
        'round',
        'royal',
        'rural',
        'sharp',
        'sheer',
        'short',
        'silly',
        'sixth',
        'small',
        'smart',
        'solid',
        'sorry',
        'spare',
        'steep',
        'still',
        'super',
        'sweet',
        'thick',
        'third',
        'tight',
        'total',
        'tough',
        'upper',
        'upset',
        'urban',
        'usual',
        'vague',
        'valid',
        'vital',
        'white',
        'whole',
        'wrong',
        'young',
        'afore',
        'after',
        'bothe',
        'other',
        'since',
        'slash',
        'until',
        'where',
        'while',
        'aback',
        'abaft',
        'aboon',
        'about',
        'above',
        'accel',
        'adown',
        'afoot',
        'afore',
        'afoul',
        'after',
        'again',
        'agape',
        'agogo',
        'agone',
        'ahead',
        'ahull',
        'alife',
        'alike',
        'aline',
        'aloft',
        'alone',
        'along',
        'aloof',
        'aloud',
        'amiss',
        'amply',
        'amuck',
        'apace',
        'apart',
        'aptly',
        'arear',
        'aside',
        'askew',
        'awful',
        'badly',
        'bally',
        'below',
        'canny',
        'cheap',
        'clean',
        'clear',
        'coyly',
        'daily',
        'dimly',
        'dirty',
        'ditto',
        'drily',
        'dryly',
        'dully',
        'early',
        'extra',
        'false',
        'fatly',
        'feyly',
        'first',
        'fitly',
        'forte',
        'forth',
        'fresh',
        'fully',
        'funny',
        'gaily',
        'gayly',
        'godly',
        'great',
        'haply',
        'heavy',
        'hella',
        'hence',
        'hotly',
        'icily',
        'infra',
        'intl.',
        'jildi',
        'jolly',
        'laxly',
        'lento',
        'light',
        'lowly',
        'madly',
        'maybe',
        'never',
        'newly',
        'nobly',
        'oddly',
        'often',
        'other',
        'ought',
        'party',
        'piano',
        'plain',
        'plonk',
        'plumb',
        'prior',
        'queer',
        'quick',
        'quite',
        'ramen',
        'rapid',
        'redly',
        'right',
        'rough',
        'round',
        'sadly',
        'secus',
        'selly',
        'sharp',
        'sheer',
        'shily',
        'short',
        'shyly',
        'silly',
        'since',
        'sleek',
        'slyly',
        'small',
        'so-so',
        'sound',
        'spang',
        'srsly',
        'stark',
        'still',
        'stone',
        'stour',
        'super',
        'tally',
        'tanto',
        'there',
        'thick',
        'tight',
        'today',
        'tomoz',
        'truly',
        'twice',
        'under',
        'utter',
        'verry',
        'wanly',
        'wetly',
        'where',
        'wrong',
        'wryly',
        'abaft',
        'aboon',
        'about',
        'above',
        'adown',
        'afore',
        'after',
        'along',
        'aloof',
        'among',
        'below',
        'circa',
        'cross',
        'furth',
        'minus',
        'neath',
        'round',
        'since',
        'spite',
        'under',
        'until',
        'aargh',
        'adieu',
        'adios',
        'alack',
        'aloha',
        'avast',
        'bakaw',
        'basta',
        'begad',
        'bless',
        'blige',
        'brava',
        'bravo',
        'bring',
        'chook',
        'damme',
        'dildo',
        'ditto',
        'frick',
        'fudge',
        'golly',
        'gratz',
        'hallo',
        'hasta',
        'havoc',
        'hella',
        'hello',
        'howay',
        'howdy',
        'hullo',
        'huzza',
        'jesus',
        'kapow',
        'loose',
        'lordy',
        'marry',
        'mercy',
        'night',
        'plonk',
        'psych',
        'quite',
        'salve',
        'skoal',
        'sniff',
        'sooey',
        'there',
        'thiam',
        'thwap',
        'tough',
        'twirp',
        'viola',
        'vivat',
        'wacko',
        'wahey',
        'whist',
        'wilma',
        'wirra',
        'woops',
        'wowie',
        'yecch',
        'yeeha',
        'yeesh',
        'yowch',
        'zowie',
    ];


    getNewWord();

    const keys = document.querySelectorAll(".keyboard-row button");

    function getNewWord() {
        var size = words.length;
        var index = Math.floor(Math.random() * size);

        word = words[index];
        console.log(word);
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));

            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {


        var test = 0;

        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");

        }

        const currentWord = currentWordArr.join("");

        for (let i = 0; i < words.length - 1; i++) {
            if (words[i] == currentWord) {
                test = 1;
            }
        }

        if (test == 0) {
            window.alert("This is not a word in the dictionary!");
            return;
        }


        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
        });

        guessedWordCount += 1;

        if (currentWord === word) {
            window.alert("Congratulations!");
        }

        if (guessedWords.length === 6) {
            window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        }

        guessedWords.push([]);

    };


    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));

        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                handleSubmitWord();
                return;
            }

            if (letter === "del") {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    }
});