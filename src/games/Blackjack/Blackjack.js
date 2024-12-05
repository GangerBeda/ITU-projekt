import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Blackjack.css';

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

    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);

    const gestureFieldRef = useRef(null);
    const lastTapRef = useRef(0);
    const initialXRef = useRef(null);
    const swipeStartTimeRef = useRef(null);

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
        }

        return () => {
            if (gestureField) {
                gestureField.removeEventListener("pointerdown", handlePointerDown);
                gestureField.removeEventListener("pointerup", handlePointerUp);
            }
        };
    }, [isPlayerTurn, gameOver]);

    const handleDoubleTap = async () => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            // Double-tap
            hitButtonRef.current.click();
            if (gameOver) playAgainButtonRef.current.click();
            lastTapRef.current = 0;
        } else {
            lastTapRef.current = now;
        }
    };

    // Record when, where cursor is on mouse down
    const handlePointerDown = (e) => {
        initialXRef.current = e.clientX;
        swipeStartTimeRef.current = Date.now();
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
            if (response.data.message.includes('Player busts')) {
                setLosses((prev) => prev + 1);
            }
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

        if (response.data.message.includes('Player wins')) {
            setWins((prev) => prev + 1);
        } else if (response.data.message.includes('Dealer wins')) {
            setLosses((prev) => prev + 1);
        }
    };

    return (
        <div className="blackjack-container">
            <div className="blackjack-action-buttons">
                <button ref={hitButtonRef} className="blackjack-action-button" onClick={() => handleHit()} disabled={!isPlayerTurn || gameOver}>Hit</button>
                <button ref={standButtonRef} className="blackjack-action-button" onClick={() => handleStand()} disabled={!isPlayerTurn || gameOver}>Stand</button>
                {gameOver && <button ref={playAgainButtonRef} className="blackjack-action-button" onClick={() => startNewRound()}>Play Again</button>}
            </div>

            <h3>Dealer's hand{gameOver && ': ' + calculateHandValue(dealerHand)}</h3>
            <div className="dealer-hand">
                {dealerHand.map((card, index) => (
                    <div key={index} className="blackjack-card">
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
                    <div key={index} className="blackjack-card player-card">
                        {card.value} {card.suit}
                    </div>
                ))}
            </div>
            <h2>Your hand: {calculateHandValue(playerHand)}</h2>
            <div className="scoreboard">
                <div className="score-container">
                        <span>Wins:</span>
                        <span className="score">{wins}</span>
                    </div>
                    <div className="score-container">
                        <span>Losses:</span>
                        <span className="score">{losses}</span>
                    </div>
                </div>
        </div>
    );
}

export default Blackjack;

