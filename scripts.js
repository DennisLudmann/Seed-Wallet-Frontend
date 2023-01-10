let allWords = [];                          // BIP 39 - 2048 words
let seedPhrase = [];
let questionWords = [];                     // monitoring previous asked questions
let currentAnswers = [];
let shuffleArray = [];                      
const seedPhraseLenght = 12;
let turnCounter = 0;
let randomNumber;
let firstAnswer = false;
let secondAnswer = false;


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


function checkSeedphrase(input, answerId) {
    let word = findIndex(input);
    let number = findAnswer(answerId);
    if(answerId == 1 && word == number)
    firstAnswer = true;
    if(answerId == 2 && word == number)
    secondAnswer = true;
}


function clearState() {
    firstAnswer = false;
    secondAnswer = false;
    for (let i = 0; i < currentAnswers.length; i++) {
        const word = currentAnswers[i];
        let exists = document.getElementById(word);
        if (exists) {
            removeKlickedclass(word);
        }
    }
    document.getElementById('answer__1').innerHTML = "";
    document.getElementById('answer__2').innerHTML = "";
}


function renderPage() {
    document.getElementById('card').innerHTML += landingHTML();
}


function generateNumber(number) {                                 // generate random number depending on input fx 0-2047
    randomNumber = Math.floor(Math.random() * number);
}


function questionAsked(){
    return questionWords.slice(Math.max(questionWords.length - 2, 0));
}


function findIndex(input){
    let word = seedPhrase.findIndex((seedphrase__word) => seedphrase__word === input);
    return word;
}


function findAnswer(input){
    let id = 'question__' + input;
    let number = document.getElementById(id).innerText;                   
    number = number.substring(0, number.length - 1);                                  // remove the last character of the string
    number = (number * 1) -1;
    return number;
}


function renderSeedphrase() {
    for (let i = 0; i < seedPhraseLenght; i++) {
        let position = i + 1;
        document.getElementById('seedPhrase').innerHTML +=
            seedphraseHTML(position, i);
    }
}


function nextSlide(number) {                                                        // checkes if answered correctly and if next slide should be displayed or same questions asked again
    if (firstAnswer && secondAnswer || turnCounter == 0) {
        turnCounter = turnCounter + number;
    if (turnCounter > 4) {                                                          // checkes if all 4 slides have been answered sucessfully - sucess if true
        finishedBuilder();
        return
    }
        firstAnswer = false;
        secondAnswer = false;
        const [firstNumber, secondNumber] = getNewNumbers();
        answerBuilder(firstNumber, secondNumber);
        answerOptions();
        setProgress(turnCounter);
        buttonDisabled();
    }
    clearState();
}


function getNewNumbers() {
    let firstNumber = shuffleArray.pop();                                 // Removes the last element of an array, and returns that element
    let secondNumber = shuffleArray.pop();
    questionWords.push(firstNumber);                                      // fill array with index of questions to prevent the same 
    questionWords.push(secondNumber);                                     // question to be asked in the future
    return [firstNumber, secondNumber];
}


function answerOptions() {
    let checkedWords = questionAsked();                                    // get the id of the two picked questions
    for (let i = 0; i < 4; i++) {                                          // add 4 more to the array
        generateNumber(seedPhraseLenght);
        if (shuffleArray.includes(randomNumber) && !checkedWords.includes(randomNumber)) {
            checkedWords.push(randomNumber);
        }
        else {
            i--;
        }
    }
    randomiseArray(checkedWords);                                       // shuffle the 6 words, to prevent them from beeing displayed on the same spot
    for (let i = 0; i < checkedWords.length; i++) {
        let number = +checkedWords[i];
        let word = seedPhrase[number];
        document.getElementById('seedPhrase').innerHTML += answerHTML(word);
    }
}


function answerGiven(word){
        if (document.getElementById('answer__1').innerHTML === "") {
            document.getElementById('answer__1').innerHTML += word;
            currentAnswers.push(word);
            checkSeedphrase(word, '1');
            addKlickedclass(word);        
        } 
        else if (document.getElementById('answer__2').innerHTML === "") {
            document.getElementById('answer__2').innerHTML += word;
            currentAnswers.push(word);
            checkSeedphrase(word, '2');
            addKlickedclass(word);
            buttonActive();
        }
}


function answerBuilder(firstNumber, secondNumber) {
    document.getElementById('text').innerHTML = questionHTML(firstNumber + 1, secondNumber + 1);
    document.getElementById('seedPhrase').innerHTML = "";
    document.getElementById('header').innerHTML = "";
    document.getElementById('nav__header').innerHTML = "Confirm Seed Phrase";
}


function setProgress(input) {
    debugger;
    let exists = document.getElementById('progress');
        if (!exists) {
            document.getElementById('container').innerHTML += progressHTML();
        }
        let active = document.getElementById('circle__' + input);
        active.classList.add('circle--aktive');
        if (input > 1) {                                                                            // to remove class when progress is one step fearther
            let inaktive = document.getElementById('circle__' + (input -1));
            inaktive.classList.remove('circle--aktive');
    }
    
}


function finishedBuilder() {
    addSuccessclass();
    document.getElementById('nav__header').innerHTML = "Congratulations";
    document.getElementById('container').innerHTML = successHTML();
    document.getElementById('card__cta').innerHTML = "";
}


function buttonActive() {
        document.getElementById('button').disabled = false;
        var element = document.getElementById('button');
        element.classList.remove('cta--disabled');
}


function buttonDisabled() {
        document.getElementById('button').disabled = true;
        var element = document.getElementById('button');
        element.classList.add('cta--disabled');
}


function addKlickedclass(input) {
    let element = document.getElementById(input);
    element.classList.add('main__text');
}


function removeKlickedclass(input) {
    let element = document.getElementById(input);
    element.classList.remove('main__text');
}


function addSuccessclass() {
    let element = document.getElementById('container');
    element.classList.add('success--wrapper');
}


function generateShuffleArray() {
    shuffleArray = Array.from(Array(seedPhraseLenght).keys())         //  generate an array 0-11
    randomiseArray(shuffleArray);
}


// Borrowed Fisher-Yates algorithem to shuffle an array


function randomiseArray(Array) {
    let len = Array.length;                             //  shuffleArray.length will be reduced by one each time whenever the for loop 
    let x;                                              //  is repeated and also the last i is removed from the loop once it is swapped
       for (x = len -1; x > 0; x--) { 
          var y = Math.floor(Math.random() * x) 
          var temp = Array[x] 
          Array[x] = Array[y] 
          Array[y] = temp 
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
        <div id="text" class="main__text"> 
            This is your seed phrase.Write it down on a 
            paper and keep it in a safe place.You'll be asked to re - enter this phrase(in order) on the next step.
        </div>
        <div class="seedphrase__wrapper" id="seedPhrase"></div>
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
        <div onclick="answerGiven('${word}')" class="seedword" href="#">
            <p id="${word}"  class=""> ${word}</p>
        </div>`
}


function questionHTML(firstNumber, secondNumber) {
    return `
    <div class="question__wrapper" href="#">
        <p class="question__info">Select each word in the order it was presented to you</p>
    <div class="question__container" href="#">
        <div class="seedword" href="#">
            <p id="question__1" class="seedphrase__word">${firstNumber}.</p>
            <p id="answer__1" class="seedphrase__word seedphrase--word"></p>
        </div>
        <div class="seedword" href="#">
            <p id="question__2" class="seedphrase__word"> ${secondNumber}.</p>
            <p id="answer__2" class="seedphrase__word seedphrase--word"></p>
        </div>
    </div>`
}


function progressHTML() {
    return`
    <div class="progress__wrapper">
        <div id="progress" class="progress">
            <div id="circle__1" class="circle__inakive"></div>
            <div id="circle__2" class="circle__inakive"></div>
            <div id="circle__3" class="circle__inakive"></div>
            <div id="circle__4" class="circle__inakive"></div>
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