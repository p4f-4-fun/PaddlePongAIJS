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
        // if window event
        //OCCursor.cursorPosition.y = Event.clientY - domCtx.getBoundingClientRect().top;
        
        // if domCtx event
        OCCursor.cursorPosition.y = Event.offsetY;
        
        // console log only in dev mode
        if (isDEVMode) {
            // if window event
            //console.log(`[${ parseInt(Event.clientX - domCtx.getBoundingClientRect().left) }, ${ parseInt(Event.clientY - domCtx.getBoundingClientRect().top) }]`);
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


