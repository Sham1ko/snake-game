export function showMenu() {
    document.getElementById('menu').style.display = 'block';
}

export function hideMenu() {
    document.getElementById('menu').style.display = 'none';
}

let scoreDisplay = document.getElementById("score");
let gameOverScreen = document.getElementById("gameOverScreen");
let finalScoreDisplay = document.getElementById("finalScore");
let restartButton = document.getElementById("restartButton");

// Обновление и отображение текущего счета
export function updateScore(score) {
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
