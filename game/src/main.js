// Night Market — Cari Bedanya!  Bootstrap and input wiring.
// Canvas is fixed at 1280x800 internally and scaled to the window; mouse and
// keyboard input are mapped back into scene space. URL query ?shot=start|
// play|end jumps straight to a scripted state for screenshots.

import { CANVAS_W, CANVAS_H, PANEL_LEFT, PANEL_RIGHT, PANEL_W, PANEL_H } from './config.js';
import { createGame, startRun, advanceScene, checkSpot, useHint, moveCursor, switchCursorPanel, checkCursor, tick, applyShot, PHASE } from './game.js';
import { render } from './render.js';
import { ensureAudio, playClick } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const game = createGame();
window.__nightMarket = game; // for play-testing from the console

function resize() {
  const scale = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
  canvas.style.width = `${Math.floor(CANVAS_W * scale)}px`;
  canvas.style.height = `${Math.floor(CANVAS_H * scale)}px`;
}
window.addEventListener('resize', resize);
resize();

function toCanvasCoords(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * CANVAS_W,
    y: ((e.clientY - r.top) / r.height) * CANVAS_H,
  };
}

function panelAt(x, y) {
  if (x >= PANEL_LEFT.x && x < PANEL_LEFT.x + PANEL_W && y >= PANEL_LEFT.y && y < PANEL_LEFT.y + PANEL_H) {
    return { panel: 'left', sx: x - PANEL_LEFT.x, sy: y - PANEL_LEFT.y };
  }
  if (x >= PANEL_RIGHT.x && x < PANEL_RIGHT.x + PANEL_W && y >= PANEL_RIGHT.y && y < PANEL_RIGHT.y + PANEL_H) {
    return { panel: 'right', sx: x - PANEL_RIGHT.x, sy: y - PANEL_RIGHT.y };
  }
  return null;
}

canvas.addEventListener('mousemove', (e) => {
  const p = toCanvasCoords(e);
  game.mouse = { x: p.x, y: p.y, inside: true };
});

canvas.addEventListener('mouseleave', () => {
  game.mouse.inside = false;
});

canvas.addEventListener('click', (e) => {
  ensureAudio();
  const p = toCanvasCoords(e);
  if (game.phase === PHASE.TITLE) {
    startRun(game);
    return;
  }
  if (game.phase === PHASE.SCENE_CLEAR) {
    advanceScene(game);
    return;
  }
  if (game.phase === PHASE.GAME_OVER) {
    startRun(game);
    return;
  }
  const hit = panelAt(p.x, p.y);
  if (hit) checkSpot(game, hit.panel, hit.sx, hit.sy);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    ensureAudio();
    if (game.phase === PHASE.TITLE) startRun(game);
    else if (game.phase === PHASE.SCENE_CLEAR) advanceScene(game);
    else if (game.phase === PHASE.GAME_OVER) startRun(game);
    else checkCursor(game);
    return;
  }
  if (game.phase !== PHASE.PLAYING) return;
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    moveCursor(game, e.shiftKey ? -2 : -12, 0);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    moveCursor(game, e.shiftKey ? 2 : 12, 0);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    moveCursor(game, 0, e.shiftKey ? -2 : -12);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    moveCursor(game, 0, e.shiftKey ? 2 : 12);
  } else if (e.key === 'Tab') {
    e.preventDefault();
    switchCursorPanel(game);
  } else if (e.key === 'h' || e.key === 'H') {
    useHint(game);
  } else if (e.key === 'm' || e.key === 'M') {
    game.magnifier = !game.magnifier;
    playClick();
  }
});

// Scripted screenshot states.
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot === 'start' || shot === 'play' || shot === 'end') {
  applyShot(game, shot);
}

function frame(now) {
  tick(game, now);
  render(ctx, game, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
