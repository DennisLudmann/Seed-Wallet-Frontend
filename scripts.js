let allWords = [];                          // BIP 39 - 2048 words
let seedPhrase = [];
let questionWords = [];                     // monitoring previous asked questions
let shuffleArray = [];                      
const seedPhraseLenght = 12;
const checkNumber = 6;
let turnCounter = 0;
let randomNumber;


async function init() {
    await loadWords();
    generateSeedPhrase();
    renderPage();
    renderSeedphrase();
    generateShuffleArray();
}


function generateSeedPhrase() {                           // picks 12 random words based on BIP 39
    for (let i = 0; i < seedPhraseLenght; i++) {
        generateNumber(2048);                             // parse a range and get a random number from 0-x fx 2048 returned
        let word = allWords[randomNumber];
        if (seedPhrase.includes(word)) {                  // dont allow the seedPhrase to contain the same word multiple times
            i--;
        } else {
            seedPhrase.push(word);
        }
    }
    console.log(seedPhrase);
}


async function loadWords() {
    let response = await fetch('./bip39.json');
    allWords = await response.json();
}


function checkSeedphrase(input) {
    let word = seedPhrase.findIndex((seedphrase__word) => seedphrase__word === input);
    console.log(word);
}


function renderPage() {
    document.getElementById('card').innerHTML += landingHTML();
}


function generateNumber(number) {                                 // generate random number depending on input fx 0-2047
    randomNumber = Math.floor(Math.random() * number);
}


function renderSeedphrase() {
    for (let i = 0; i < seedPhraseLenght; i++) {
        let position = i + 1;
        document.getElementById('seedPhrase').innerHTML +=
            seedphraseHTML(position, i);
    }
}


function nextSlide(number) {
    turnCounter = turnCounter + number;
    if (turnCounter > 4) {
        finishedBuilder();
    }
    else {
        const [firstNumber, secondNumber] = getNewNumbers();
        answerBuilder(firstNumber, secondNumber);
        answerOptions();
        toggleButton();
    }
}


function getNewNumbers() {
    let firstNumber = shuffleArray.pop();                                 // Removes the last element of an array, and returns that element
    let secondNumber = shuffleArray.pop();
    questionWords.push(firstNumber);                                      // fill array with index of questions to prevent the same 
    questionWords.push(secondNumber);                                     // question to be asked in the future
    return [firstNumber, secondNumber];
}


function answerOptions() {
    let checkedWords = [];
    for (let i = 0; i < checkNumber; i++) {
        generateNumber(seedPhraseLenght);
        if (shuffleArray.includes(randomNumber)) {
            let word = seedPhrase[randomNumber];
            checkedWords.push(word);
            document.getElementById('seedPhrase').innerHTML += answerHTML(word);
        }
        else {
            i--;
        }
    }
}


function answerGiven(word){   
        if (document.getElementById('firstanswer').innerHTML === "") {
            document.getElementById('firstanswer').innerHTML += word;
        } else {
            document.getElementById('secondanswer').innerHTML += word;
            console.log(word)
        }
}


function toggleButton() {
    if (document.getElementById('button').disabled) {
        document.getElementById('button').disabled = false;
        var element = document.getElementById('button');
        element.classList.remove('cta--disabled');
    }
    else {
        document.getElementById('button').disabled = true;
        var element = document.getElementById('button');
        element.classList.add('cta--disabled');
    }
}


function answerBuilder(firstNumber, secondNumber) {
    document.getElementById('text').innerHTML = questionHTML(firstNumber + 1, secondNumber + 1);
    document.getElementById('seedPhrase').innerHTML = "";
    document.getElementById('header').innerHTML = "";
    document.getElementById('nav__header').innerHTML = "Confirm Seed Phrase";
}


function finishedBuilder() {
    addSuccessclass();
    document.getElementById('nav__header').innerHTML = "Congratulations";
    document.getElementById('container').innerHTML = successHTML();
    document.getElementById('card__cta').innerHTML = "";
}


function addSuccessclass() {
    let element = document.getElementById("container");
    element.classList.add("success--wrapper");
}

// Borrowed Fisher-Yates algorithem to shuffle an array

function generateShuffleArray() {
    shuffleArray = Array.from(Array(seedPhraseLenght).keys())         //  generate an array 0-11
    let len = shuffleArray.length;                      //  shuffleArray.length will be reduced by one each time whenever the for loop 
    let x;                                              //  is repeated and also the last i is removed from the loop once it is swapped
       for (x = len -1; x > 0; x--) { 
          var y = Math.floor(Math.random() * x) 
          var temp = shuffleArray[x] 
          shuffleArray[x] = shuffleArray[y] 
          shuffleArray[y] = temp 
        }
}


// Here are some builing blocks to generate HTML


function landingHTML() {
    return `
    <div class="card__header">
    <a class="return" href=""> < </a>
    <h2 id="nav__header" class="headline">Backup Seed Phrase</h2>
    </div>
    <div id="container" class="card__content">
    <h1 id="header" class="main__headline">Write Down Your Seed Phrase</h1>
    <div id="text" class="main__text" > This is your seed phrase.Write it down on a 
    paper and keep it in a safe place.You'll be asked to
        re - enter this phrase(in order) on the next step.</div>
    <div class="wrapper" id="seedPhrase"></div>
    </div>
    <div id="card__cta" class="card__cta">
        <button id="button" onclick="nextSlide(1)" class="cta">Continue</button>
    </div>`
}


function seedphraseHTML(position, i) {
    return `
        <div id=${position} class="seedword" href="#">
        <p class="seedphrase__number">${position}.</p>
        <p class="seedphrase__word"> ${seedPhrase[i]}</p>
        </div>`
}


function answerHTML(word) {
    return `
    <div class="seedword" href="#">
    <p onclick="answerGiven('${word}')" class="seedphrase__word"> ${word}</p>
    </div>`
}


function questionHTML(firstNumber, secondNumber) {
    return `
    <div class="question__wrapper" href="#">
        <p class="question__info">Select each word in the order it was presented to you</p>
    <div class="question__container" href="#">
        <div class="seedword" href="#">
            <p class="seedphrase__word">${firstNumber}.</p>
            <p id="firstanswer" class="seedphrase--word"></p>
        </div>
        <div class="seedword" href="#">
            <p class="seedphrase__word"> ${secondNumber}.</p>
            <p id="secondanswer" class="seedphrase--word"></p>
        </div>
    </div>`
}


function successHTML (){
    return `
    <img class="success__image" src="success.jpg" alt="handshake, one human one digital">
    <p class="main__text">
    You\'ve successfully protected your wallet. Remember to keep your seed phrase safe, it\'s your
    responsibility&#33; KNAWALLET cannot recover your wallet should you lose it.</p>`
}