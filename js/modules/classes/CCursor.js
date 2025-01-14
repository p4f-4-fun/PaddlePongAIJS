/**
 * @import
 * 
 */
import { domCtx } from "./../globals/globals.js";



/**
 * @Class CCursor
 * This class represents a cursor properties/ parameters
 * 
 */
class CCursor {
    constructor() {
        this.cursorPosition = { y: 0, };
    }

    updateCursorPosition (Event) {
        this.cursorPosition.y = Event.clientY - domCtx.getBoundingClientRect().top;
    }
}

/**
 * @export
 * 
 */
export default CCursor;


