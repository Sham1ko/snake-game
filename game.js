import { updateScore, showGameOverScreen, resetUI, applyControlMode, showPauseScreen, hidePauseScreen } from './ui.js';
import { saveFinalScore } from './index.js';

const CELL = 10;
const GRID = 30; // поле 30x30 клеток

let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Рисуем с двойным запасом пикселей, чтобы картинка была чёткой
canvas.width = GRID * CELL * 2;
canvas.height = GRID * CELL * 2;
ctx.scale(2, 2);

let Snake = [];
let Food = {};
let speedX = CELL;
let speedY = 0;
let interval = 100;
let move = null;
let score = 0;
let running = false;
let paused = false;

const screenFrame = document.getElementById('screenFrame');

function initSnake() {
    Snake = [{ x: 50, y: 50 }];
    speedX = CELL;
    speedY = 0;
}

function isFoodOnSnake(newFood) {
    return Snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
}

function createNewFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID) * CELL,
            y: Math.floor(Math.random() * GRID) * CELL,
        };
    } while (isFoodOnSnake(newFood));
    Food = newFood;
}

function endGame() {
    running = false;
    clearInterval(move);
    move = null;
    shakeScreen();
    showGameOverScreen(score);
    saveFinalScore(score);
}

// Короткая тряска рамки при проигрыше
function shakeScreen() {
    if (!screenFrame) return;
    screenFrame.classList.remove('shake');
    void screenFrame.offsetWidth;
    screenFrame.classList.add('shake');
}

function checkSelfCollision() {
    for (let i = 1; i < Snake.length; i++) {
        if (Snake[0].x === Snake[i].x && Snake[0].y === Snake[i].y) {
            return true;
        }
    }
    return false;
}

// Скруглённый прямоугольник с запасным вариантом
function fillRound(x, y, w, h, r, color) {
    ctx.fillStyle = color;
    if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
    } else {
        ctx.fillRect(x, y, w, h);
    }
}

// Плавный переход цвета от головы к хвосту
function mixColor(t) {
    const head = [140, 255, 168];
    const tail = [47, 158, 74];
    const c = head.map((v, i) => Math.round(v + (tail[i] - v) * t));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function drawBoard() {
    ctx.fillStyle = '#0c130d';
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);

    ctx.strokeStyle = 'rgba(87, 255, 127, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < GRID; i++) {
        ctx.moveTo(i * CELL + 0.5, 0);
        ctx.lineTo(i * CELL + 0.5, GRID * CELL);
        ctx.moveTo(0, i * CELL + 0.5);
        ctx.lineTo(GRID * CELL, i * CELL + 0.5);
    }
    ctx.stroke();
}

function drawFood() {
    const pulse = Math.sin(Date.now() / 180);
    const size = 8 + pulse * 1.5;
    const offset = (CELL - size) / 2;
    fillRound(Food.x + offset, Food.y + offset, size, size, 3, 'rgba(255, 91, 77, 0.25)');
    fillRound(Food.x + 1.5, Food.y + 1.5, 7, 7, 2, '#ff5b4d');
}

function drawSnake() {
    const len = Snake.length;
    for (let i = len - 1; i >= 0; i--) {
        const t = len > 1 ? i / (len - 1) : 0;
        fillRound(Snake[i].x + 1, Snake[i].y + 1, 8, 8, 2.5, mixColor(t));
    }
    drawEyes();
}

// Глаза на голове, смотрят по направлению движения
function drawEyes() {
    const head = Snake[0];
    const cx = head.x + 5;
    const cy = head.y + 5;
    const dx = speedX / CELL;
    const dy = speedY / CELL;
    const px = -dy * 1.7;
    const py = dx * 1.7;
    ctx.fillStyle = '#06240f';
    ctx.fillRect(cx + dx * 1.5 + px - 1, cy + dy * 1.5 + py - 1, 2, 2);
    ctx.fillRect(cx + dx * 1.5 - px - 1, cy + dy * 1.5 - py - 1, 2, 2);
}

function draw() {
    drawBoard();
    drawFood();
    drawSnake();
}

function movingSnake() {
    for (let i = Snake.length - 1; i > 0; i--) {
        Snake[i] = { ...Snake[i - 1] };
    }
    Snake[0].x += speedX;
    Snake[0].y += speedY;

    if (Snake[0].x < 0 || Snake[0].x >= GRID * CELL || Snake[0].y < 0 || Snake[0].y >= GRID * CELL) {
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

    draw();
}

// Управление: стрелки и WASD, работает на любой раскладке
const KEY_DIRS = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
};

// Поворот: разворот на 180 градусов запрещён правилами
function turn(dir) {
    if ((dir === 'left' || dir === 'right') && speedX === 0) {
        speedX = dir === 'left' ? -CELL : CELL;
        speedY = 0;
    } else if ((dir === 'up' || dir === 'down') && speedY === 0) {
        speedY = dir === 'up' ? -CELL : CELL;
        speedX = 0;
    }
}

function handleKey(event) {
    if (!isGameActive()) return;
    const dir = KEY_DIRS[event.code];
    if (!dir) return;
    event.preventDefault(); // стрелки не прокручивают страницу
    turn(dir);
}

document.addEventListener('keydown', handleKey);

export function startGame() {
    clearInterval(move); // защита от двойного запуска
    move = null;
    resetUI();
    if (screenFrame) {
        screenFrame.classList.remove('shake');
    }

    initSnake();
    createNewFood();
    score = 0;
    updateScore(0);
    paused = false;
    running = true;

    move = setInterval(movingSnake, interval);
}

// ---- Пауза ----
export function isRunning() {
    return running;
}

function isGameActive() {
    return running && !paused;
}

export function togglePause() {
    if (paused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

export function pauseGame() {
    if (!running || paused) return;
    paused = true;
    clearInterval(move);
    move = null;
    showPauseScreen(score);
}

export function resumeGame() {
    if (!paused) return;
    paused = false;
    hidePauseScreen();
    move = setInterval(movingSnake, interval);
}

// Полная остановка: возврат в меню с паузы или Game Over
export function stopGame() {
    running = false;
    paused = false;
    clearInterval(move);
    move = null;
    hidePauseScreen();
}

// Автопауза, когда вкладка уходит на фон
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseGame();
    }
});

// ---- Свайпы по полю ----
const SWIPE_MIN = 24; // порог в CSS-пикселях
let touchOrigin = null;

screenFrame.addEventListener('touchstart', (event) => {
    const t = event.touches[0];
    touchOrigin = { x: t.clientX, y: t.clientY };
}, { passive: true });

screenFrame.addEventListener('touchmove', (event) => {
    if (!touchOrigin || !isGameActive()) return;
    const t = event.touches[0];
    const dx = t.clientX - touchOrigin.x;
    const dy = t.clientY - touchOrigin.y;
    if (Math.abs(dx) < SWIPE_MIN && Math.abs(dy) < SWIPE_MIN) return;

    event.preventDefault(); // жест по полю не прокручивает страницу
    touchOrigin = { x: t.clientX, y: t.clientY }; // можно вести палец не отрывая
    if (Math.abs(dx) > Math.abs(dy)) {
        turn(dx > 0 ? 'right' : 'left');
    } else {
        turn(dy > 0 ? 'down' : 'up');
    }
}, { passive: false });

screenFrame.addEventListener('touchend', () => {
    touchOrigin = null;
});

screenFrame.addEventListener('touchcancel', () => {
    touchOrigin = null;
});

// ---- D-pad под полем ----
const PAD_DIRS = {
    padUp: 'up',
    padDown: 'down',
    padLeft: 'left',
    padRight: 'right',
};

Object.keys(PAD_DIRS).forEach((id) => {
    document.getElementById(id).addEventListener('click', () => {
        if (isGameActive()) {
            turn(PAD_DIRS[id]);
        }
    });
});

// ---- Выбор управления ----
const CONTROL_KEY = 'snake-control';

export function hasTouch() {
    return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

export function getControlMode() {
    let saved = null;
    try {
        saved = localStorage.getItem(CONTROL_KEY);
    } catch (error) {
        // приватный режим: настройка просто не сохраняется
    }
    if (saved === 'swipe' || saved === 'buttons') {
        return saved;
    }
    return hasTouch() ? 'swipe' : 'keys';
}

export function setControlMode(mode) {
    if (mode !== 'swipe' && mode !== 'buttons') return;
    try {
        localStorage.setItem(CONTROL_KEY, mode);
    } catch (error) {
        // приватный режим: настройка просто не сохраняется
    }
    applyControlMode(mode);
}
