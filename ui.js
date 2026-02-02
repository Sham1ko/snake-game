export function showScore() {
    const score = document.createElement('div');
    score.id = "score"
    score.innerHTML = `Score: 0`
    const gameTitle = document.getElementById("gameTitle")
    if (gameTitle.style.marginTop == "5vh") {
        gameTitle.insertAdjacentElement('afterend', score)
        setTimeout(() => {
            score.style.opacity = "1";
        }, 400);
    }
}

let gameOverScreen = document.getElementById("gameOverScreen");
let finalScoreDisplay = document.getElementById("finalScore");
let leaderboardModal = document.getElementById("leaderboardModal");

// Обновление и отображение текущего счета
export function updateScore(score) {
    let scoreDisplay = document.getElementById("score");
    scoreDisplay.innerText = `Score: ${score}`;
}

// Показ окна Game Over и итогового счета
export function showGameOverScreen(finalScore) {
    finalScoreDisplay.innerText = `Your final score: ${finalScore}`;
    gameOverScreen.style.display = 'flex'; // Показываем всплывающее окно
}

// Сброс интерфейса (очистка счета и скрытие окон)
export function resetUI() {
    gameOverScreen.style.display = 'none'; // Скрываем Game Over экран
    scoreDisplay.innerText = `Score: 0`; // Сбрасываем счет
}

// Показ модального окна с таблицей лидеров
export function showLeaderboardModal() {
    leaderboardModal.style.display = 'block'; // Показываем модалку
}

// Закрытие модального окна с таблицей лидеров
export function closeLeaderboardModal() {
    leaderboardModal.style.display = 'none'; // Скрываем модалку
}


export function showCanvas() {
    const gameCanvas = document.createElement('canvas')
    // <!-- <canvas id="gameCanvas" width="300" height="300"></canvas> -->
    gameCanvas.id = "gameCanvas"
    gameCanvas.width = 500
    gameCanvas.height = 500

    const score = document.getElementById("score")
    score.insertAdjacentElement('afterend', gameCanvas)
    setTimeout(() => {
        gameCanvas.style.opacity = "1";
    }, 400);
}