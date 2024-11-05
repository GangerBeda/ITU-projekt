// FourInARowController.js
export class FourInARowController {
    constructor(model) {
        this.model = model;
    }

    handleMove(column) {
        return {
            success: this.model.makeMove(column),
            gameState: this.model.getState()
        };
    }

    getGameState() {
        return this.model.getState();
    }

    subscribeToChanges(callback) {
        this.model.addObserver(callback);
    }
}
