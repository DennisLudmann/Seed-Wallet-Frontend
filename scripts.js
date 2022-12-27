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
        generateNumber();
        let word = allWords[randomNumber];
        if (seedPhrase.includes(word)) {    // dont allow the seedphrase to contain the same word multiple times
            i--;
        } else {
            seedPhrase.push(word);
        }
    }
    console.log(seedPhrase);
}

// function checkSeedphrase(){

// }
// seedPhrase.findIndex(checkWord)

// document.getElementById("demo").innerHTML = ages.findIndex(checkAge);

// function checkAge(age) {
//   return age == 20;

async function loadWords() {
    let response = await fetch('./bip39.json');
    allWords = await response.json();
}


function renderPage(){
    let contentEntryBuild = '';
    contentEntryBuild += renderLanding(contentEntryBuild)
    document.getElementById('container').innerHTML += contentEntryBuild;
}


function generateNumber() {                                 // generate random number (0-2047)
    randomNumber = Math.floor(Math.random() * 2048);
}


function renderSeedphrase() {
    for (let i = 0; i < seedPhraseLenght; i++) {
        let position = i + 1;
        document.getElementById('seedphrase').innerHTML += `
        <div id=${position} class="seedword" href="#">
        <p class="seedphrase__number">${position}.</p>
        <p class="seedphrase__word"> ${seedPhrase[i]}</p>
         </div>
         `;
    }
}


// Here are some builing blocks to generate HTML

function renderLanding() {
        return`
        <h1 class="main__headline">Write Down Your Seed Phrase</h1>
        <p class="main__text" > This is your seed phrase.Write it down on a paper and keep it in a safe place.You'll be asked to
        re - enter this phrase(in order) on the next step.</p>
        <div class="wrapper" id="seedphrase"></div>`
}