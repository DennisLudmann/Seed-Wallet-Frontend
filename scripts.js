let allWords = [];                          // BIP 39 - 2048words
let seedPhrase = [];            
let seedPhraseLenght = 12;
let randomNumber;


async function init() {
    await loadWords();
    generateSeedPhrase();
}


function generateSeedPhrase() {             // picks 12 random words based on BIP 39
    for (let i = 0; i < seedPhraseLenght; i++) {
        generateNumber();
        let word = allWords[randomNumber];
        seedPhrase.push(word);
    }
    console.log(seedPhrase);
}


async function loadWords() {
    let response = await fetch('./bip39.json');
    allWords = await response.json();
}


function generateNumber() {                                 // generate random number (0-2047)
    randomNumber = Math.floor(Math.random() * 2048);
}