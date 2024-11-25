import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Chess } from 'chess.js';
import './styles.css';

const Chessboard = ({ fen, onMove, controlType }) => {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [promotionModalVisible, setPromotionModalVisible] = useState(false);

    const [promotionPiece, setPromotionPiece] = useState(null); 
    const [promotionMove, setPromotionMove] = useState(null);

    const board = fen ? new Chess(fen).board() : null;

    const handleSquareClick = (square) => {
        if (controlType === 'click') {
            const chessInstance = new Chess(fen);
    
            if (!selectedSquare) {
                // No square is selected yet, check if the clicked square has a piece of the current player
                const piece = chessInstance.get(square);
                if (piece && piece.color === chessInstance.turn()) {
                    // Piece belongs to the current player, so allow selection
                    setSelectedSquare(square);
                    const possibleMoves = getPossibleMovesForSelectedPiece(chessInstance, square);
                    setPossibleMoves(possibleMoves);
                }
            } else {
                // A square is already selected, process the move
                const moves = chessInstance.moves({ square: selectedSquare, verbose: true });
                const move = moves.find(m => m.to === square);
    
                if (move && move.promotion) {
                    // It is a promotion move
                    setPromotionModalVisible(true);
                    setPromotionMove(move);
                } else {
                    // Normal move
                    onMove(selectedSquare, square);
                }
    
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
        }
    };

    const handlePieceDrag = (square) => {
        if (controlType === 'drag') {
            const chessInstance = fen ? new Chess(fen) : null;
            const piece = chessInstance.get(square);
    
            if (piece && piece.color === chessInstance.turn()) {
                // Piece belongs to the current player, so allow dragging
                setSelectedSquare(square);
                const possibleMoves = getPossibleMovesForSelectedPiece(chessInstance, square);
                setPossibleMoves(possibleMoves);
            } else {
                // Don't allow dragging if it's not the current player's piece
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
        }
    };
    
    const handlePieceDrop = (targetSquare) => {
        if (controlType === 'drag' && selectedSquare) {
            const chessInstance = new Chess(fen);
            const moves = chessInstance.moves({ square: selectedSquare, verbose: true });
            const move = moves.find(m => m.to === targetSquare);
    
            if (move && move.promotion) {
                // It is a promotion move
                setPromotionModalVisible(true);
                setPromotionMove(move);
            } else {
                // Normal move
                onMove(selectedSquare, targetSquare);
            }
    
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    };

    const getPossibleMovesForSelectedPiece = (chess, square) => {
        const possibleMoves = chess.moves({ square: square, verbose: true });
        return possibleMoves.map(move => move.to);
    };

    const handlePromotionSelect = (piece) => {

        if (promotionMove) {
            // Update the promotion move with the selected piece
            onMove(promotionMove.from, promotionMove.to, piece);

        }
        setPromotionPiece(piece);
        setPromotionModalVisible(false);
        setPromotionMove(null); // Clear the promotion move
    };

    const renderSquare = (i, j) => {
        const square = `${String.fromCharCode(97 + j)}${8 - i}`;
        const piece = board?.at(i)?.at(j);
        const isDark = (i + j) % 2 === 1;
        const isSelected = selectedSquare === square;
        const isHighlighted = possibleMoves.includes(square);
        const hasPiece = !!piece;
        const chessInstance = new Chess(fen);

        return (
            <div
                key={square}
                className={`chess-square 
                    ${isDark ? 'chess-dark' : 'chess-light'} 
                    ${isSelected ? 'chess-selected' : ''} 
                    ${isHighlighted ? (hasPiece ? 'chess-with-piece' : 'chess-highlighted') : ''}`}
                onClick={() => handleSquareClick(square)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handlePieceDrop(square)}
            >
                {piece && (
                    <img
                        src={getPieceImageSrc(piece.color, piece.type)}
                        alt={`Piece ${piece.type}`}
                        className="chess-piece"
                        draggable={controlType === 'drag' && piece.color === chessInstance.turn()} // Only allow drag for the current player's pieces
                        onDragStart={() => handlePieceDrag(square)}
                    />
                )}
            </div>
        );
    };


    const getPieceImageSrc = (color, type) => {
        const pieces = {
            k: color === 'w' ? require('../assets/images/chess_pieces/white_king.png') : require('../assets/images/chess_pieces/black_king.png'),
            q: color === 'w' ? require('../assets/images/chess_pieces/white_queen.png') : require('../assets/images/chess_pieces/black_queen.png'),
            r: color === 'w' ? require('../assets/images/chess_pieces/white_rook.png') : require('../assets/images/chess_pieces/black_rook.png'),
            b: color === 'w' ? require('../assets/images/chess_pieces/white_bishop.png') : require('../assets/images/chess_pieces/black_bishop.png'),
            n: color === 'w' ? require('../assets/images/chess_pieces/white_knight.png') : require('../assets/images/chess_pieces/black_knight.png'),
            p: color === 'w' ? require('../assets/images/chess_pieces/white_pawn.png') : require('../assets/images/chess_pieces/black_pawn.png'),
        };
        return pieces[type];
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="chess-board">
                {[...Array(8)].map((_, i) =>
                    [...Array(8)].map((__, j) => renderSquare(i, j))
                )}
            </div>

            {promotionModalVisible && (
                <div className="promotion-modal">
                    <h2>Select a piece to promote to:</h2>
                    <div className="promotion-options">
                        {/* Queen */}
                        <button onClick={() => handlePromotionSelect('q')}>
                            <img src={getPieceImageSrc(promotionMove.color, 'q')} alt="Queen" />
                        </button>
                        {/* Rook */}
                        <button onClick={() => handlePromotionSelect('r')}>
                            <img src={getPieceImageSrc(promotionMove.color, 'r')} alt="Rook" />
                        </button>
                        {/* Bishop */}
                        <button onClick={() => handlePromotionSelect('b')}>
                            <img src={getPieceImageSrc(promotionMove.color, 'b')} alt="Bishop" />
                        </button>
                        {/* Knight */}
                        <button onClick={() => handlePromotionSelect('n')}>
                            <img src={getPieceImageSrc(promotionMove.color, 'n')} alt="Knight" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chessboard;
