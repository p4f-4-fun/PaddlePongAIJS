'use strict';

let playerLSData = {
    playerName: localStorage.getItem("playerName") || "Player 1",
    playerScore: localStorage.getItem("playerScore") || 0,
};

const setPlayerName = (playerName) => {
    playerLSData.playerName = playerName;
    localStorage.setItem("playerName", playerLSData.playerName);
};

const updatePlayerScore = (playerScore) => {
    playerLSData.playerScore = playerScore;
    localStorage.setItem("playerScore", playerLSData.playerScore);
};

const init = () => {
    console.log('app() init');
    console.log(`Hi, ${playerLSData.playerName}!`);
};


init();
