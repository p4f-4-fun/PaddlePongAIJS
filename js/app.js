'use strict';

// GLOBALS
const dom = document;
const domElementsStack = {
    canvas: dom.querySelector("#game--container__canvas"),
    scoreElement: dom.querySelector(".header--leaderboard__span__score"),
    modalElement: dom.querySelector(".game--container__canvasInputModal"),
    modalElementInput: dom.querySelector("#game--container__canvasInputModal__input"),
    modalElementButton: dom.querySelector("#game--container__canvasInputModal__button"),
};
const ctx = domElementsStack.canvas.getContext("2d");
// /GLOBALS

// CLASSES
class CGameView {
    constructor() {
        this.isPlayerNameInputModalOpen = true;
        this.isPlayButtonTriggered = false;
        this.setTimeoutDuration = 200;
    }

    renderGameScore() {
        const scoreElement = domElementsStack.scoreElement;
        const score = OCPlayer.playerScore;
        scoreElement.innerHTML = score;
        
        setTimeout(() => {
            scoreElement.classList.remove("hiddenByTransformXLeft");
        }, this.setTimeoutDuration);
    }

    renderPlayerNameInputModal() {
        const playerName = OCPlayer.playerName;

        if((playerName.length < 1 || playerName === "Unknown") && this.isPlayerNameInputModalOpen) {
            const modalElement = domElementsStack.modalElement;
            modalElement.classList.remove("hidden");

            setTimeout(() => {
                modalElement.classList.remove("hiddenByTransformXLeft");
            }, this.setTimeoutDuration);

            // change status of modal element to prevent of make it visible again in rendered View
            this.isPlayerNameInputModalOpen = false;
        }
    }
    removeViewPlayerNameInputModal() {
        const modalElement = domElementsStack.modalElement;
        modalElement.classList.add("hiddenByTransformXRight");

        setTimeout(() => {
            modalElement.classList.add("hidden");
        }, this.setTimeoutDuration);
    }


    prepareGameBoard() {
        console.log("render game board");
        this.removeViewPlayerNameInputModal();
    }

    playButtonTriggered(e) {
        if(!this.isPlayButtonTriggered) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            OCGameView.prepareGameBoard();
        }
        this.isPlayButtonTriggered = true;
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

// INIT FUNCTION
const init = () => {
    OCGameView.renderGameScore();
    OCGameView.renderPlayerNameInputModal();
};
// /INIT FUNCTION

// EVENT BINDINGS
domElementsStack.canvas.addEventListener("mousemove", OCCursor.updateCursorPosition);
domElementsStack.modalElementButton.addEventListener("click", OCGameView.playButtonTriggered);
window.onload = () => init();
// /EVENT BINDINGS

// APP FUNCTION
const gameLoop = () => {
    ctx.clearRect(0, 0, domElementsStack.canvas.width, domElementsStack.canvas.height);
    
    
    //requestAnimationFrame(initGameLoop);
};
gameLoop();
// /APP FUNCTION
