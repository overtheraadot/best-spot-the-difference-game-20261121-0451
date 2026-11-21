# Night Market — Cari Bedanya!

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/overtheraadot/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/overtheraadot/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

A spot-the-difference game set in an Indonesian night market, built for the
[make.fun](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
competition **best-spot-the-difference-game-20261121-0451**.

## The game

Two near-identical pictures side by side — find all 8 differences in each of
4 hand-drawn night-market scenes before the 5-minute clock runs out:

1. **Lapak Buah** — fruit stall under the string lights
2. **Gerobak Sate** — satay cart on the night street
3. **Gang Lampion** — lantern alley after the rain
4. **Perahu di Sungai** — boats on the river at moonrise

All art is drawn in code (canvas, no borrowed images), all names are original.

## How to play

- **Mouse:** click a difference on either picture.
- **Keyboard:** arrow keys move the cursor, **Enter** / **Space** checks the
  spot, **Tab** switches panels, **H** uses a hint (−50 points, 3 per scene),
  **M** toggles the magnifier lens.
- A correct find scores 100 points plus a streak bonus; a wrong click costs 25.
- Clearing a scene earns a 150-point bonus; finishing all four scenes adds a
  time bonus of 5 points per second left.

## Run it

Serve `game/` with any static server — no build step, no network requests:

```sh
node serve.ts
# open http://localhost:8080
```

Screenshot states for testing: `?shot=start`, `?shot=play`, `?shot=end`.

## Layout

- `main.ts` — hands the game in: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json` (via `vendor/makefun-game.ts`).
- `game/index.html` — page shell, loads `src/main.js`.
- `game/src/config.js` — constants and scene metadata (difference positions).
- `game/src/scenes.js` — the four scene painters (all art drawn in code).
- `game/src/game.js` — state machine and rules (timer, score, streak, hints).
- `game/src/render.js` — canvas renderer (HUD, panels, rings, magnifier).
- `game/src/audio.js` — tiny WebAudio synth sounds, no audio files.
- `game/src/main.js` — bootstrap and mouse/keyboard input.
- `screenshots/` — 3 real renders of the game in a desktop browser.

## License

MIT — see [LICENSE](LICENSE).
