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
            if (selectedSquare) {
                const chessInstance = new Chess(fen);
                const moves = chessInstance.moves({ square: selectedSquare, verbose: true });

                // Find if the move is a promotion
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
            } else {
                setSelectedSquare(square);
                const chessInstance = new Chess(fen);
                const possibleMoves = getPossibleMovesForSelectedPiece(chessInstance, square);
                setPossibleMoves(possibleMoves);
            }
        }
    };

    const handlePieceDrag = (square) => {
        if (controlType === 'drag') {
            setSelectedSquare(square);
            const chessInstance = fen ? new Chess(fen) : null;
            const possibleMoves = getPossibleMovesForSelectedPiece(chessInstance, square);
            setPossibleMoves(possibleMoves);
        }
    };

    const handlePieceDrop = (targetSquare) => {
        if (controlType === 'drag' && selectedSquare) {
            onMove(selectedSquare, targetSquare);
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
                        draggable={controlType === 'drag'}
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
