import { updateScore, showGameOverScreen, resetUI } from './ui.js';
import { saveFinalScore } from './index.js';

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let Snake = [];
let Food = {};
let speedX = 10;
let speedY = 0;
let interval = 100;
let move;
let score = 0;

function initSnake() {
    Snake = [{ x: 50, y: 50 }];
    speedX = 10;
    speedY = 0;
}

function isFoodOnSnake(newFood) {
    return Snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
}

function createNewFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
            y: Math.floor(Math.random() * (canvas.height / 10)) * 10,
        };
    } while (isFoodOnSnake(newFood));
    Food = newFood;
}

function endGame() {
    clearInterval(move);
    showGameOverScreen(score);
    saveFinalScore(score);
}

function checkSelfCollision() {
    for (let i = 1; i < Snake.length; i++) {
        if (Snake[0].x === Snake[i].x && Snake[0].y === Snake[i].y) {
            return true;
        }
    }
    return false;
}

function movingSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = Snake.length - 1; i > 0; i--) {
        Snake[i] = { ...Snake[i - 1] };
    }
    Snake[0].x += speedX;
    Snake[0].y += speedY;

    if (Snake[0].x < 0 || Snake[0].x >= canvas.width || Snake[0].y < 0 || Snake[0].y >= canvas.height) {
        endGame();
        return;
    }

    if (checkSelfCollision()) {
        endGame();
        return;
    }

    if (Snake[0].x === Food.x && Snake[0].y === Food.y) {
        Snake.push({ ...Snake[Snake.length - 1] });
        createNewFood();
        score++;
        updateScore(score);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(Food.x, Food.y, 10, 10);

    ctx.fillStyle = 'lime';
    Snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
    });
}


export function startGame() {
    resetUI();
    initSnake();
    createNewFood();
    score = 0;
    updateScore(score);

    move = setInterval(movingSnake, interval);

    document.addEventListener('keydown', function (event) {
        if (event.key === "ArrowRight" && speedX === 0) {
            speedX = 10;
            speedY = 0;
        } else if (event.key === "ArrowLeft" && speedX === 0) {
            speedX = -10;
            speedY = 0;
        } else if (event.key === "ArrowDown" && speedY === 0) {
            speedX = 0;
            speedY = 10;
        } else if (event.key === "ArrowUp" && speedY === 0) {
            speedX = 0;
            speedY = -10;
        }
    });
}
