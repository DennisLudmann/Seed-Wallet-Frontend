let allWords = [];                          // BIP 39 - 2048words
let seedPhrase = [];
const seedPhraseLenght = 12;
let randomNumber;


async function init() {
    await loadWords();
    generateSeedPhrase();
    renderPage();
    renderSeedphrase();
}


function generateSeedPhrase() {             // picks 12 random words based on BIP 39
    for (let i = 0; i < seedPhraseLenght; i++) {
        generateNumber(2048);
        let word = allWords[randomNumber];
        if (seedPhrase.includes(word)) {    // dont allow the seedPhrase to contain the same word multiple times
            i--;
        } else {
            seedPhrase.push(word);
        }
    }
    console.log(seedPhrase);
}


function checkSeedphrase(input) {
    let word = seedPhrase.findIndex((seedphrase__word) => seedphrase__word === input);
    console.log(word);
}


async function loadWords() {
    let response = await fetch('./bip39.json');
    allWords = await response.json();
}


function renderPage() {
    let contentEntryBuild = '';
    contentEntryBuild += landingHTML(contentEntryBuild)
    document.getElementById('container').innerHTML += contentEntryBuild;
}


function generateNumber(number) {                                 // generate random number (0-2047 or 0-11 or 0-3)
    randomNumber = Math.floor(Math.random() * number);
}


function renderSeedphrase() {
    for (let i = 0; i < seedPhraseLenght; i++) {
        let position = i + 1;
        document.getElementById('seedPhrase').innerHTML +=
            seedphraseHTML(position, i);
    }
}

function nextSlide() {
    let content = document.getElementById('container').innerHTML = "";
}


// Here are some builing blocks to generate HTML

function landingHTML() {
    return `
        <h1 class="main__headline">Write Down Your Seed Phrase</h1>
        <p class="main__text" > This is your seed phrase.Write it down on a paper and keep it in a safe place.You'll be asked to
        re - enter this phrase(in order) on the next step.</p>
        <div class="wrapper" id="seedPhrase"></div>`
}

function seedphraseHTML(position, i) {
    return `
        <div id=${position} class="seedword" href="#">
        <p class="seedphrase__number">${position}.</p>
        <p class="seedphrase__word"> ${seedPhrase[i]}</p>
        </div>`
}