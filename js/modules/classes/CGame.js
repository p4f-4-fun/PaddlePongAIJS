/**
 * @import
 * 
 */
import { domCtx, ctx, gameStatus, drawProperties, OCPlayer, OCCursor, OCGameView, OCGame } from "./../globals/globals.js";



/**
 * @Class CGame
 * This class represents a game logic
 * 
 */
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
            },
        };

        this.startPongTrigger = false;

        this.ball = {
            width: 10,
            height: 10,
            
            weight: 5,
            
            posXAccelUpThr: 7,
            posXAccelLowThr: 1,

            actualPosX: 0,
            actualPosY: 0,

            detectedCollision: "none",
            lastThrowFrom: null,

            firstBallThrown: false,

            addSpeedX: 1,
            lastSpeedX: 1,

            randDir: "up",
            lastRandDir: null,
        };

        // this.lineDivider = {
        //     width: 4,
        // };

        // this.playerNamesDrawingPosition = {
        //     playerName: {
        //         posX: 460,
        //         posY: 25,
        //     },

        //     AIName: {
        //         posX: 414,
        //         posY: 25,
        //     },
        // };

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

        this.lastRandDir = null;
    }

    // drawPlayersNames() {
    //     ctx.fillStyle = `${drawProperties.UI.color}`;
    //     ctx.font = `${drawProperties.fontRegular.fontWeightBold} ${drawProperties.fontRegular.fontSize} ${drawProperties.fontRegular.fontFamily}`;

    //     // player name draw position
    //     ctx.fillText(`${OCPlayer.playerName}`, this.playerNamesDrawingPosition.playerName.posX, this.playerNamesDrawingPosition.playerName.posY);

    //     // ai name draw position
    //     ctx.fillText("AI", this.playerNamesDrawingPosition.AIName.posX, this.playerNamesDrawingPosition.AIName.posY);
    // }

    drawPlayerPaddle(playerPaddleX, playerPaddleY) {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.fillRect(playerPaddleX, playerPaddleY, this.paddles.width, this.paddles.height);
    }

    drawAIPaddle(AIPaddleX, AIPaddleY) {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.fillRect(AIPaddleX, AIPaddleY, this.paddles.width, this.paddles.height);
    }
    
    // drawLineDivider() {
    //     ctx.fillStyle = `${drawProperties.UI.color}`;

    //     for (let _iiterator = 3; _iiterator < domCtx.height; _iiterator += (2 * this.ball.height) /* margin gap */) {
    //         ctx.fillRect( ( (domCtx.width / 2) - (this.lineDivider.width / 2) ), _iiterator /* margin gap */, this.lineDivider.width, this.ball.height);
    //     }
    // }

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

    getRandomBallDirection(whoTriggered) {
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
    getRandomBallSpeedFactor() {
        return Math.floor( Math.random() * this.ball.posXAccelUpThr ) + this.ball.posXAccelLowThr;
    }

    resetGameRound() {
        this.startPongTrigger = false;
        this.ball.firstBallThrown = false;
        this.ball.lastThrowFrom = null;
        this.ball.detectedCollision = "none";
    }

    detectCollision() {
        // top Wall from Player Side
        if (this.ball.actualPosY <= this.collisionZones.top.yPoint && this.ball.lastThrowFrom === "playerPaddle") {
            this.ball.detectedCollision = "topFromPlayerSide";
        }

        // top Wall from AI Side
        else if (this.ball.actualPosY <= this.collisionZones.top.yPoint && this.ball.lastThrowFrom === "AIPaddle") {
            this.ball.detectedCollision = "topFromAISide";
        }
        
        // bottom Wall
        else if (this.ball.actualPosY >= this.collisionZones.bottom.yPoint && this.ball.lastThrowFrom === "playerPaddle") {
            this.ball.detectedCollision = "bottomFromPlayerSide";
        }
        
        // bottom Wall
        else if (this.ball.actualPosY >= this.collisionZones.bottom.yPoint && this.ball.lastThrowFrom === "AIPaddle") {
            this.ball.detectedCollision = "bottomFromAISide";
        } 

        // Player Paddle
        else if ( this.ball.actualPosX >= (this.getCenterOfElement("paddles").player.fromXPos - (this.paddles.width / 2) - this.ball.width - 1/*-1 = margin gap*/) &&
            this.ball.actualPosY >= this.paddles.player.actualPosY && 
            this.ball.actualPosY <= ( (this.paddles.player.actualPosY + this.paddles.height) - this.ball.height ) ) 
        {
            this.ball.lastThrowFrom = "playerPaddle";
            this.ball.detectedCollision = "playerPaddle";
        }

        // AI Paddle
        else if ( this.ball.actualPosX <= (this.getCenterOfElement("paddles").AI.fromXPos + (this.paddles.width / 2) + 1/*1 = margin gap*/) &&
            this.ball.actualPosY >= this.paddles.AI.actualPosY && 
            this.ball.actualPosY <= ( (this.paddles.AI.actualPosY + this.paddles.height) - this.ball.height ) ) 
        {
            this.ball.lastThrowFrom = "AIPaddle";
            this.ball.detectedCollision = "AIPaddle";
        }

        // left Wall
        else if (this.ball.actualPosX <= this.collisionZones.left.xPoint) {
            OCPlayer.playerScore = 1; // player positive point by collision on AI side
            OCGameView.renderGameScore();
            
            this.resetGameRound();
        }

        // right Wall
        else if (this.ball.actualPosX >= this.collisionZones.right.xPoint) {
            OCPlayer.playerScore = (-1); //player negative point by collision on player side
            OCGameView.renderGameScore();

            this.resetGameRound();
        }

        // no collision detected
        else {
            this.ball.detectedCollision = "none";
        }
        
        // if we catch a last collision we should actually rebound the that ball to next position so
        this.reboundBall(this.ball.detectedCollision);
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
        

        if (collisionZone !== "none" && this.ball.lastSpeedX !== this.ball.addSpeedX) {
            this.ball.addSpeedX = this.getRandomBallSpeedFactor();
            this.ball.lastSpeedX = this.ball.addSpeedX;
        }

        switch (collisionZone) {
            case "topFromPlayerSide":
                this.ball.actualPosX -= this.ball.addSpeedX + this.ball.weight;
                this.ball.actualPosY += this.ball.weight;
                break;

            case "bottomFromPlayerSide":
                this.ball.actualPosX -= this.ball.addSpeedX + this.ball.weight;
                this.ball.actualPosY -= this.ball.weight;
                break;

            case "topFromAISide":
                this.ball.actualPosX += this.ball.addSpeedX + this.ball.weight;
                this.ball.actualPosY += this.ball.weight;
                break;

            case "bottomFromAISide":
                this.ball.actualPosX += this.ball.addSpeedX + this.ball.weight;
                this.ball.actualPosY -= this.ball.weight;
                break;                

            case "playerPaddle":
                this.ball.actualPosX -= this.ball.addSpeedX + this.ball.weight;
                this.ball.actualPosY -= this.ball.weight;
                break;

            case "AIPaddle":
                this.ball.actualPosX += this.ball.addSpeedX + this.ball.weight;
                this.ball.actualPosY += this.ball.weight;
                break;
            
            case "none":
                if (this.ball.lastThrowFrom === "playerPaddle") {
                    this.ball.actualPosX -= this.ball.addSpeedX + this.ball.weight;
                    
                    if (this.ball.lastRandDir !== this.ball.randDir) {
                        this.ball.randDir = this.getRandomBallDirection("playerPaddle").directionDesc;
                        this.ball.lastRandDir = this.ball.randDir;
                    }
                    
                    (this.ball.randDir === "up") ? this.ball.actualPosY -= this.ball.weight : this.ball.actualPosY += this.ball.weight;
                }

                else if (this.ball.lastThrowFrom === "AIPaddle") {                    
                    this.ball.actualPosX += this.ball.addSpeedX + this.ball.weight;
                    
                    if (this.ball.lastRandDir !== this.ball.randDir) {
                        this.ball.randDir = this.getRandomBallDirection("AIPaddle").directionDesc;
                        this.ball.lastRandDir = this.ball.randDir;
                    }
                    
                    (this.ball.randDir === "up") ? this.ball.actualPosY += this.ball.weight : this.ball.actualPosY -= this.ball.weight;
                }

                break;
        }

        this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
    }

    throwBall() {
        if (this.ball.firstBallThrown === false) {
            // at least for the V1 of game, the ball will be always thrown from player side
            this.ball.actualPosX -= this.getRandomBallSpeedFactor() + this.ball.weight;
            
            (this.getRandomBallDirection("playerPaddle").directionDesc === "up") 
                ? this.ball.actualPosY -= this.ball.weight 
                : this.ball.actualPosY += this.ball.weight;
            
            this.drawBall(this.ball.actualPosX, this.ball.actualPosY);

            this.ball.lastThrowFrom = "playerPaddle";

            this.ball.firstBallThrown = true;
        }

        this.detectCollision();
    }

    startGameBall() {
        if(gameStatus.isStarted === true && 
            gameStatus.isPaused === false && 
            this.startPongTrigger === false) 
        {
            this.startPongTrigger = true;
        }
    }

    computeAIPaddlePosYViaBallPosYTracking() {
        const ballActualPosY = this.ball.actualPosY;
        return ballActualPosY;
    }

    isPaddleBoundaryCollision(posYwhenInvoke, whosInvoke) {
        const paddlesPlayerActualPosY = this.paddles.player.actualPosY;
        const paddlesAIActualPosY = this.paddles.AI.actualPosY;
        const _posYwhenInvoke = posYwhenInvoke;
        const _whosInvoke = whosInvoke;
        
        const actualPosY = (_whosInvoke === "player") ? paddlesPlayerActualPosY : paddlesAIActualPosY;
        
        return ( 
            _posYwhenInvoke <= (this.collisionZones.top.yPoint - this.ball.height) || 
            _posYwhenInvoke >= (this.collisionZones.bottom.yPoint + (this.paddles.height / 2) + this.ball.height) 
        )   ? actualPosY 
            : _posYwhenInvoke;
    }

    drawUI() {
        // paddle posititiong player
        this.paddles.player.actualPosY = ( this.isPaddleBoundaryCollision( OCCursor.cursorPosition.y, "player" ) - (this.paddles.height / 2) );
        this.drawPlayerPaddle(this.paddles.player.constPosX, this.paddles.player.actualPosY);

        // paddle posititiong 
        this.paddles.AI.actualPosY = ( this.isPaddleBoundaryCollision( this.computeAIPaddlePosYViaBallPosYTracking(), "AI" ) - (this.paddles.height / 2) );
        this.drawAIPaddle(this.paddles.AI.constPosX, this.paddles.AI.actualPosY);

        // ball positioning 
        if (this.startPongTrigger === false) {
            this.ball.actualPosX = this.paddles.player.constPosX - this.ball.width - 1; /* -1 just for margin gap */
            this.ball.actualPosY = this.getCenterOfElement("paddles").player.fromYPos - this.ball.height / 2;
            
            this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
        }

        else {
            this.throwBall();
        }
    }
}

/**
 * @export
 * 
 */
export default CGame;


