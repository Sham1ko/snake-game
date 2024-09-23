import { startGame } from './game.js';
import { hideMenu } from './ui.js';

// Запуск игры по нажатию на кнопку
document.getElementById('startButton').addEventListener('click', () => {
    hideMenu(); // Скрываем меню
    startGame(); // Стартуем игру
});

// Перезапуск игры по нажатию на кнопку Restart
document.getElementById('restartButton').addEventListener('click', startGame);
