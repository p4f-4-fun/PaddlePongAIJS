'use strict';

localStorage.clear();

// GLOBALS
const dom = document;
const domElementsStack = {
    canvas: dom.querySelector("#game--container__canvas"),
    scoreElement: dom.querySelector(".header--leaderboard__span__score"),
    playerNamePreviewElement: dom.querySelector(".header--playerNameBox__span"),
    gameContainer: dom.querySelector(".game--container"),
    modalElement: dom.querySelector(".game--container__canvasInputModal"),
    modalElementInput: dom.querySelector("#game--container__canvasInputModal__input"),
    modalElementButton: dom.querySelector("#game--container__canvasInputModal__button"),
};
const domCtx = domElementsStack.canvas;
const ctx = domCtx.getContext("2d");
let gameStatus = {
    isPaused: false,
    isStarted: false,
};
const drawProperties = {
    fontFamily: "Tahoma, sans-serif",
    fontColor: "#FFFFFF",
    fontSize: "2.2rem",
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
        if((OCPlayer.playerName.length < 1 || OCPlayer.playerName === OCPlayer.defaultPlayerName ) && this.isPlayerNameInputModalOpen) {
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

            domElementsStack.modalElementButton.removeEventListener("click", OCGameView.playButtonTriggered);
            domElementsStack.modalElement.innerHTML = "";
            
            domElementsStack.gameContainer.removeChild(domElementsStack.modalElement);

        }, this.setTimeoutDuration);
    }


    prepareGameBoard() {
        this.removeViewPlayerNameInputModal();
        
        gameStatus.isStarted = true;
        gameLoop();
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
                
                // if input with name is valid, then update player's name and prepare game board
                OCPlayer.playerName = domElementsStack.modalElementInput.value;

                // prepare game canvas and render game now
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
        this.cursorPosition = {
            //x: 0,
            y: 0,
        }
    }

    updateCursorPosition (Event) {
        //OCCursor.cursorPosition.x = Event.offsetX;
        OCCursor.cursorPosition.y = Event.offsetY;
    }
}

class CPlayer {
    #playerLSData = {};  // Local Storage data for player;
    constructor() {
        this.defaultPlayerName = "Unknown",
        this.#playerLSData = {
            playerName: localStorage.getItem("playerName") || this.defaultPlayerName,
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

class CGame {
    constructor() {
        this.paddles = {
            width: 20,
            height: 100,
            playerStartPositionX: (domCtx.width - 50 /* padding */ - 20 /* paddle width */), 
            AIStartPositionX: (0 /* X-axis (from left) */ + 50 /* padding */),
        };
        this.ball = {
            width: 10,
            height: 10,
            weight: 2.5,
        };
        this.frameLower = 0;
        this.frameUpper = 60;
        this.timeMultiplier = 1.15;
    }
    drawPlayersNames() {
        ctx.fillStyle = `${drawProperties.fontColor}`;
        ctx.font = `${drawProperties.fontSize} ${drawProperties.fontFamily}`;

        // player name draw position
        ctx.fillText(`${OCPlayer.playerName}`, 460, 25);

        // ai name draw position
        ctx.fillText("AI", 414, 25);
    }

    drawPlayerPaddle(playerPaddleX, playerPaddleY) {
        ctx.fillStyle = `${drawProperties.fontColor}`;
        ctx.fillRect(playerPaddleX, playerPaddleY, this.paddles.width, this.paddles.height);
    }

    drawAIPaddle(AIPaddleX, AIPaddleY) {
        ctx.fillStyle = `${drawProperties.fontColor}`;
        ctx.fillRect(AIPaddleX, AIPaddleY, this.paddles.width, this.paddles.height);
    }
    
    drawLineDivider() {
        ctx.fillStyle = `${drawProperties.fontColor}`;
        ctx.fillRect(446, 2, 4, 494);
    }

    drawBall(ballX, ballY) {
        ctx.fillStyle = `${drawProperties.fontColor}`;
        ctx.fillRect(ballX, ballY, this.ball.width, this.ball.height);
    }

    drawUI() {
        this.drawLineDivider();
        this.drawPlayersNames();
        this.drawPlayerPaddle(this.paddles.playerStartPositionX, ( OCCursor.cursorPosition.y - (this.paddles.height/2) ) );
        this.drawAIPaddle(this.paddles.AIStartPositionX, ( OCCursor.cursorPosition.y - (this.paddles.height/2) ));
        
        
        if(this.frameLower < 60) {
            this.drawBall(this.paddles.playerStartPositionX - this.ball.width - 1 /* padding */ - (this.frameLower++*this.timeMultiplier*this.ball.weight), ( OCCursor.cursorPosition.y - (this.ball.height / 2) ));
        }
        else {
            this.drawBall(this.paddles.playerStartPositionX - this.ball.width - 1 /* padding */ - (this.frameUpper--*this.timeMultiplier*this.ball.weight), ( OCCursor.cursorPosition.y - (this.ball.height / 2) ));
            if (this.frameUpper === 0) {
                this.frameLower = 0;
                this.frameUpper = 60;
            }
        }

        console.log(`${this.frameLower}, ${this.frameUpper}`);
        
    }
}
// Objects assignment of classes
const OCPlayer = new CPlayer();
const OCCursor = new CCursor();
const OCGameView = new CGameView();
const OCGame = new CGame();
// /Objects assignment of classes
// /CLASSES

// APP FUNCTION
const gameLoop = () => {
    if (gameStatus.isStarted) {
        ctx.clearRect(0, 0, domCtx.width, domCtx.height);
        OCGame.drawUI();
        requestAnimationFrame(gameLoop);
    }
};
// /APP FUNCTION

// INIT FUNCTION
const init = () => {
    OCGameView.renderPlayerNamePreviewOnce();
    OCGameView.renderGameScoreOnce();
    OCGameView.renderPlayerNameInputModal();
};
// /INIT FUNCTION

// EVENT BINDINGS
domElementsStack.canvas.addEventListener("mousemove", OCCursor.updateCursorPosition);
domElementsStack.modalElementButton.addEventListener("click", OCGameView.playButtonTriggered);

domElementsStack.modalElementInput.addEventListener("input", OCGameView.renderPlayerNamePreview);
/* for older browsers */
domElementsStack.modalElementInput.addEventListener('propertychange', OCGameView.renderPlayerNamePreview);

window.onload = () => init();
// /EVENT BINDINGS


