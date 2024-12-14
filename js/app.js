'use strict';

// GLOBALS
const canvas = document.getElementById("game--container__canvas");
const ctx = canvas.getContext("2d");
// /GLOBALS

// CLASSES
class CGameView {
    constructor() {
        this.renderGameScore();
        this.renderPlayerNameInputModal();
    }

    renderGameScore() {
        const scoreElement = document.querySelector(".leaderboard--span__score");
        const score = OCPlayer.playerScore;
        scoreElement.innerHTML = score;
    }

    renderPlayerNameInputModal() {
        setTimeout(() => {
            const playerName = OCPlayer.playerName;
            
            if(playerName.length < 1 || playerName === "Unknown") {
                const modalElement = document.querySelector(".game--container__canvasInputModal");
                modalElement.classList.toggle("hidden");
            }
        }, 250);
    }
}

class CCursor {
    constructor() {
        this.cursorPositionX = 0;
        this.cursorPositionY = 0;
    }

    updateCursorPosition (e) {
        this.cursorPositionX = e.offsetX;
        this.cursorPositionY = e.offsetY;
    }
}

class CPlayer {
    #playerLSData = {};  // Local Storage data for player;
    constructor() {
        this.#playerLSData = {
            playerName: localStorage.getItem("playerName") || "Unknown",
            playerScore: localStorage.getItem("playerScore") || 0, 
        };
    }

    get playerName() {
        return this.#playerLSData.playerName;
    }
    set playerName(playerName) {
        this.#playerLSData.playerName = playerName;
        localStorage.setItem("playerName", this.#playerLSData.playerName);
    }
    
    get playerScore() {
        return this.#playerLSData.playerScore;
    }
    set playerScore(playerScore) {
        this.#playerLSData.playerScore = playerScore;
        localStorage.setItem("playerScore", this.#playerLSData.playerScore);
    }
}
const OCPlayer = new CPlayer();
const OCCursor = new CCursor();
const OCGameView = new CGameView();
// /CLASSES

// EVENT BINDINGS
canvas.addEventListener("mousemove", OCCursor.updateCursorPosition);
// /EVENT BINDINGS

// APP FUNCTION
const initGameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    //requestAnimationFrame(initGameLoop);
};

initGameLoop();
// /APP FUNCTION
