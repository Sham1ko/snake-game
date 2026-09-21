import {
    startGame, togglePause, resumeGame, stopGame,
    getControlMode, setControlMode, hasTouch, isRunning,
} from './game.js';
import {
    hideMenu, showMenu, resetUI,
    showLeaderboardModal, closeLeaderboardModal,
    setSaveStatus, setSaveBusy,
    leaderboardLoading, leaderboardEmpty, leaderboardError, leaderboardRows,
    applyControlMode, setPickerVisible, markActiveControl,
} from './ui.js';

const API_URL = 'https://snake-game-worker.shamshyrak-zholdasbek.workers.dev';

let finalScore = 0;

export function saveFinalScore(score) {
    finalScore = score;
}

// Выбор управления: на сенсорных экранах свайпы или D-pad, выбор запоминается
setPickerVisible(hasTouch());
markActiveControl(getControlMode());
applyControlMode(getControlMode());

document.querySelectorAll('#controlPicker .picker-opt').forEach((opt) => {
    opt.addEventListener('click', () => {
        setControlMode(opt.dataset.mode);
        markActiveControl(getControlMode());
    });
});

// Запуск игры из меню
document.getElementById('startButton').addEventListener('click', () => {
    hideMenu();
    startGame();
});

// Перезапуск с экрана Game Over
document.getElementById('restartButton').addEventListener('click', startGame);

// Возврат в меню с экрана Game Over
document.getElementById('menuButton').addEventListener('click', () => {
    stopGame();
    showMenu();
    resetUI();
});

// Пауза: кнопка в HUD, Resume и Menu на экране паузы
document.getElementById('pauseButton').addEventListener('click', togglePause);

document.getElementById('resumeButton').addEventListener('click', resumeGame);

document.getElementById('pauseMenuButton').addEventListener('click', () => {
    stopGame();
    showMenu();
    resetUI();
});

// Сохранение результата
const playerNameInput = document.getElementById('playerName');

document.getElementById('saveButton').addEventListener('click', saveResult);

playerNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        saveResult();
    }
});

async function saveResult() {
    const playerName = playerNameInput.value.trim();

    if (!playerName || !finalScore) {
        setSaveStatus('Enter a name to save your score.', 'error');
        return;
    }

    setSaveBusy(true);
    setSaveStatus('Saving...', '');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: playerName, score: finalScore }),
        });

        if (response.ok) {
            setSaveStatus('Saved! Check the leaderboard.', 'ok');
            playerNameInput.value = '';
        } else {
            setSaveStatus('Could not save the score. Try again.', 'error');
        }
    } catch (error) {
        console.error('Error saving score:', error);
        setSaveStatus('Could not save the score. Try again.', 'error');
    } finally {
        setSaveBusy(false);
    }
}

// Таблица лидеров
const leaderboardButton = document.getElementById('leaderboardButton');
let leaderboardTrigger = null;

leaderboardButton.addEventListener('click', async () => {
    leaderboardTrigger = document.activeElement;
    showLeaderboardModal();
    leaderboardLoading();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            leaderboardRows(data);
        } else {
            leaderboardEmpty();
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardError();
    }
});

function closeLeaderboard() {
    closeLeaderboardModal();
    if (leaderboardTrigger && typeof leaderboardTrigger.focus === 'function') {
        leaderboardTrigger.focus();
    }
}

document.getElementById('closeLeaderboardButton').addEventListener('click', closeLeaderboard);

// Закрытие по клику на фон
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('leaderboardModal')) {
        closeLeaderboard();
    }
});

// Escape: закрывает модалку, возвращает в меню, ставит и снимает паузу
document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const leaderboardModal = document.getElementById('leaderboardModal');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const pauseScreen = document.getElementById('pauseScreen');

    if (leaderboardModal.classList.contains('is-open')) {
        closeLeaderboard();
    } else if (gameOverScreen.classList.contains('is-open')) {
        stopGame();
        showMenu();
        resetUI();
    } else if (pauseScreen.classList.contains('is-open')) {
        resumeGame();
    } else if (isRunning()) {
        togglePause();
    }
});
