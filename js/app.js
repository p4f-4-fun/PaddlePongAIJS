'use strict';

// may be in the future this will be removed, because of possibility resetting game without page reloading,
// now only for dev
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
    fontRegular: {
        fontUrl: 'url("assets/fonts/BarlowSemiCondensed-Regular.woff")',
        fontFamily: "BarlowRegular",
        fontColor: "#FFFFFF",
        fontWeight: "400",
        fontWeightBold: "600",
        fontSize: "2.2rem",
    },

    fontWarrning: {
        fontUrl: 'url("assets/fonts/BarlowSemiCondensed-Bold.woff")',
        fontFamily: "BarlowBold",
        fontColor: "#FFFF00",
        fontWeight: "800",
        fontSize: "2.4rem",
    },

    UI: {
        color: "#FFFFFF",
        colorIfWarnning: "#FFFF00",
        ballColor: "#FFFF00",
    },
};
// /GLOBALS

// CLASSES
class CGameView {
    constructor() {
        this.isPlayerNameInputModalOpen = true;
        this.isPlayButtonTriggered = false;
        this.setTimeoutDuration = 200;
        this.textsInGame = {
            paused: "Game paused -- press [SPACE] key to continue",
        };
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
        } 
        
        else {
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

            // unbinding event listeners from dom events
            domElementsStack.modalElementButton.removeEventListener("click", OCGameView.playButtonTriggered);
            domElementsStack.modalElementInput.removeEventListener("input", OCGameView.renderPlayerNamePreview);
            domElementsStack.modalElementInput.removeEventListener('propertychange', OCGameView.renderPlayerNamePreview);

            domElementsStack.modalElement.innerHTML = "";
            
            domElementsStack.gameContainer.removeChild(domElementsStack.modalElement);
        }, this.setTimeoutDuration);

        // cursor none for UX
        //domElementsStack.gameContainer.classList.add("cursorNone");
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
            // [SPACE] key with "32" key number is used to pause/ resume game
            if (Event.which === 32 || Event.keyCode === 32 || Event.key === " " || Event.code === "Space") {
                gameStatus.isPaused = gameStatus.isPaused ? false : true;

                if (gameStatus.isPaused) {
                    ctx.fillStyle = `${drawProperties.fontWarrning.fontColor}`;
                    ctx.font = `${drawProperties.fontWarrning.fontWeight} ${drawProperties.fontWarrning.fontSize} ${drawProperties.fontWarrning.fontFamily}`;
                    
                    const textPositioningOffset = { x: 225, y: 25, };
                    ctx.fillText(`${OCGameView.textsInGame.paused}`, ((domCtx.width / 2) - textPositioningOffset.x), ((domCtx.height / 2) - textPositioningOffset.y));
                }
            }
        }
    }
    
    loadInGameFonts() {
        const fontBarlowRegular = new FontFace(`${drawProperties.fontRegular.fontFamily}`, `${drawProperties.fontRegular.fontUrl}`);
        fontBarlowRegular.load().then(font => dom.fonts.add(font), error => console.error(`Failed to load ${drawProperties.fontRegular.fontFamily} font => ${error.message}`));

        const fontBarlowBold = new FontFace(`${drawProperties.fontWarrning.fontFamily}`, `${drawProperties.fontWarrning.fontUrl}`); 
        fontBarlowBold.load().then(font => dom.fonts.add(font), error => console.error(`Failed to load ${drawProperties.fontWarrning.fontFamily} font => ${error.message}`));
    }
}

class CCursor {
    constructor() {
        this.cursorPosition = {
            y: 0,
        }
    }

    updateCursorPosition (Event) {
        OCCursor.cursorPosition.y = Event.offsetY;
        
        // console log only in debug mode
        //console.log(`${Event.offsetX} - ${Event.offsetY}`);
    }
}

class CPlayer {
    #playerLSData = {};  /* Local Storage data for player */
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
        this.#playerLSData.playerScore += parseInt(playerScore);
        localStorage.setItem("playerScore", this.#playerLSData.playerScore);
    }
}

class CGame {
    constructor() {
        this.paddles = {
            width: 20,
            height: 100,

            player: {
                constPosX: (domCtx.width - 50 /* margin gap  */ - 20 /* paddle width */),
                actualPosY: 0,
            },

            AI: {
                constPosX: (0 /* X-axis (from left) */ + 50 /* margin gap */),
                actualPosY: 0,
                initialRandomPosY: Math.floor( Math.random() * (domCtx.height - 100 /* <-- paddle height */)),
            },
        };
        this.startGameBallTriggered = {
            isTriggered: false,
            isDone: false,
        };
        this.ball = {
            width: 10,
            height: 10,
            
            weight: 4,
            
            posXAccelUpThr: 7,
            posXAccelLowThr: 1,

            actualPosX: 0,
            actualPosY: 0,

            lastCollision: null,

            firstBallThrown: false,
        };
        this.lineDivider = {
            width: 4,
            halfWidth: 2,
        };
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
        this.collisionZones = {
            top: {
                yPoint: 1 /* NOT 0, because of design margin gap 1px in canvas box */,
            },

            bottom: {
                yPoint: domCtx.height - this.ball.height,
            },

            left: {
                xPoint: ( this.getCenterOfElement("paddles").AI.fromXPos + (this.paddles.width / 2) ) - this.ball.width,
            },

            right: {
                xPoint: ( this.getCenterOfElement("paddles").player.fromXPos - (this.paddles.width / 2) ) + this.ball.width,
            },
        };
    }

    drawPlayersNames() {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.font = `${drawProperties.fontRegular.fontWeightBold} ${drawProperties.fontRegular.fontSize} ${drawProperties.fontRegular.fontFamily}`;

        // player name draw position
        ctx.fillText(`${OCPlayer.playerName}`, this.playerNamesDrawingPosition.playerName.posX, this.playerNamesDrawingPosition.playerName.posY);

        // ai name draw position
        ctx.fillText("AI", this.playerNamesDrawingPosition.AIName.posX, this.playerNamesDrawingPosition.AIName.posY);
    }

    drawPlayerPaddle(playerPaddleX, playerPaddleY) {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.fillRect(playerPaddleX, playerPaddleY, this.paddles.width, this.paddles.height);
    }

    drawAIPaddle(AIPaddleX, AIPaddleY) {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.fillRect(AIPaddleX, AIPaddleY, this.paddles.width, this.paddles.height);
    }
    
    drawLineDivider() {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.fillRect((domCtx.width / 2 - this.lineDivider.halfWidth), 2, this.lineDivider.width, domCtx.height);
    }

    drawBall(ballX, ballY) {
        ctx.fillStyle = `${drawProperties.UI.ballColor}`;
        ctx.fillRect(ballX, ballY, this.ball.width, this.ball.height);
    }
    
    getCenterOfElement(element) {
        switch(element) {
            case "ball":
                return {
                    fromXPos: this.ball.actualPosX + (this.ball.width / 2),
                    fromYPos: this.ball.actualPosY + (this.ball.height / 2),
                };

            case "paddles":
                return {
                    player: {
                        fromXPos: this.paddles.player.constPosX + (this.paddles.width / 2),
                        fromYPos: this.paddles.player.actualPosY + (this.paddles.height / 2),
                    },

                    AI: {
                        fromXPos: this.paddles.AI.constPosX + (this.paddles.width / 2),
                        fromYPos: this.paddles.AI.actualPosY + (this.paddles.height / 2),
                    },
                };

            default:
                return 0;
        }
    }

    randBallDirection(whoTriggered) {
        // 0 = left, 1 = right
        // Player side: left = [DOWN], right = [UP]
        // ----AI side: left =   [UP], right = [DOWN]
        const rand = Math.random() < 0.5 ? 0 : 1;

        if (whoTriggered === "playerPaddle") {
            return {
                directionDesc: rand === 0 ? "down" : "up",
            };
        }

        else if (whoTriggered === "AIPaddle") {
            return {
                directionDesc: rand === 0 ? "up" : "down",
            };
        }

        else {
            return Math.random() < 0.5 ? 0 : 1;
        }
    }

    resetGameRound() {
        this.lastCollision = null;
        this.startGameBallTriggered.isTriggered = false;
        this.ball.firstBallThrown = false;
    }

    detectCollision() {
        // top Wall
        if (this.ball.actualPosY <= this.collisionZones.top.yPoint) {
            this.lastCollision = "top";
        }
        
        // bottom Wall
        if (this.ball.actualPosY >= this.collisionZones.bottom.yPoint) {
            this.lastCollision = "bottom";
        } 

        // Player Paddle
        if ( this.ball.actualPosX === (this.getCenterOfElement("paddles").player.fromXPos - (this.paddles.width / 2) - this.ball.width - 1/*-1 = margin gap*/) &&
            this.ball.actualPosY >= this.paddles.player.actualPosY && 
            this.ball.actualPosY <= ( (this.paddles.player.actualPosY + this.paddles.player.height) - this.ball.height ) ) 
        {
            this.lastCollision = "playerPaddle";
            console.log(this.lastCollision);
        }

        // AI Paddle
        if ( this.ball.actualPosX === (this.getCenterOfElement("paddles").AI.fromXPos + (this.paddles.width / 2) + 1/*-1 = margin gap*/) &&
            this.ball.actualPosY >= this.paddles.AI.actualPosY && 
            this.ball.actualPosY <= ( (this.paddles.AI.actualPosY + this.paddles.AI.height) - this.ball.height ) ) 
        {
            this.lastCollision = "AIPaddle";
            console.log(this.lastCollision);
        }

        // left Wall
        if (this.ball.actualPosX <= this.collisionZones.left.xPoint) {
            OCPlayer.playerScore = 1; // player positive point by collision on AI side
            OCGameView.renderGameScore();

            this.resetGameRound();
        }
        
        // right Wall
        if (this.ball.actualPosX >= this.collisionZones.right.xPoint) {
            OCPlayer.playerScore = (-1); //player negative point by collision on player side
            OCGameView.renderGameScore();

            this.resetGameRound();
        }

        this.reboundBall(this.lastCollision);
    }

    reboundBall(collisionZone) {
        /**
         * collision situations and positions change when it happens
         * Ball from Player side
         * ----------------------
         * Top wall: x--, y++
         * Bottom wall: x--, y--
         * ----------------------
         * ----------------------
         * Ball from AI side
         * ----------------------
         * Top wall: x++, y++
         * Bottom wall: x++, y--
         * 
         */

        switch (collisionZone) {
            case "top":
                this.ball.actualPosX -= this.ball.weight;
                this.ball.actualPosY += this.ball.weight;

                this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
                break;

            case "bottom":
                this.ball.actualPosX -= this.ball.weight;
                this.ball.actualPosY -= this.ball.weight;

                this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
                break;

            case "playerPaddle":
                this.ball.actualPosX -= this.ball.weight;

                // (this.randBallDirection("playerPaddle").directionDesc === "up") 
                //     ? this.ball.actualPosY -= this.ball.weight 
                //     : this.ball.actualPosY += this.ball.weight;

                this.ball.actualPosY -= this.ball.weight

                this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
                break;

            case "AIPaddle":
                this.ball.actualPosX += this.ball.weight;

                // (this.randBallDirection("AIPaddle").directionDesc === "up") 
                //     ? this.ball.actualPosY += this.ball.weight 
                //     : this.ball.actualPosY -= this.ball.weight;

                this.ball.actualPosY += this.ball.weight

                this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
                break;
            default: 
                this.ball.actualPosX -= 6 + this.ball.weight;
                this.ball.actualPosY -= this.ball.weight
                
                this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
        }
    }

    firstThrowGameBall() {
        if (this.ball.firstBallThrown === false) {
            // at least for the V1 of game, the ball will be always thrown from player side
            this.ball.actualPosX -= ( Math.floor( Math.random() * this.ball.posXAccelUpThr ) + this.ball.posXAccelLowThr ) + this.ball.weight;
            
            (this.randBallDirection("playerPaddle").directionDesc === "up") 
                ? this.ball.actualPosY -= this.ball.weight 
                : this.ball.actualPosY += this.ball.weight;
            
            this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
        }

        this.ball.firstBallThrown = true;
        this.detectCollision();
    }

    startGameBall(Event) {
        if(gameStatus.isStarted === true && 
            gameStatus.isPaused === false && 
            OCGame.startGameBallTriggered.isTriggered === false) 
        {
            OCGame.startGameBallTriggered.isTriggered = true;
        }
    }

    computeAIPaddlePosYViaBallPosYTracking() {
        return this.ball.actualPosY - ((this.paddles.height / 2) + (this.ball.height / 2));
    }

    drawUI() {
        // paddle posititiong player
        this.paddles.player.actualPosY = OCCursor.cursorPosition.y;
        this.drawPlayerPaddle(this.paddles.player.constPosX, this.paddles.player.actualPosY);

        // paddle posititiong 
        this.paddles.AI.actualPosY = this.computeAIPaddlePosYViaBallPosYTracking();
        this.drawAIPaddle(this.paddles.AI.constPosX, this.paddles.AI.actualPosY);

        // ball positioning 
        if (this.startGameBallTriggered.isTriggered === false) {
            this.ball.actualPosX = this.paddles.player.constPosX - this.ball.width - 1; /* -1 just for margin gap */
            this.ball.actualPosY = this.getCenterOfElement("paddles").player.fromYPos - this.ball.height / 2;
            
            this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
        }

        else {
            this.firstThrowGameBall();
        }
    }
}

//-- Objects assignment of classes
const OCPlayer = new CPlayer();
const OCCursor = new CCursor();
const OCGameView = new CGameView();
const OCGame = new CGame();
//-- /Objects assignment of classes
// /CLASSES

// INIT FUNCTION
const init = () => {
    OCGameView.renderPlayerNamePreviewOnce();
    OCGameView.renderPlayerNameInputModal();
    
    OCGameView.renderGameScoreOnce();

    OCGameView.loadInGameFonts();

    //-- EVENT BINDINGS
    domElementsStack.canvas.addEventListener("mousemove", OCCursor.updateCursorPosition);
    domElementsStack.canvas.addEventListener("click", OCGame.startGameBall);

    domElementsStack.modalElementButton.addEventListener("click", OCGameView.playButtonTriggered);
    domElementsStack.modalElementInput.addEventListener("input", OCGameView.renderPlayerNamePreview);
    //-- for older browsers
    domElementsStack.modalElementInput.addEventListener('propertychange', OCGameView.renderPlayerNamePreview);

    window.addEventListener("keydown", OCGameView.isGamePaused);
    //-- /EVENT BINDINGS
};
window.onload = () => init();
// /INIT FUNCTION

// MAIN GAME APP FUNCTION
const gameLoop = () => {
    if (gameStatus.isStarted) {
        if(gameStatus.isPaused === false) {
            ctx.clearRect(0, 0, domCtx.width, domCtx.height);

            OCGame.drawUI();
        }

        requestAnimationFrame(gameLoop);
    }
};
// /MAIN GAME APP FUNCTION


