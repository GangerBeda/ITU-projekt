import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Chess } from 'chess.js';
import './styles.css';

const Chessboard = ({ fen, onMove, controlType }) => {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const board = fen ? new Chess(fen).board() : null;

    const handleSquareClick = (square) => {
        if (controlType === 'click') {
            if (selectedSquare) {
                onMove(selectedSquare, square);
                setSelectedSquare(null);
                setPossibleMoves([]);

            } else {
                setSelectedSquare(square);
                const chessInstance = fen ? new Chess(fen) : null;
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

        const cleanedMoves = possibleMoves.map(move => move.to);

        return cleanedMoves;
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
                    ${isHighlighted ? (hasPiece ?  'chess-with-piece' : 'chess-highlighted') : ''}`}
                onClick={() => handleSquareClick(square)}
                onDragOver={(e) => e.preventDefault()}  // Allow drop
                onDrop={() => handlePieceDrop(square)}  // Handles drag-and-drop moves
            >
                {piece && (
                    <img
                        src={getPieceImageSrc(piece)}
                        alt={`Piece ${piece.type}`}
                        className="chess-piece"
                        draggable={controlType === 'drag'}  // Enable drag if controlType is 'drag'
                        onDragStart={() => handlePieceDrag(square)}  // Trigger drag start event    
                    />
                )}
            </div>
        );
    };

    const getPieceImageSrc = (piece) => {
        const pieces = {
            k: piece.color === 'w' ? require('../assets/images/chess_pieces/white_king.png') : require('../assets/images/chess_pieces/black_king.png'),
            q: piece.color === 'w' ? require('../assets/images/chess_pieces/white_queen.png') : require('../assets/images/chess_pieces/black_queen.png'),
            r: piece.color === 'w' ? require('../assets/images/chess_pieces/white_rook.png') : require('../assets/images/chess_pieces/black_rook.png'),
            b: piece.color === 'w' ? require('../assets/images/chess_pieces/white_bishop.png') : require('../assets/images/chess_pieces/black_bishop.png'),
            n: piece.color === 'w' ? require('../assets/images/chess_pieces/white_knight.png') : require('../assets/images/chess_pieces/black_knight.png'),
            p: piece.color === 'w' ? require('../assets/images/chess_pieces/white_pawn.png') : require('../assets/images/chess_pieces/black_pawn.png'),
        };
        return pieces[piece.type];
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="chess-board">
            {[...Array(8)].map((_, i) =>
                [...Array(8)].map((__, j) => renderSquare(i, j))
            )}
        </div>
        </div>
    );
};

export default Chessboard;
