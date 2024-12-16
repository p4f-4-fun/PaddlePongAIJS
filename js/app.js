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
    fontAlertColor: "#FF0000",
    
    fontWeight: "400",
    fontWeightAlert: "700",

    fontSize: "2.2rem",
    fontSizeAlert: "2.4rem",

    elementsUIColor: "#FFFFFF",
    elementsUIColorNoticeable: "#FFFF00",
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

    isGamePaused(Event) {
        if (gameStatus.isStarted) {
            if (Event.which === 32 || Event.keyCode === 32 || Event.key === " " || Event.code === "Space") {
                gameStatus.isPaused = gameStatus.isPaused ? false : true;

                if (gameStatus.isPaused) {
                    ctx.fillStyle = `${drawProperties.fontAlertColor}`;
                    ctx.font = `${drawProperties.fontWeightAlert} ${drawProperties.fontSizeAlert} ${drawProperties.fontFamily}`;
            
                    // ai name draw position
                    ctx.fillText("Game is paused - press [SPACE] to play", ((domCtx.width / 2) - 225), ((domCtx.height / 2) - 25));
                }
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

            player: {
                startPosX: (domCtx.width - 50 /* padding */ - 20 /* paddle width */),
                actualPosY: 0,
            },

            AI: {
                startPosX: (0 /* X-axis (from left) */ + 50 /* padding */),
                actualPosY: 0,
            },
        };
        this.ball = {
            width: 10,
            height: 10,
            weight: 2.5,
            actualPosX: 0,
            actualPosY: 0,
        };
        this.lineDivider = {
            width: 4,
            halfWidth: 2,
        };
        this.velocity = 1.15;
        this.playerNamesDrawingPosition = {
            playerName: {
                posX: 460,
                posY: 25,
            },
            AIName: {
                posX: 414,
                posY: 25,
            }
        };
    }
    drawPlayersNames() {
        ctx.fillStyle = `${drawProperties.elementsUIColor}`;
        ctx.font = `${drawProperties.fontWeight} ${drawProperties.fontSize} ${drawProperties.fontFamily}`;

        // player name draw position
        ctx.fillText(`${OCPlayer.playerName}`, this.playerNamesDrawingPosition.playerName.posX, this.playerNamesDrawingPosition.playerName.posY);

        // ai name draw position
        ctx.fillText("AI", this.playerNamesDrawingPosition.AIName.posX, this.playerNamesDrawingPosition.AIName.posY);
    }

    drawPlayerPaddle(playerPaddleX, playerPaddleY) {
        ctx.fillStyle = `${drawProperties.elementsUIColor}`;
        ctx.fillRect(playerPaddleX, playerPaddleY, this.paddles.width, this.paddles.height);
    }

    drawAIPaddle(AIPaddleX, AIPaddleY) {
        ctx.fillStyle = `${drawProperties.elementsUIColor}`;
        ctx.fillRect(AIPaddleX, AIPaddleY, this.paddles.width, this.paddles.height);
    }
    
    drawLineDivider() {
        ctx.fillStyle = `${drawProperties.elementsUIColor}`;
        ctx.fillRect((domCtx.width / 2 - this.lineDivider.halfWidth), 2, this.lineDivider.width, domCtx.height);
    }

    drawBall(ballX, ballY) {
        ctx.fillStyle = `${drawProperties.elementsUIColor}`;
        ctx.fillRect(ballX, ballY, this.ball.width, this.ball.height);
    }
    
    getCenterOfElement(element) {
        switch(element) {
            case "ball":
                return {
                    x: this.ball.width / 2,
                    y: this.ball.height / 2,
                };
            case "paddle":
                return {
                    x: this.paddles.width / 2,
                    y: this.paddles.height / 2,
                };
            default:
                return 0;
        }
    }

    drawUI() {
        this.drawLineDivider();
        this.drawPlayersNames();

        // paddle posititiong player
        this.paddles.player.actualPosY = ( OCCursor.cursorPosition.y - (this.paddles.height / 2) );
        this.drawPlayerPaddle(this.paddles.player.startPosX, this.paddles.player.actualPosY);

        // paddle posititiong AI
        this.paddles.AI.actualPosY = this.paddles.player.actualPosY; 
        this.drawAIPaddle(this.paddles.AI.startPosX, this.paddles.AI.actualPosY);

        // ball positioning 
        this.ball.actualPosX = this.paddles.player.startPosX;
        this.ball.actualPosY = this.paddles.player.actualPosY;
        this.drawBall(this.ball.actualPosX, this.ball.actualPosY);  
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
        if(gameStatus.isPaused === false) {
            ctx.clearRect(0, 0, domCtx.width, domCtx.height);
            OCGame.drawUI();
        }
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

window.addEventListener("keydown", OCGameView.isGamePaused);
window.onload = () => init();
// /EVENT BINDINGS


