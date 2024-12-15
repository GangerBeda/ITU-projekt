//
//  File: Blackjack.js
//  Author: Matěj Bedřich, xbedri04  
//

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Blackjack.css';
import cheatsheet from './cheatsheet.png';
import sheetICON from './cheatsheetICO.png';
import homeICON from './home.png';

function Blackjack() {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerValue, setPlayerValue] = useState([]);
    const [dealerValue, setDealerValue] = useState([]);
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

    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        startNewRound();
        console.log("New round effect");
    }, []);

// New round BE request
    const startNewRound = async () => {
        const response = await axios.post('http://localhost:3001/blackjack/start');
        const { deck, playerHand, dealerHand, playerValue, dealerValue } = response.data;

        setDeck(deck);
        setPlayerHand(playerHand);
        setDealerHand(dealerHand);
        setPlayerValue(playerValue);
        setDealerValue(dealerValue);
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

// Double tap detector
    const handleDoubleTap = async () => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            hitButtonRef.current.click();
            if (gameOver) playAgainButtonRef.current.click();
            lastTapRef.current = 0;
        } else {
            lastTapRef.current = now;
        }
    };

    const handlePointerDown = (e) => {
        initialXRef.current = e.clientX;
        swipeStartTimeRef.current = Date.now();
    };
    
// Swipe detector
    const handlePointerUp = (e) => {
        const swipeDistance = e.clientX - initialXRef.current;
        const swipeDuration = Date.now() - swipeStartTimeRef.current;
    
        if ((swipeDistance < -200 || swipeDistance > 200) && swipeDuration <= 300) {
            standButtonRef.current.click();
        } else if (swipeDistance < 20) {
            handleDoubleTap();
        }
    
        initialXRef.current = null;
        swipeStartTimeRef.current = null;
    };

// Hit BE request
    const handleHit = async () => {
        if (!isPlayerTurn || gameOver) {return;}

        const response = await axios.post('http://localhost:3001/blackjack/hit', {
            deck,
            playerHand,
            playerValue
        });

        if (response.data.gameOver) {
            console.log("game over");
            setPlayerHand(response.data.playerHand);     
            setPlayerValue(response.data.playerValue);
            setResult(response.data.message);
            setGameOver(true);
            if (response.data.message.includes('Player busts')) {
                setLosses((prev) => prev + 1);
            }
        } else {
            console.log("game continue");
            setPlayerHand(response.data.playerHand);
            setDeck(response.data.deck);
            setPlayerValue(response.data.playerValue);
        }
    };

//  Stand BE request
    const handleStand = async () => {
        setIsPlayerTurn(false);
        const response = await axios.post('http://localhost:3001/blackjack/stand', {
            deck,
            dealerHand,
            playerHand,
            dealerValue
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

// Presentation
    return (
        <div className="blackjack-container">
            <div className="blackjack-action-buttons">
                <button ref={hitButtonRef} className="blackjack-action-button" onClick={() => handleHit()} disabled={!isPlayerTurn || gameOver}>Hit</button>
                <button ref={standButtonRef} className="blackjack-action-button" onClick={() => handleStand()} disabled={!isPlayerTurn || gameOver}>Stand</button>
                {gameOver && <button ref={playAgainButtonRef} className="blackjack-action-button" onClick={() => startNewRound()}>Play Again</button>}
            </div>

            <h3>Dealer's hand{gameOver && ': ' + dealerValue}</h3>
            <div className="dealer-hand">
                {dealerHand.map((card, index) => (
                    <div key={index} className="blackjack-card">
                        {index === 0 && isPlayerTurn ? "??" : `${card.value} ${card.suit}`}
                    </div>
                ))}
            </div>
            
            {/* Gesture field */}
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
            <h2>Your hand: {playerValue}</h2>

            {/* Scoreboard */}
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
            
            {/* Home button */}
            <Link to="/">
                <button className="blackjack-home-button">
                    <img src={homeICON} width="40px" height="40px" />
                </button>
            </Link>

            {/* Help buttons */}
            <button className="blackjack-help-button" onClick={() => setShowHelpModal(true)}>
                <b>?</b>
            </button>
             <button className="blackjack-cheatsheet-button" onClick={() => setShowImageModal(true)}>
                <img src={sheetICON} width="40px" height="40px" />
            </button>

            {/* Modal window (help) */}
            {showHelpModal && (
                <div className="blackjack-modal-overlay" onClick={() => setShowHelpModal(false)}>
                    <div className="blackjack-modal-content" onClick={e => e.stopPropagation()}>
                        <h2>How to Play Blackjack</h2>
                        <p>
                            The aim is to get as close to 21 as possible without going over.
                            <br /> 
                            - "Hit": Get another card.
                            <br />
                            - "Stand": Stop and let the dealer draw.
                            <br />
                            Dealer draws until reaching at least 17. 
                            <br />
                            If you go over 21, you bust and lose.
                            <br />
                            Control the game with buttons, or with gestures.
                            <br />
                            Double tap the gesture field to hit. 
                            <br />
                            Swipe (press mouse, move and release within a short time period) to stand.
                        </p>
                        <button onClick={() => setShowHelpModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Modal cheat sheet */}
            {showImageModal && (
                <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img src={cheatsheet} alt="Cheatsheet" />
                        <button onClick={() => setShowImageModal(false)}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Blackjack;

