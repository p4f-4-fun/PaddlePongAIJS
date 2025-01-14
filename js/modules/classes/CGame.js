/**
 * @import
 * 
 */
import { ctx, domCtx, drawProperties, gameStatus, OCCursor, OCGameView, OCPlayer } from "./../globals/globals.js";



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

            detectedCollision: null,

            previousCollision: null,

            lastThrowFrom: null,

            firstBallThrown: false,

            addSpeedX: 1,

            randDir: "up",
        };

        /**
         * @property isPossibleToWin
         * Property to determine if the game is possible to win
         * if TRUE = AI Paddle will have additional random value which help player to achieve points in the
         * because the AI Paddle will no track the ball in correct way
         * if FALSE = AI Paddle will track the ball in correct way, impossible to win and achieve points
         */
        this.isPossibleToWin = false;

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

    drawPlayerPaddle(playerPaddleX, playerPaddleY) {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.fillRect(playerPaddleX, playerPaddleY, this.paddles.width, this.paddles.height);
    }

    drawAIPaddle(AIPaddleX, AIPaddleY) {
        ctx.fillStyle = `${drawProperties.UI.color}`;
        ctx.fillRect(AIPaddleX, AIPaddleY, this.paddles.width, this.paddles.height);
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

    getRandomBallDirection(whoTriggered) {
        // 0 = left, 1 = right
        // Player side: left = [DOWN], right = [UP]
        // ----AI side: left =   [UP], right = [DOWN]
        const rand = Math.random() < 0.5 ? 0 : 1;

        if (whoTriggered === "playerPaddle") {
            return { directionDesc: rand === 0 ? "down" : "up", };
        } else if (whoTriggered === "AIPaddle") {
            return { directionDesc: rand === 0 ? "up" : "down", };
        } else {
            return Math.random() < 0.5 ? 0 : 1;
        }
    }
    getRandomBallSpeedFactor() {
        return Math.floor( Math.random() * this.ball.posXAccelUpThr ) + this.ball.posXAccelLowThr;
    }

    resetGameRound() {
        /**
         * reset the game round 
         * with values from @this Class constructor
         */

        this.startPongTrigger = false;
        this.ball.detectedCollision = null;
        this.ball.previousCollision = null;
        this.ball.lastThrowFrom = null;
        this.ball.firstBallThrown = false;
        this.ball.addSpeedX = 1;
        this.ball.randDir = "up";
    }

    detectCollision() {
        // store previous collision
        this.ball.previousCollision = this.ball.detectedCollision;


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
        else if ( 
            this.ball.actualPosX >= (this.getCenterOfElement("paddles").player.fromXPos - (this.paddles.width / 2) - this.ball.width - 1/*-1 = margin gap*/) &&
            this.ball.actualPosY >= this.paddles.player.actualPosY && 
            this.ball.actualPosY <= ( (this.paddles.player.actualPosY + this.paddles.height) - this.ball.height ) 
        ) {
            this.ball.lastThrowFrom = "playerPaddle";
            this.ball.detectedCollision = "playerPaddle";
        }

        // AI Paddle
        else if ( 
            this.ball.actualPosX <= (this.getCenterOfElement("paddles").AI.fromXPos + (this.paddles.width / 2) + 1/*1 = margin gap*/) &&
            this.ball.actualPosY >= this.paddles.AI.actualPosY && 
            this.ball.actualPosY <= ( (this.paddles.AI.actualPosY + this.paddles.height) - this.ball.height ) 
        ) {
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


        // caught collision and rebound ball to next position
        this.reboundBall(this.ball.detectedCollision);
    }

    reboundBall(collisionZone) {
        /**
         * Collision situations and positions change when it happens - we always rebound the ball from player/ai to opponent side
         * becasue the come back is non-sense imho
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
        
        if (this.ball.previousCollision !== collisionZone)
            this.ball.addSpeedX = this.getRandomBallSpeedFactor();

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
                
                if (this.ball.previousCollision !== collisionZone)
                    this.ball.randDir = this.getRandomBallDirection("playerPaddle").directionDesc;

                (this.ball.randDir === "up") 
                    ? this.ball.actualPosY -= this.ball.weight 
                    : this.ball.actualPosY += this.ball.weight;
                break;

            case "AIPaddle":
                this.ball.actualPosX += this.ball.addSpeedX + this.ball.weight;

                if (this.ball.previousCollision !== collisionZone)
                    this.ball.randDir = this.getRandomBallDirection("AIPaddle").directionDesc;

                (this.ball.randDir === "up") 
                    ? this.ball.actualPosY += this.ball.weight 
                    : this.ball.actualPosY -= this.ball.weight;
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
            
            this.ball.detectedCollision = "playerPaddle";
            this.ball.lastThrowFrom = "playerPaddle";

            this.ball.firstBallThrown = true;
        }

        this.detectCollision();
    }

    startGameBall() {
        if (gameStatus.isStarted === true && gameStatus.isPaused === false && this.startPongTrigger === false)
            this.startPongTrigger = true;
    }

    computeAIPaddlePosYViaBallPosYTracking() {
        // TODO isPossibleToWin implementation.. in V2 version
        const ballActualPosY = this.ball.actualPosY;
        return ballActualPosY;
    }
    
    drawUI() {
        // paddle posititiong player
        this.paddles.player.actualPosY = OCCursor.cursorPosition.y - (this.paddles.height / 2);
        this.drawPlayerPaddle(this.paddles.player.constPosX, this.paddles.player.actualPosY);

        // paddle posititiong 
        this.paddles.AI.actualPosY = this.computeAIPaddlePosYViaBallPosYTracking() - (this.paddles.height / 2);
        this.drawAIPaddle(this.paddles.AI.constPosX, this.paddles.AI.actualPosY);

        // ball positioning 
        if (this.startPongTrigger === false) {
            this.ball.actualPosX = this.paddles.player.constPosX - this.ball.width - 1; /* -1 just for margin gap */
            this.ball.actualPosY = this.getCenterOfElement("paddles").player.fromYPos - this.ball.height / 2;
            
            this.drawBall(this.ball.actualPosX, this.ball.actualPosY);
        } else {
            this.throwBall();
        }
    }
}

/**
 * @export
 * 
 */
export default CGame;


