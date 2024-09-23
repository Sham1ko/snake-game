import { updateScore, showGameOverScreen, resetUI } from './ui.js';

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let Snake = [{ x: 0, y: 0 }];
let Food = {
    x: Math.floor(Math.random() * 29) * 10,
    y: Math.floor(Math.random() * 29) * 10,
};

let speedX = 10;
let speedY = 0;
let interval = 100;
let move;
let score = 0; // Счет игры

// Функция для создания новой еды в случайном месте
function createNewFood() {
    Food.x = Math.floor(Math.random() * 29) * 10;
    Food.y = Math.floor(Math.random() * 29) * 10;
}

// Функция завершения игры
function endGame() {
    clearInterval(move);
    showGameOverScreen(score); // Показываем всплывающее окно с финальным счетом
}

// Проверка на столкновение змейки с собой
function checkSelfCollision() {
    for (let i = 1; i < Snake.length; i++) {
        if (Snake[0].x === Snake[i].x && Snake[0].y === Snake[i].y) {
            return true;
        }
    }
    return false;
}

// Перемещение змейки
function movingSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = Snake.length - 1; i > 0; i--) {
        Snake[i] = { ...Snake[i - 1] };
    }
    Snake[0].x += speedX;
    Snake[0].y += speedY;

    // Проверка столкновения с границами
    if (Snake[0].x < 0 || Snake[0].x >= canvas.width || Snake[0].y < 0 || Snake[0].y >= canvas.height) {
        endGame();
        return;
    }

    // Проверка столкновения с собой
    if (checkSelfCollision()) {
        endGame();
        return;
    }

    // Проверка на поедание еды
    if (Snake[0].x === Food.x && Snake[0].y === Food.y) {
        Snake.push({ ...Snake[Snake.length - 1] }); // Увеличиваем длину змейки
        createNewFood(); // Создаем новую еду
        score++; // Увеличиваем счет
        updateScore(score); // Обновляем счет на экране
    }

    // Отрисовка еды и змейки
    ctx.fillStyle = 'red';
    ctx.fillRect(Food.x, Food.y, 10, 10);

    ctx.fillStyle = 'lime';
    Snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
    });
}

// Старт игры
export function startGame() {
    resetUI(); // Сбрасываем интерфейс перед началом игры
    Snake = [{ x: 0, y: 0 }];
    speedX = 10;
    speedY = 0;
    score = 0;
    createNewFood();

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
