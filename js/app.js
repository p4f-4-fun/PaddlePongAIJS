'use strict';

// GLOBALS
const dom = document;
const domElementsStack = {
    canvas: dom.querySelector("#game--container__canvas"),
    scoreElement: dom.querySelector(".header--leaderboard__span__score"),
    playerNamePreviewElement: dom.querySelector(".header--playerNameBox__span"),
    modalElement: dom.querySelector(".game--container__canvasInputModal"),
    modalElementInput: dom.querySelector("#game--container__canvasInputModal__input"),
    modalElementButton: dom.querySelector("#game--container__canvasInputModal__button"),
};
const ctx = domElementsStack.canvas.getContext("2d");
let gameStatus = {
    isPaused: false,
    isStarted: false,
};
// /GLOBALS

// CLASSES
class CGameView {
    constructor() {
        this.isPlayerNameInputModalOpen = true;
        this.isPlayButtonTriggered = false;
        this.setTimeoutDuration = 200;
    }

    renderGameScoreOnce() {
        domElementsStack.scoreElement.innerHTML = OCPlayer.playerScore;
        
        setTimeout(() => {
            domElementsStack.scoreElement.classList.remove("hiddenByTransformXLeft");
        }, this.setTimeoutDuration);
    }
    renderGameScore() {
        domElementsStack.scoreElement.innerHTML = OCPlayer.playerScore;
    }

    renderPlayerNamePreviewOnce() {
        domElementsStack.playerNamePreviewElement.innerHTML = OCPlayer.playerName;
    }
    renderPlayerNamePreview() {
        if (OCGameView.isModalElementInputValueValid()) {
            domElementsStack.playerNamePreviewElement.innerHTML = domElementsStack.modalElementInput.value;
        } else {
            domElementsStack.modalElementInput.value = "";

            OCGameView.renderPlayerNamePreviewOnce();
        }
    }

    renderPlayerNameInputModal() {
        if((OCPlayer.playerName.length < 1 || OCPlayer.playerName === "Unknown") && this.isPlayerNameInputModalOpen) {
            domElementsStack.modalElement.classList.remove("hidden");

            setTimeout(() => {
                domElementsStack.modalElement.classList.remove("hiddenByTransformXLeft");
            }, this.setTimeoutDuration);

            // change status of modal element to prevent of make it visible again in rendered View
            this.isPlayerNameInputModalOpen = false;
        }
    }
    removeViewPlayerNameInputModal() {
        domElementsStack.modalElement.classList.add("hiddenByTransformXRight");

        setTimeout(() => {
            domElementsStack.modalElement.classList.add("hidden");
        }, this.setTimeoutDuration);
    }


    prepareGameBoard() {
        this.removeViewPlayerNameInputModal();
    }

    isModalElementInputValueValid() {
        if (!domElementsStack.modalElementInput.validity.valid) {
            return false;
        } 
        else if (domElementsStack.modalElementInput.validity.valueMissing) {
            return false;
        }
        else if (domElementsStack.modalElementInput.value.startsWith(" ")) {
            return false;
        } 
        else {
            return true;
        }
    }
    playButtonTriggered(Event) {
        if(OCGameView.isPlayButtonTriggered === false) {
            Event.preventDefault();
            Event.stopImmediatePropagation();

            if (OCGameView.isModalElementInputValueValid()) {
                // change status of PLAY Button to avoid any (multiple) actions after modal element remove
                OCGameView.isPlayButtonTriggered = true;
                OCGameView.prepareGameBoard();
            }
            else {
                OCGameView.isPlayButtonTriggered = false;
            }
        }
    }
}

class CCursor {
    constructor() {
        this.cursorPositionX = 0;
        this.cursorPositionY = 0;
    }

    updateCursorPosition (Event) {
        this.cursorPositionX = Event.offsetX;
        this.cursorPositionY = Event.offsetY;
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

// APP FUNCTION
const gameLoop = () => {
    if (gameStatus.isStarted) {
        ctx.clearRect(0, 0, domElementsStack.canvas.width, domElementsStack.canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, domElementsStack.canvas.width, domElementsStack.canvas.height);
        console.log("game started but with while");
        requestAnimationFrame(gameLoop);
    }
};
// /APP FUNCTION

// INIT FUNCTION
const init = () => {
    OCGameView.renderPlayerNamePreviewOnce();
    OCGameView.renderGameScoreOnce();
    OCGameView.renderPlayerNameInputModal();
    
    gameLoop();
};
// /INIT FUNCTION

// EVENT BINDINGS
domElementsStack.canvas.addEventListener("mousemove", OCCursor.updateCursorPosition);
domElementsStack.modalElementButton.addEventListener("click", OCGameView.playButtonTriggered);

domElementsStack.modalElementInput.addEventListener("input", OCGameView.renderPlayerNamePreview);
domElementsStack.modalElementInput.addEventListener('propertychange', OCGameView.renderPlayerNamePreview); /* for older browsers */

window.onload = () => init();
// /EVENT BINDINGS


