let allWords = [];              // bip 39 
let seedPhrase = [];            // 12 words
let randomNumber;


async function init() {
    await loadWords();
    generateSeedPhrase();
}


function generateSeedPhrase() {
    for (let i = 0; i < 12; i++) {
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


function generateNumber() {
    randomNumber = Math.floor(Math.random() * 2048);
}