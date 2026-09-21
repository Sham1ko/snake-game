# snake-game

Classic snake in vanilla JavaScript: canvas rendering, keyboard controls, and a leaderboard stored on a Cloudflare Worker.

## Run

The game uses ES modules, so it needs a local server:

```
npx serve .
```

or

```
python -m http.server 8000
```

Open http://localhost:3000 (serve) or http://localhost:8000 (python).

## Controls

Arrow keys or WASD to steer. Escape closes dialogs. The leaderboard reads and writes to `https://snake-game-worker.shamshyrak-zholdasbek.workers.dev`.
