const body = document.body;
const menu = document.getElementById('menu');
const hud = document.getElementById('hud');
const hintChip = document.getElementById('hintChip');
const pad = document.getElementById('pad');
const controlPicker = document.getElementById('controlPicker');
const scoreChip = document.getElementById('score');
const scoreValue = document.getElementById('scoreValue');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const saveStatus = document.getElementById('saveStatus');
const saveButton = document.getElementById('saveButton');
const restartButton = document.getElementById('restartButton');
const pauseScreen = document.getElementById('pauseScreen');
const pauseScore = document.getElementById('pauseScore');
const resumeButton = document.getElementById('resumeButton');
const leaderboardModal = document.getElementById('leaderboardModal');
const leaderboardBody = document.getElementById('leaderboardBody');
const closeLeaderboardButton = document.getElementById('closeLeaderboardButton');

// Переключение экранов меню и игры через класс на body
export function showMenu() {
    body.classList.add('state-menu');
    body.classList.remove('state-playing');
}

export function hideMenu() {
    body.classList.remove('state-menu');
    body.classList.add('state-playing');
}

// Обновление счёта с короткой анимацией
export function updateScore(score) {
    scoreValue.textContent = score;
    scoreChip.classList.remove('bump');
    void scoreChip.offsetWidth; // перезапуск анимации
    scoreChip.classList.add('bump');
}

// Окно Game Over с итоговым счётом
export function showGameOverScreen(score) {
    finalScoreDisplay.textContent = `Your score: ${score}`;
    setSaveStatus('', '');
    saveButton.disabled = false;
    gameOverScreen.classList.add('is-open');
    restartButton.focus();
}

// Сброс интерфейса перед новой партией
export function resetUI() {
    gameOverScreen.classList.remove('is-open');
    pauseScreen.classList.remove('is-open');
    updateScore(0);
}

// Применение выбранного управления: подсказка и D-pad
export function applyControlMode(mode) {
    if (mode === 'buttons') {
        hintChip.style.display = 'none';
        pad.classList.add('is-visible');
        hud.classList.add('no-hint');
        return;
    }

    if (mode === 'swipe') {
        hintChip.textContent = 'Swipe to steer';
    } else {
        hintChip.textContent = 'Arrows / WASD';
    }
    hintChip.style.display = '';
    pad.classList.remove('is-visible');
    hud.classList.remove('no-hint');
}

// Переключатель управления виден только на сенсорных экранах
export function setPickerVisible(visible) {
    controlPicker.classList.toggle('is-visible', visible);
}

export function markActiveControl(mode) {
    controlPicker.querySelectorAll('.picker-opt').forEach((opt) => {
        opt.classList.toggle('is-active', opt.dataset.mode === mode);
    });
}

// Экран паузы
export function showPauseScreen(score) {
    pauseScore.textContent = `Your score: ${score}`;
    pauseScreen.classList.add('is-open');
    resumeButton.focus();
}

export function hidePauseScreen() {
    pauseScreen.classList.remove('is-open');
}

// Статус сохранения результата (вместо alert)
export function setSaveStatus(text, kind) {
    saveStatus.textContent = text;
    saveStatus.classList.remove('ok', 'error');
    if (kind) {
        saveStatus.classList.add(kind);
    }
}

export function setSaveBusy(busy) {
    saveButton.disabled = busy;
}

// Модальное окно таблицы лидеров
export function showLeaderboardModal() {
    leaderboardModal.classList.add('is-open');
    closeLeaderboardButton.focus();
}

export function closeLeaderboardModal() {
    leaderboardModal.classList.remove('is-open');
}

function renderStateRow(text, blinking) {
    leaderboardBody.innerHTML = '';
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.className = 'state-cell' + (blinking ? ' blink' : '');
    cell.textContent = text;
    row.appendChild(cell);
    leaderboardBody.appendChild(row);
}

// Состояния таблицы: загрузка, пусто, ошибка, данные
export function leaderboardLoading() {
    renderStateRow('Loading...', true);
}

export function leaderboardEmpty() {
    renderStateRow('No scores yet. Be the first!', false);
}

export function leaderboardError() {
    renderStateRow('Could not load scores. Try again.', false);
}

// Заполнение таблицы результатами (текст через textContent, без HTML)
export function leaderboardRows(entries) {
    leaderboardBody.innerHTML = '';
    entries.slice(0, 10).forEach((entry, index) => {
        const row = document.createElement('tr');
        if (index < 3) {
            row.classList.add('top');
        }

        const rank = document.createElement('td');
        rank.textContent = index + 1;

        const name = document.createElement('td');
        name.textContent = entry.name;

        const date = document.createElement('td');
        date.textContent = entry.date ? new Date(entry.date).toLocaleDateString() : '-';

        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score;

        row.append(rank, name, date, scoreCell);
        leaderboardBody.appendChild(row);
    });
}
