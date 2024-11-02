import React, { useState, useEffect } from 'react';

const initializeDeck = () => {
    const suits = ['♠', '♣', '♥', '♦'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck.sort(() => Math.random() - 0.5); // Simple shuffle
};

const calculateHandValue = (hand) => {
    let value = 0;
    let aceCount = 0;

    hand.forEach(card => {
        if (card.value === 'A') {
            aceCount++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    });

    // Adjust for Aces if value is over 21
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }

    return value;
};

function Blackjack() {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState("");

    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        const newDeck = initializeDeck();
        const playerStartingHand = [newDeck.pop(), newDeck.pop()];
        const dealerStartingHand = [newDeck.pop(), newDeck.pop()];

        setDeck(newDeck);
        setPlayerHand(playerStartingHand);
        setDealerHand(dealerStartingHand);
        setIsPlayerTurn(true);
        setGameOver(false);
        setResult("");
    };

    const handleHit = () => {
        if (!isPlayerTurn || gameOver) return;

        const newDeck = [...deck];
        const newHand = [...playerHand, newDeck.pop()];
        setPlayerHand(newHand);
        setDeck(newDeck);

        const playerValue = calculateHandValue(newHand);
        if (playerValue > 21) {
            setResult("Player busts! Dealer wins.");
            setGameOver(true);
        }
    };

    const handleStand = () => {
        setIsPlayerTurn(false);
        handleDealerTurn();
    };

    const handleDealerTurn = () => {
        let dealerValue = calculateHandValue(dealerHand);
        const newDeck = [...deck];
        const newDealerHand = [...dealerHand];

        while (dealerValue < 17) {
            newDealerHand.push(newDeck.pop());
            dealerValue = calculateHandValue(newDealerHand);
        }

        setDeck(newDeck);
        setDealerHand(newDealerHand);

        const playerValue = calculateHandValue(playerHand);
        if (dealerValue > 21 || playerValue > dealerValue) {
            setResult("Player wins!");
        } else if (dealerValue === playerValue) {
            setResult("It's a tie!");
        } else {
            setResult("Dealer wins!");
        }
        setGameOver(true);
    };

    return (
        <div>
            <h2>Blackjack</h2>
            <button onClick={startNewRound} disabled={playerHand.length > 0 && !gameOver}>Deal</button>
            <button onClick={handleHit} disabled={!isPlayerTurn || gameOver}>Hit</button>
            <button onClick={handleStand} disabled={!isPlayerTurn || gameOver}>Stand</button>
            <h3>Player Hand: {playerHand.map(card => `${card.value}${card.suit} `)}</h3>
            <h3>Dealer Hand: {dealerHand.map((card, index) => (index === 0 && isPlayerTurn) ? '?? ' : `${card.value}${card.suit} `)}</h3>
            {result && <h3>{result}</h3>}
            {gameOver && <button onClick={startNewRound}>Play Again</button>}
        </div>
    );
}

export default Blackjack;

