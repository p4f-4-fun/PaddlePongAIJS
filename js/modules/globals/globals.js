/**
 * @import
 * 
 */
import CPlayer from './../classes/CPlayer.js';
import CCursor from './../classes/CCursor.js';
import CGameView from './../classes/CGameView.js';
import CGame from './../classes/CGame.js';



/**
 * @Global variables, declarations, assignments etc...
 * 
 */
const isDEVMode = true;

const dom = document;
const domElementsStack = {
    canvas: dom.querySelector("#game--container__canvas"),
    scoreElement: dom.querySelector(".header--leaderboard__span__score"),
    playerNamePreviewElement: dom.querySelector(".header--playerNameBox__span"),
    gameContainer: dom.querySelector(".game--container"),
    modalElement: dom.querySelector(".game--container__canvasInputModal"),
    modalElementInput: dom.querySelector("#game--container__canvasInputModal__input"),
    modalElementButton: dom.querySelector("#game--container__canvasInputModal__button"),
    gameBoardLineDiv: dom.querySelector("#game--container__gameBoardLineDiv"),
};

const domCtx = domElementsStack.canvas;
const ctx = domCtx.getContext("2d");

let gameStatus = {
    isPaused: false,
    isStarted: false,
};

const drawProperties = {
    fontRegular: {
        fontUrl: 'url("assets/fonts/BarlowSemiCondensed-Regular.woff")',
        fontFamily: "BarlowRegular",
        fontColor: "#FFFFFF",
        fontWeight: "400",
        fontWeightBold: "600",
        fontSize: "2.2rem",
    },

    fontWarrning: {
        fontUrl: 'url("assets/fonts/BarlowSemiCondensed-Bold.woff")',
        fontFamily: "BarlowBold",
        fontColor: "#FFFF00",
        fontWeight: "800",
        fontSize: "2.4rem",
    },

    UI: {
        color: "#FFFFFF",
        colorIfWarnning: "#FFFF00",
        ballColor: "#FFFF00",
    },
};

// class objects assignments
const OCPlayer = new CPlayer();
const OCCursor = new CCursor();
const OCGameView = new CGameView();
const OCGame = new CGame();
// /class objects assignments

/**
 * @export
 * 
 */
export { isDEVMode, dom, domElementsStack, domCtx, ctx, gameStatus, drawProperties, OCPlayer, OCCursor, OCGameView, OCGame};


