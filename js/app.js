'use strict';

// GLOBALS
const domElementsStack = {
    canvas: document.getElementById("game--container__canvas"),
    scoreElement: document.querySelector(".header--leaderboard__span__score"),
    modalElement: document.querySelector(".game--container__canvasInputModal"),
};
const ctx = domElementsStack.canvas.getContext("2d");
// /GLOBALS

// CLASSES
class CGameView {
    constructor() {
        this.isPlayerNameInputModalOpen = true;
        this.renderGameScore();
        this.renderPlayerNameInputModal();
    }

    renderGameScore() {
        const scoreElement = domElementsStack.scoreElement;
        const score = OCPlayer.playerScore;
        scoreElement.innerHTML = score;
    }

    renderPlayerNameInputModal() {
        const playerName = OCPlayer.playerName;
            
        if((playerName.length < 1 || playerName === "Unknown") && this.isPlayerNameInputModalOpen) {
            const modalElement = domElementsStack.modalElement;
            modalElement.classList.toggle("hidden");
        }
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
domElementsStack.canvas.addEventListener("mousemove", OCCursor.updateCursorPosition);
// /EVENT BINDINGS

// APP FUNCTION
const initGameLoop = () => {
    ctx.clearRect(0, 0, domElementsStack.canvas.width, domElementsStack.canvas.height);
    
    
    //requestAnimationFrame(initGameLoop);
};

initGameLoop();
// /APP FUNCTION
