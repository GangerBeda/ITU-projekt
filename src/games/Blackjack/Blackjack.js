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
    return hand
        .filter(card => card && card.value) // Filter out undefined or invalid cards
        .reduce((total, card) => {
            let cardValue = parseInt(card.value);
            if (isNaN(cardValue)) {
                cardValue = card.value === 'A' ? 11 : 10;
            }
            return total + cardValue;
        }, 0);
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

    const hitButtonRef = useRef(null);
    const standButtonRef = useRef(null);

    useEffect(() => {
        startNewRound();
        console.log("New round effect");
    }, []);

    const startNewRound = async () => {
        const response = await axios.post('http://localhost:3001/start');
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
            gestureField.addEventListener("pointerup", handleDoubleTap);
            gestureField.addEventListener("pointermove", handleSwipe);
        }

        return () => {
            if (gestureField) {
                gestureField.removeEventListener("pointerdown", handlePointerDown);
                gestureField.removeEventListener("pointerup", handleDoubleTap);
                gestureField.removeEventListener("pointermove", handleSwipe);
            }
        };
    }, [isPlayerTurn, gameOver]);

    const handleDoubleTap = async () => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {     
            hitButtonRef.current.click();
        }
        lastTapRef.current = now;
    };

    const handlePointerDown = (e) => {
        initialXRef.current = e.clientX;
    };

    const handleSwipe = (e) => {
        if (initialXRef.current === null) return;
        if (e.clientX - initialXRef.current > 200) {
            standButtonRef.current.click();
        }
    };

    const handleHit = async () => {
        if (!isPlayerTurn || gameOver) return;

        const response = await axios.post('http://localhost:3001/hit', {
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
        const response = await axios.post('http://localhost:3001/stand', {
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
                {gameOver && <button className="action-button" onClick={() => startNewRound()}>Play Again</button>}
            </div>

            <h3>Dealer hand</h3>
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
                {result && <div className="result-message">{result}</div>}</p>
                
            </div>
            <div className="player-hand">
                {playerHand.map((card, index) => (
                    <div key={index} className="card player-card">
                        {card.value} {card.suit}
                    </div>
                ))}
            </div>
            <h2>Your hand</h2>
        </div>
    );
}

export default Blackjack;

