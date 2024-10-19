import { startGame } from './game.js';
import { hideMenu, showLeaderboardModal, closeLeaderboardModal } from './ui.js';

// Запуск игры по нажатию на кнопку
document.getElementById('startButton').addEventListener('click', () => {
    hideMenu(); // Скрываем меню
    startGame(); // Стартуем игру
});

// Перезапуск игры по нажатию на кнопку Restart
document.getElementById('restartButton').addEventListener('click', startGame);


let finalScore = 0;

export function saveFinalScore(score) {
    return finalScore = score;
}

document.getElementById('saveButton').addEventListener('click', async () => {
    const playerName = document.getElementById('playerName').value;

    if (playerName && finalScore) {
        try {
            const response = await fetch('https://snake-game-worker.shamshyrak-zholdasbek.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playerName, score: finalScore })
            });

            if (response.ok) {
                alert('Score successfully saved!');
            } else {
                alert('Failed to save score');
            }
        } catch (error) {
            console.error('Error saving score:', error);
            alert('An error occurred while saving the score');
        }
    } else {
        alert('Please enter a valid name and score');
    }
});


// Логика для работы с таблицей лидеров
const leaderboardButton = document.getElementById('leaderboardButton');
const closeLeaderboardButton = document.getElementById('closeLeaderboardButton');
const leaderboardBody = document.getElementById('leaderboardBody');

// Открытие модалки таблицы лидеров
leaderboardButton.addEventListener('click', async () => {
    showLeaderboardModal();

    // Очищаем старые данные таблицы
    leaderboardBody.innerHTML = '';

    // Получаем топ-10 игроков с сервера
    try {
        const response = await fetch('https://snake-game-worker.shamshyrak-zholdasbek.workers.dev', {
            method: 'GET',
        });

        if (response.ok) {
            const leaderboardData = await response.json();
            leaderboardData.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.name}</td>
                    <td>${new Date(entry.date).toLocaleDateString()}</td>
                    <td>${entry.score}</td>
                `;
                leaderboardBody.appendChild(row);
            });
        } else {
            alert('Failed to load leaderboard');
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        alert('An error occurred while fetching the leaderboard');
    }
});

// Закрытие модалки таблицы лидеров
closeLeaderboardButton.addEventListener('click', closeLeaderboardModal);

// Закрытие модалки при клике вне её
window.onclick = function (event) {
    const leaderboardModal = document.getElementById('leaderboardModal');
    if (event.target == leaderboardModal) {
        closeLeaderboardModal();
    }
};
