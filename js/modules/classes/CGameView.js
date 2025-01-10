/**
 * @import
 * 
 */
import { isDEVMode, dom, domElementsStack, domCtx, ctx, gameStatus, drawProperties, OCPlayer, OCGameView } from "./../globals/globals.js";
import gameLoop from "./../../app.js";



/**
 * @Class CGameView
 * This class represents a game view rendering etc...
 * 
 */
class CGameView {
    constructor() {
        this.wasPlayerNameInputModalOpen = false;
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
        if((OCPlayer.playerName.length < 1 || OCPlayer.playerName === OCPlayer.defaultPlayerName ) && this.wasPlayerNameInputModalOpen === false) {
            domElementsStack.modalElement.classList.remove("hidden");

            setTimeout(() => {
                domElementsStack.modalElement.classList.remove("hiddenByTransformXLeft");
            }, this.setTimeoutDuration);

            // change status of modal element to prevent of make it visible again in rendered View
            this.wasPlayerNameInputModalOpen = true;
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
        // if (isDEVMode === false) {
        //     domElementsStack.gameContainer.classList.add("cursorNone");
        // }

        domElementsStack.gameContainer.classList.add("cursorNone");
    }
    
    prepareGameBoard() {
        if (this.wasPlayerNameInputModalOpen === true) {
            this.removeViewPlayerNameInputModal();
        }

        // Gameboard line divider div display on screen
        domElementsStack.gameBoardLineDiv.classList.remove("hidden");
        
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

    gameViewReactionOnKeyDown(Event) {
        // PAUSE OR RESUME GAME REACTION
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
        // /PAUSE OR RESUME GAME REACTION
    }
    
    loadInGameFonts() {
        const fontBarlowRegular = new FontFace(`${drawProperties.fontRegular.fontFamily}`, `${drawProperties.fontRegular.fontUrl}`);
        fontBarlowRegular.load().then(font => dom.fonts.add(font), error => console.error(`Failed to load ${drawProperties.fontRegular.fontFamily} font => ${error.message}`));

        const fontBarlowBold = new FontFace(`${drawProperties.fontWarrning.fontFamily}`, `${drawProperties.fontWarrning.fontUrl}`); 
        fontBarlowBold.load().then(font => dom.fonts.add(font), error => console.error(`Failed to load ${drawProperties.fontWarrning.fontFamily} font => ${error.message}`));
    }
}

/**
 * @export
 * 
 */
export default CGameView;


