/**
 * @import
 * 
 */
import { isDEVMode, OCCursor } from "./../globals/globals.js";



/**
 * @Class CCursor
 * This class represents a cursor properties/ parameters
 * 
 */
class CCursor {
    constructor() {
        this.cursorPosition = {
            y: 0,
        };
    }

    updateCursorPosition (Event) {
        // if domCtx event
        this.cursorPosition.y = Event.offsetY;
        
        // console log only in dev mode
        if (isDEVMode) {
            // if domCtx event
            //console.log(`[${ parseInt(Event.OffsetX) }, ${ parseInt(Event.offsetY) }]`);
        }
    }
}

/**
 * @export
 * 
 */
export default CCursor;


