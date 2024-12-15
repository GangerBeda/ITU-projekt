const BASE_URL = "http://localhost:3001/tictactoe";


// get new classic game from backend
export const createClassicGame = async () => {
    try {
        const response = await fetch(`${BASE_URL}/new-classic-game`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error("Failed to create new Classic game");
        }
        return response.json();
    } catch (error) {
        console.error("Error creating Classic game", error);
    }
};

// make a move in classic game
// pass cellIndex to backend to validate move
export const makeClassicMove = async (cellIndex) => {
    try {
        const response = await fetch(`${BASE_URL}/classic-game/move`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cellIndex }),
        });
        if (!response.ok) {
            throw new Error("Failed to make a Classic move");
        }
        return response.json();
    } catch (error) {
        console.error("Error making Classic move", error);
    }
};

// get new ultimate game from backend
export const createUltimateGame = async () => {
    try {
        const response = await fetch(`${BASE_URL}/new-ultimate-game`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error("Failed to create new Ultimate game");
        }
        return response.json();
    } catch (error) {
        console.error("Error creating Ultimate game", error);
    }
};

// make a move in ultimate game
// pass subBoardIndex and cellIndex to backend to validate move
// pass blindMode to backend to toggle blind mode
export const makeUltimateMove = async (subBoardIndex, cellIndex, blindMode) => {
    try {
        blindMode = blindMode === null ? null : blindMode;
        const response = await fetch(`${BASE_URL}/ultimate-game/move`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subBoardIndex, cellIndex, blindMode }),
        });

        if (!response.ok) {
            throw new Error("Failed to make move or toggle blind mode");
        }
        return response.json();
    } catch (error) {
        console.error("Error in makeUltimateMove", error);
    }
};

// get score from backend
export const getScore = async () => {
    try {
        const response = await fetch(`${BASE_URL}/get-score`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error("Failed to get the score");
        }
        return response.json();
    } catch (error) {
        console.error("Error getting score", error);
    }
};

// set score in backend
// used for resetting score
export const setScore = async (player, wins) => {
    try {
        const response = await fetch(`${BASE_URL}/set-score`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ player, wins }),
        });
        if (!response.ok) {
            throw new Error("Failed to set the score");
        }
        return response.json();
    } catch (error) {
        console.error("Error setting score", error);
    }
};