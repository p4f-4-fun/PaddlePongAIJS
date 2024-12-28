'use strict';

/**
 * @import
 * 
 */
import { isDEVMode, domCtx, ctx, gameStatus, OCGameView, OCGame } from "./modules/globals/globals.js";
import pageEventsBinding from './modules/globals/bindings.js';



// Check if developer mode
if (isDEVMode) {
    localStorage.clear();
    console.log(`DEV mode: ${isDEVMode}`);
}



// INIT FUNCTION
const init = () => {
    pageEventsBinding();
    
    OCGameView.renderPlayerNamePreviewOnce();
    
    OCGameView.renderGameScoreOnce();
    
    // Loading external in-game fonts, because of use non-standard fonts
    OCGameView.loadInGameFonts();

    // Check if localStorage is available and not Empty, if so, we will load game with last player name and his score
    if (localStorage.length > 0 && isDEVMode === false) {
        OCGameView.prepareGameBoard();
        
        return;
    }

    // If localStorage is empty or is not available, we will show the modal to enter player's name
    OCGameView.renderPlayerNameInputModal();
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
        
        //setTimeout(gameLoop, (1000/* 3150ms/ 1sec *// 65/*frames per seconds*/));
        requestAnimationFrame(gameLoop);
    }
};
// /MAIN GAME APP FUNCTION

/**
 * @export
 * 
 */
export default gameLoop;


