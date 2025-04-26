import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const player1 = new Player();
console.log(player1.movePlayer())
window.onkeydown = function(e){
    console.log(e.keyCode)
    };
console.log('ddd')