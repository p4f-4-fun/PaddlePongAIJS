/**
 * @import
 * 
 */
import CCursor from "./../classes/CCursor.js";
import CGame from "./../classes/CGame.js";
import CGameView from "./../classes/CGameView.js";
import CPlayer from "./../classes/CPlayer.js";



/**
 * @Global variables, declarations, assignments etc...
 * 
 */
const isDEVMode = true;

const dom = document;
const domElementsStack = {
    canvas: dom.querySelector("#game--container__canvas"),
    gameBoardLineDiv: dom.querySelector("#game--container__gameBoardLineDiv"),
    gameContainer: dom.querySelector(".game--container"),
    modalElement: dom.querySelector(".game--container__canvasInputModal"),
    modalElementButton: dom.querySelector("#game--container__canvasInputModal__button"),
    modalElementInput: dom.querySelector("#game--container__canvasInputModal__input"),
    playerNamePreviewElement: dom.querySelector(".header--playerNameBox__span"),
    scoreElement: dom.querySelector(".header--leaderboard__span__score"),
};

const domCtx = domElementsStack.canvas;
const ctx = domCtx.getContext("2d");

let gameStatus = {
    isPaused: false,
    isStarted: false,
};

const drawProperties = {
    fontRegular: {
        fontColor: "#FFFFFF",
        fontFamily: "BarlowRegular",
        fontSize: "2.2rem",
        fontUrl: 'url("assets/fonts/BarlowSemiCondensed-Regular.woff")',
        fontWeight: "400",
        fontWeightBold: "600",
    },

    fontWarrning: {
        fontColor: "#FFFF00",
        fontFamily: "BarlowBold",
        fontSize: "2.4rem",
        fontUrl: 'url("assets/fonts/BarlowSemiCondensed-Bold.woff")',
        fontWeight: "800",
    },

    UI: {
        ballColor: "#FFFF00",
        color: "#FFFFFF",
        colorIfWarnning: "#FFFF00",
    },
};

// class objects assignments
const OCCursor = new CCursor();
const OCGame = new CGame();
const OCGameView = new CGameView();
const OCPlayer = new CPlayer();
// /class objects assignments

/**
 * @export
 * 
 */
export { isDEVMode, dom, domElementsStack, domCtx, ctx, gameStatus, drawProperties, OCCursor, OCGame, OCGameView, OCPlayer};


