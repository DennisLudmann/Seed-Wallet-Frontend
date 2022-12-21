let bip39 = [];


function init() {
    loadWords();
}


async function loadWords() {
    let response = await fetch('./bip39.json');
    bip39 = await response.json();
}