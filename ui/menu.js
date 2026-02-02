export function showMenu() {
    if (document.getElementById('menu')) return;

    const menu = document.createElement('div');
    menu.id = 'menu';

    menu.innerHTML = `
        <button id="startButton" class="nes-btn">Start</button>
        <button id="leaderboardButton" class="nes-btn">Leaderboard</button>
        <button id="aboutButton" class="nes-btn">About</button>
    `;

    document.body.appendChild(menu);
}

export function hideMenu() {
    const menu = document.getElementById('menu');

    if (menu) {
        menu.remove();
    }
}

export function moveTitle() {
    const gameTitle = document.getElementById("gameTitle")

    gameTitle.style.marginTop = "5vh"
}
