import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Blackjack.css';


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

    hand.forEach((card) => {
        if (card.value === 'A') {
            aceCount += 1;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value, 10);
        }
    });

    // Adjust for aces if the value is over 21
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount -= 1;
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

    const gestureFieldRef = useRef(null);
    const lastTapRef = useRef(0);
    const initialXRef = useRef(null);
    const swipeStartTimeRef = useRef(null); // Define swipeStartTimeRef here

    const hitButtonRef = useRef(null);
    const standButtonRef = useRef(null);
    const playAgainButtonRef = useRef(null);

    useEffect(() => {
        startNewRound();
        console.log("New round effect");
    }, []);

    const startNewRound = async () => {
        const response = await axios.post('http://localhost:3001/blackjack/start');
        const { deck, playerHand, dealerHand } = response.data;

        setDeck(deck);
        setPlayerHand(playerHand);
        setDealerHand(dealerHand);
        setIsPlayerTurn(true);
        setGameOver(false);
        setResult("");
    };

    useEffect(() => {
        const gestureField = gestureFieldRef.current;

        if (gestureField) {
            gestureField.addEventListener("pointerdown", handlePointerDown);
            gestureField.addEventListener("pointerup", handlePointerUp);
            // gestureField.addEventListener("pointerup", handleDoubleTap);
            gestureField.addEventListener("pointermove", handleSwipe);
        }

        return () => {
            if (gestureField) {
                gestureField.removeEventListener("pointerdown", handlePointerDown);
                gestureField.removeEventListener("pointerup", handlePointerUp);
                // gestureField.removeEventListener("pointerup", handleDoubleTap);
                gestureField.removeEventListener("pointermove", handleSwipe);
            }
        };
    }, [isPlayerTurn, gameOver]);

    const handleDoubleTap = async () => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            // Double-tap detected
            hitButtonRef.current.click();
            if (gameOver) playAgainButtonRef.current.click();
            lastTapRef.current = 0; // Reset after double-tap is detected
        } else {
            lastTapRef.current = now;
        }
    };

    const handlePointerDown = (e) => {
        initialXRef.current = e.clientX;
        swipeStartTimeRef.current = Date.now(); // Start swipe timing
    };
    
    const handleSwipe = (e) => {
        if (initialXRef.current === null) return; // Ensure a swipe has started
    
        const distance = e.clientX - initialXRef.current;
        const timeElapsed = Date.now() - lastTapRef.current;
    
        if (distance > 200 && timeElapsed <= 1000) { // 200px distance and <= 1 second
            standButtonRef.current.click();
            initialXRef.current = null; // Reset the swipe tracking
        }
    };
    
    const handlePointerUp = (e) => {
        const swipeDistance = e.clientX - initialXRef.current;
        const swipeDuration = Date.now() - swipeStartTimeRef.current;
    
        if (swipeDistance > 200 && swipeDuration <= 300) {
            // If swipe conditions are met, trigger the Stand button
            standButtonRef.current.click();
        } else if (swipeDistance < 20) {
            // Short movement, so check for double-tap
            handleDoubleTap();
        }
    
        // Reset swipe tracking variables
        initialXRef.current = null;
        swipeStartTimeRef.current = null;
    };

    const handleHit = async () => {
        if (!isPlayerTurn || gameOver) {return;}

        const response = await axios.post('http://localhost:3001/blackjack/hit', {
            deck,
            playerHand
        });

        if (response.data.gameOver) {
            console.log("game over");
            setPlayerHand(response.data.playerHand);
            setResult(response.data.message);
            setGameOver(true);
        } else {
            console.log("game continue");
            setPlayerHand(response.data.playerHand);
            setDeck(response.data.deck);
        }
    };

    const handleStand = async () => {
        setIsPlayerTurn(false);
        const response = await axios.post('http://localhost:3001/blackjack/stand', {
            deck,
            dealerHand,
            playerHand
        });

        setDealerHand(response.data.dealerHand);
        setResult(response.data.message);
        setGameOver(true);
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
        <div className="blackjack-container">
            <div className="action-buttons">
                <button ref={hitButtonRef} className="action-button" onClick={() => handleHit()} disabled={!isPlayerTurn || gameOver}>Hit</button>
                <button ref={standButtonRef} className="action-button" onClick={() => handleStand()} disabled={!isPlayerTurn || gameOver}>Stand</button>
                {gameOver && <button ref={playAgainButtonRef} className="action-button" onClick={() => startNewRound()}>Play Again</button>}
            </div>

            <h3>Dealer's hand{gameOver && ': ' + calculateHandValue(dealerHand)}</h3>
            <div className="dealer-hand">
                {dealerHand.map((card, index) => (
                    <div key={index} className="card">
                        {index === 0 && isPlayerTurn ? "??" : `${card.value} ${card.suit}`}
                    </div>
                ))}
            </div>
            
            <div className="gesture-field" ref={gestureFieldRef}>
                <p className="gesture-instructions">Double-tap to Hit, Swipe to Stand<br /><br /> 
                Dealer draws to 17, single deck. <br /><br />
                {result && <div className="result-message">{result}<br /><br />Double-tap to play again.</div>}</p>
                
            </div>
            <div className="player-hand">
                {playerHand.map((card, index) => (
                    <div key={index} className="card player-card">
                        {card.value} {card.suit}
                    </div>
                ))}
            </div>
            <h2>Your hand: {calculateHandValue(playerHand)}</h2>
        </div>
    );
}

export default Blackjack;

