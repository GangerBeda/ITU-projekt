/*
 * ITU Games Hub
 * @brief Chessboard component for rendering and managing the chessboard interface
 * @author Da Costa Menezes Kristián || xdacos01
 */

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Chess } from 'chess.js';
import './styles.css';

/**
 * Chessboard Component
 * 
 * Renders the chessboard, handles user interactions such as clicking and dragging pieces,
 * manages move selections, and handles pawn promotions. Integrates with the backend
 * to process moves and updates the game state accordingly.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.fen - Forsyth-Edwards Notation string representing the board state
 * @param {Function} props.onMove - Callback function to handle moves
 * @param {string} props.controlType - Type of control ('click' or 'drag')
 * @returns {JSX.Element} The rendered Chessboard component
 */
const Chessboard = ({ fen, onMove, controlType }) => {
    // State to track the currently selected square
    const [selectedSquare, setSelectedSquare] = useState(null);
    // State to track possible moves for the selected piece
    const [possibleMoves, setPossibleMoves] = useState([]);
    // State to control the visibility of the promotion modal
    const [promotionModalVisible, setPromotionModalVisible] = useState(false);

    // State to store the selected promotion piece
    const [promotionPiece, setPromotionPiece] = useState(null); 
    // State to store the move that requires promotion
    const [promotionMove, setPromotionMove] = useState(null);

    // Initialize the chess board based on the provided FEN
    const board = fen ? new Chess(fen).board() : null;

    /**
     * Handles the logic when a square is clicked.
     * 
     * @param {string} square - The identifier of the clicked square (e.g., 'e4')
     */
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
                    // It is a promotion move, show the promotion modal
                    setPromotionModalVisible(true);
                    setPromotionMove(move);
                } else {
                    // Normal move, execute the move
                    onMove(selectedSquare, square);
                }
    
                // Reset selection and possible moves
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
        }
    };

    /**
     * Handles the initiation of dragging a piece.
     * 
     * @param {string} square - The identifier of the square being dragged
     */
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
    
    /**
     * Handles dropping a piece onto a target square.
     * 
     * @param {string} targetSquare - The identifier of the target square
     */
    const handlePieceDrop = (targetSquare) => {
        if (controlType === 'drag' && selectedSquare) {
            const chessInstance = new Chess(fen);
            const moves = chessInstance.moves({ square: selectedSquare, verbose: true });
            const move = moves.find(m => m.to === targetSquare);
    
            if (move && move.promotion) {
                // It is a promotion move, show the promotion modal
                setPromotionModalVisible(true);
                setPromotionMove(move);
            } else {
                // Normal move, execute the move
                onMove(selectedSquare, targetSquare);
            }
    
            // Reset selection and possible moves
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    };

    /**
     * Retrieves possible moves for the selected piece.
     * 
     * @param {Chess} chess - An instance of the Chess game
     * @param {string} square - The identifier of the selected square
     * @returns {string[]} Array of possible target squares
     */
    const getPossibleMovesForSelectedPiece = (chess, square) => {
        const possibleMoves = chess.moves({ square: square, verbose: true });
        return possibleMoves.map(move => move.to);
    };

    /**
     * Handles the selection of a promotion piece.
     * 
     * @param {string} piece - The type of piece selected for promotion (e.g., 'q', 'r', 'b', 'n')
     */
    const handlePromotionSelect = (piece) => {
        if (promotionMove) {
            // Execute the move with the selected promotion piece
            onMove(promotionMove.from, promotionMove.to, piece);
        }
        // Close the promotion modal and reset promotion states
        setPromotionPiece(piece);
        setPromotionModalVisible(false);
        setPromotionMove(null); // Clear the promotion move
    };

    /**
     * Renders a single square on the chessboard.
     * 
     * @param {number} i - The row index (0-7)
     * @param {number} j - The column index (0-7)
     * @returns {JSX.Element} The rendered square
     */
    const renderSquare = (i, j) => {
        const square = `${String.fromCharCode(97 + j)}${8 - i}`; // Convert to algebraic notation (e.g., 'e4')
        const piece = board?.at(i)?.at(j); // Get the piece at the current square
        const isDark = (i + j) % 2 === 1; // Determine if the square is dark
        const isSelected = selectedSquare === square; // Check if the square is selected
        const isHighlighted = possibleMoves.includes(square); // Check if the square is a possible move
        const hasPiece = !!piece; // Check if the square has a piece
        const chessInstance = new Chess(fen); // Initialize chess instance for current state

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

    /**
     * Retrieves the image source for a given piece.
     * 
     * @param {string} color - The color of the piece ('w' or 'b')
     * @param {string} type - The type of the piece ('k', 'q', 'r', 'b', 'n', 'p')
     * @returns {string} The path to the piece image
     */
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
            {/* Chessboard Grid */}
            <div className="chess-board">
                {[...Array(8)].map((_, i) =>
                    [...Array(8)].map((__, j) => renderSquare(i, j))
                )}
            </div>

            {/* Promotion Modal */}
            {promotionModalVisible && (
                <div className="promotion-modal">
                    <h2>Select a piece to promote to:</h2>
                    <div className="promotion-options">
                        {/* Queen Option */}
                        <button onClick={() => handlePromotionSelect('q')}>
                            <img src={getPieceImageSrc(promotionMove.color, 'q')} alt="Queen" />
                        </button>
                        {/* Rook Option */}
                        <button onClick={() => handlePromotionSelect('r')}>
                            <img src={getPieceImageSrc(promotionMove.color, 'r')} alt="Rook" />
                        </button>
                        {/* Bishop Option */}
                        <button onClick={() => handlePromotionSelect('b')}>
                            <img src={getPieceImageSrc(promotionMove.color, 'b')} alt="Bishop" />
                        </button>
                        {/* Knight Option */}
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
