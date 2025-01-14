/**
 * @Class CPlayer
 * This class represents a player parameters and data with api ready to use/ manipulations in game
 * 
 */
class CPlayer {
    #playerLSData = {};  /* Local Storage data for player */

    constructor() {
        this.defaultPlayerName = "Unknown";
        this.#playerLSData = {
            playerName: localStorage.getItem("playerName") || this.defaultPlayerName,
            playerScore: localStorage.getItem("playerScore") || 0, 
        };
    }

    get playerName() {
        return this.#playerLSData.playerName;
    }
    set playerName(playerName) {
        this.#playerLSData.playerName = playerName;
        localStorage.setItem("playerName", this.#playerLSData.playerName);
    }
    
    get playerScore() {
        return this.#playerLSData.playerScore;
    }
    set playerScore(playerScore) {
        this.#playerLSData.playerScore += parseInt(playerScore);
        localStorage.setItem("playerScore", this.#playerLSData.playerScore);
    }
}

/**
 * @export
 * 
 */
export default CPlayer;


