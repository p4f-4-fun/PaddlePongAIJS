/**
 * @import
 * 
 */
import { domElementsStack, OCCursor, OCGameView, OCGame } from './globals.js';



/**
 * @Function pageEventsBinding
 * This function binds all the event listeners on page
 * 
 */
const pageEventsBinding = () => {
   domElementsStack.canvas.addEventListener("click", OCGame.startGameBall);
   domElementsStack.canvas.addEventListener("mousemove", OCCursor.updateCursorPosition);
   
   //-- onpropertychange event <-- older browsers
   domElementsStack.modalElementInput.addEventListener('propertychange', OCGameView.renderPlayerNamePreview);
   //-- input event <-- modern browsers
   domElementsStack.modalElementInput.addEventListener("input", OCGameView.renderPlayerNamePreview);
   domElementsStack.modalElementButton.addEventListener("click", OCGameView.playButtonTriggered);
   
   //window.addEventListener("mousemove", OCCursor.updateCursorPosition);
   window.addEventListener("keydown", OCGameView.gameViewReactionOnKeyDown);
};

/**
 * @export
 * 
 */
export default pageEventsBinding;


