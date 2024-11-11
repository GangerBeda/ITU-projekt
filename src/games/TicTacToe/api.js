const BASE_URL = "http://localhost:3001/tictactoe";

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