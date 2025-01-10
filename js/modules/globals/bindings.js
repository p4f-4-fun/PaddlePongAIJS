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
   const startGameBallEventBindHandler = () => OCGame.startGameBall.bind(OCGame.startGameBall());
   domElementsStack.canvas.addEventListener("click", startGameBallEventBindHandler);

   const updateCursorPositionEventBindHandler = (Event) => OCCursor.updateCursorPosition.bind(OCCursor.updateCursorPosition(Event));
   domElementsStack.canvas.addEventListener("mousemove", Event => updateCursorPositionEventBindHandler(Event));
   
   //-- onpropertychange event <-- older browsers
   domElementsStack.modalElementInput.addEventListener('propertychange', OCGameView.renderPlayerNamePreview);
   //-- input event <-- modern browsers
   domElementsStack.modalElementInput.addEventListener("input", OCGameView.renderPlayerNamePreview);
   domElementsStack.modalElementButton.addEventListener("click", OCGameView.playButtonTriggered);
   
   window.addEventListener("keydown", OCGameView.gameViewReactionOnKeyDown);
};

/**
 * @export
 * 
 */
export default pageEventsBinding;


