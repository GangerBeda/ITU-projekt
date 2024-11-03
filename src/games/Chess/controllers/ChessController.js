export class ChessController {
    constructor(model) {
        this.model = model;
    }

    handleMove(start, end) {
        return {
            success: this.model.makeMove(start, end),
            gameState: this.model.getState()
        };
    }

    getPieceColor(piece) {
        return this.model.getPieceColor(piece);
    }

    getGameState() {
        return this.model.getState();
    }

    subscribeToChanges(callback) {
        this.model.addObserver(callback);
    }

    unsubscribeFromChanges(callback) {
        this.model.removeObserver(callback);
    }
}