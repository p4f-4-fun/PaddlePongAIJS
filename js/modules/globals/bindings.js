/**
 * @import
 * 
 */
import { domElementsStack, OCCursor, OCGame, OCGameView } from "./globals.js";



/**
 * @Function pageEventsBinding
 * This function binds all the event listeners on page
 * 
 */
const pageEventsBinding = () => {
   /* start game ball */
   const startGameBallEventBindHandler = () => OCGame.startGameBall.bind(OCGame.startGameBall());
   domElementsStack.canvas.addEventListener("click", startGameBallEventBindHandler);

   /* modal input on propertychange/ input */
   //-- onpropertychange event <-- older browsers
   domElementsStack.modalElementInput.addEventListener('propertychange', OCGameView.renderPlayerNamePreview);
   //-- input event <-- modern browsers
   domElementsStack.modalElementInput.addEventListener("input", OCGameView.renderPlayerNamePreview);

   /* play button on click */
   const playButtonTriggeredEventBindHandler = (Event) => OCGameView.playButtonTriggered.bind(OCGameView.playButtonTriggered(Event));
   domElementsStack.modalElementButton.addEventListener("click", (Event) => playButtonTriggeredEventBindHandler(Event));
   
   /* game reaction on keydown */
   const gameViewReactionOnKeyDownEventBindHandler = (Event) => OCGameView.gameViewReactionOnKeyDown.bind(OCGameView.gameViewReactionOnKeyDown(Event));
   window.addEventListener("keydown", (Event) => gameViewReactionOnKeyDownEventBindHandler(Event));
   
   /* update cursor position on mousemove */
   const updateCursorPositionEventBindHandler = (Event) => OCCursor.updateCursorPosition.bind(OCCursor.updateCursorPosition(Event));
   window.addEventListener("mousemove", (Event) => updateCursorPositionEventBindHandler(Event));
};

/**
 * @export
 * 
 */
export default pageEventsBinding;


