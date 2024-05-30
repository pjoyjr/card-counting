document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('guess-button').addEventListener('click', makeGuess);

let count = 0;
let trueCount = 0;
let cardValues = [];
let intervalId;
const cardCanvas = document.getElementById('card-canvas');
const ctx = cardCanvas.getContext('2d');

const cardWidth = 100;
const cardHeight = 150;

function startGame() {
    const decks = parseInt(document.getElementById('decks').value);
    const speed = parseInt(document.getElementById('speed').value);
    count = 0;
    cardValues = generateCards(decks);
    document.getElementById('result').innerText = '';
    document.getElementById('guess').value = '';

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(flipCard, speed);
}

function generateCards(decks) {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const cards = [];

    for (let i = 0; i < decks; i++) {
        for (let suit of suits) {
            for (let value of values) {
                cards.push(value + suit);
            }
        }
    }

    return cards.sort(() => Math.random() - 0.5);
}

function flipCard() {
    if (cardValues.length === 0) {
        clearInterval(intervalId);
        ctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);
        ctx.font = '20px Arial';
        ctx.fillText('Done', cardCanvas.width / 2 - 20, cardCanvas.height / 2);
        return;
    }

    const card = cardValues.pop();
    drawCard(card);
    updateCount(card);
}

function drawCard(card) {
    const svg = generateCardSVG(card);
    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {
        ctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);
        ctx.drawImage(img, cardCanvas.width / 2 - cardWidth / 2, cardCanvas.height / 2 - cardHeight / 2, cardWidth, cardHeight);
        URL.revokeObjectURL(url);
    };

    img.src = url;
}

function generateCardSVG(card) {
    const suit = card.slice(-1);
    const value = card.slice(0, -1);
    const suitSymbol = getSuitSymbol(suit);
    const color = (suit === 'H' || suit === 'D') ? 'red' : 'black';

    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="100" height="150">
            <rect width="24" height="36" fill="white" stroke="black" />
            <text x="2" y="20" font-family="Arial" font-size="18" fill="${color}">${value}${suitSymbol}</text>
            <text x="2" y="5" font-family="Arial" font-size="18" fill="${color}">${value}${suitSymbol}</text>
            <text x="12" y="18" font-family="Arial" font-size="30" fill="${color}" text-anchor="middle">${suitSymbol}</text>
        </svg>
    `;
}

function getSuitSymbol(suit) {
    switch (suit) {
        case 'H': return '♥';
        case 'D': return '♦';
        case 'C': return '♣';
        case 'S': return '♠';
    }
}

function updateCount(card) {
    const value = card.slice(0, -1);
    if (['2', '3', '4', '5', '6'].includes(value)) {
        count += 1;
    } else if (['10', 'J', 'Q', 'K', 'A'].includes(value)) {
        count -= 1;
    }

    const decks = parseInt(document.getElementById('decks').value);
    trueCount = count / decks;
}

function makeGuess() {
    const guess = parseFloat(document.getElementById('guess').value);
    const result = guess === trueCount ? 'Correct!' : `Wrong! The true count was ${trueCount.toFixed(2)}`;
    document.getElementById('result').innerText = result;
}
