// Night Market — Cari Bedanya!  Game state machine and rules.
// Owns the run: title -> playing (4 scenes) -> scene-clear -> game over.
// No drawing here; render.js reads this state and paints the canvas.

import {
  SCENES,
  TOTAL_TIME_SEC,
  HINTS_PER_SCENE,
  FIND_POINTS,
  STREAK_BONUS,
  WRONG_PENALTY,
  HINT_COST,
  SCENE_CLEAR_BONUS,
  TIME_BONUS_PER_SEC,
  CLICK_RADIUS,
} from './config.js';
import { renderScenePanels } from './scenes.js';
import { playFind, playWrong, playHint, playSceneClear, playWin, playClick, ensureAudio } from './audio.js';

export const PHASE = {
  TITLE: 'title',
  PLAYING: 'playing',
  SCENE_CLEAR: 'scene-clear',
  GAME_OVER: 'game-over',
};

export function createGame() {
  return {
    phase: PHASE.TITLE,
    sceneIndex: 0,
    found: new Set(), // difference indexes found in the current scene
    wrongMarks: [], // {x, y, panel, at} red X marks, scene coords
    popups: [], // {x, y, panel, text, at} floating score text
    score: 0,
    streak: 0,
    bestStreak: 0,
    totalFound: 0,
    totalWrong: 0,
    hintsLeft: HINTS_PER_SCENE,
    hintFlash: null, // {index, until} diff index the hint is revealing
    timeLeft: TOTAL_TIME_SEC,
    startedAt: 0,
    lastTick: 0,
    panels: null, // {left, right} offscreen canvases for the current scene
    mouse: { x: -100, y: -100, inside: false },
    magnifier: false,
    cursor: { panel: 'left', x: 300, y: 200, visible: false }, // keyboard cursor
    message: '',
    messageUntil: 0,
    sceneClearAt: 0,
    finalStats: null,
    shot: null, // 'start' | 'play' | 'end' for scripted screenshots
  };
}

export function currentScene(game) {
  return SCENES[game.sceneIndex];
}

export function remainingInScene(game) {
  return currentScene(game).diffs.length - game.found.size;
}

export function loadScene(game, index) {
  game.sceneIndex = index;
  game.found = new Set();
  game.wrongMarks = [];
  game.popups = [];
  game.hintsLeft = HINTS_PER_SCENE;
  game.hintFlash = null;
  game.panels = renderScenePanels(index);
  game.cursor = { panel: 'left', x: 300, y: 200, visible: false };
}

export function startRun(game) {
  ensureAudio();
  game.score = 0;
  game.streak = 0;
  game.bestStreak = 0;
  game.totalFound = 0;
  game.totalWrong = 0;
  game.timeLeft = TOTAL_TIME_SEC;
  game.startedAt = performance.now();
  game.lastTick = performance.now();
  game.finalStats = null;
  game.phase = PHASE.PLAYING;
  loadScene(game, 0);
  playClick();
}

export function tick(game, now) {
  if (game.phase !== PHASE.PLAYING) {
    game.lastTick = now;
    return;
  }
  const dt = (now - game.lastTick) / 1000;
  game.lastTick = now;
  game.timeLeft = Math.max(0, game.timeLeft - dt);
  if (game.timeLeft <= 0) endRun(game, false);
}

function endRun(game, won) {
  game.phase = PHASE.GAME_OVER;
  const timeBonus = won ? Math.round(game.timeLeft) * TIME_BONUS_PER_SEC : 0;
  game.score += timeBonus;
  const accuracy = game.totalFound + game.totalWrong === 0
    ? 100
    : Math.round((100 * game.totalFound) / (game.totalFound + game.totalWrong));
  game.finalStats = {
    won,
    score: game.score,
    found: game.totalFound,
    wrong: game.totalWrong,
    bestStreak: game.bestStreak,
    accuracy,
    timeBonus,
    timeLeft: Math.round(game.timeLeft),
  };
  if (won) playWin();
}

export function checkSpot(game, panel, sx, sy) {
  if (game.phase !== PHASE.PLAYING) return;
  ensureAudio();
  const scene = currentScene(game);
  let hit = -1;
  let best = CLICK_RADIUS;
  scene.diffs.forEach((d, i) => {
    if (game.found.has(i)) return;
    const dist = Math.hypot(d.x - sx, d.y - sy);
    if (dist < best) {
      best = dist;
      hit = i;
    }
  });
  const now = performance.now();
  if (hit >= 0) {
    game.found.add(hit);
    game.totalFound += 1;
    game.streak += 1;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    const pts = FIND_POINTS + (game.streak - 1) * STREAK_BONUS;
    game.score += pts;
    game.popups.push({ x: scene.diffs[hit].x, y: scene.diffs[hit].y, panel, text: `+${pts}`, at: now });
    game.hintFlash = null;
    playFind();
    if (game.found.size === scene.diffs.length) {
      game.score += SCENE_CLEAR_BONUS;
      game.phase = PHASE.SCENE_CLEAR;
      game.sceneClearAt = now;
      playSceneClear();
    }
  } else {
    game.totalWrong += 1;
    game.streak = 0;
    game.score = Math.max(0, game.score - WRONG_PENALTY);
    game.wrongMarks.push({ x: sx, y: sy, panel, at: now });
    game.popups.push({ x: sx, y: sy, panel, text: `-${WRONG_PENALTY}`, at: now });
    playWrong();
  }
}

export function useHint(game) {
  if (game.phase !== PHASE.PLAYING) return;
  if (game.hintsLeft <= 0) {
    flashMessage(game, 'No hints left!');
    return;
  }
  const scene = currentScene(game);
  const remaining = scene.diffs.map((d, i) => i).filter((i) => !game.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.hintFlash = { index: pick, until: performance.now() + 2200 };
  playHint();
}

export function flashMessage(game, text) {
  game.message = text;
  game.messageUntil = performance.now() + 1800;
}

export function advanceScene(game) {
  if (game.sceneIndex + 1 >= SCENES.length) {
    endRun(game, true);
  } else {
    game.phase = PHASE.PLAYING;
    loadScene(game, game.sceneIndex + 1);
    game.lastTick = performance.now();
  }
}

export function moveCursor(game, dx, dy) {
  const c = game.cursor;
  c.visible = true;
  c.x = Math.max(10, Math.min(590, c.x + dx));
  c.y = Math.max(10, Math.min(390, c.y + dy));
}

export function switchCursorPanel(game) {
  game.cursor.panel = game.cursor.panel === 'left' ? 'right' : 'left';
  game.cursor.visible = true;
}

export function checkCursor(game) {
  checkSpot(game, game.cursor.panel, game.cursor.x, game.cursor.y);
}

// Scripted states for screenshots (?shot=start|play|end).
export function applyShot(game, shot) {
  game.shot = shot;
  if (shot === 'start') {
    game.phase = PHASE.TITLE;
  } else if (shot === 'play') {
    startRun(game);
    loadScene(game, 1);
    game.timeLeft = 212;
    game.score = 740;
    game.streak = 3;
    game.bestStreak = 3;
    game.totalFound = 3;
    game.found = new Set([0, 3, 5]);
    game.hintsLeft = 2;
    game.mouse = { x: 0, y: 0, inside: false };
  } else if (shot === 'end') {
    startRun(game);
    game.score = 3120;
    game.totalFound = 32;
    game.totalWrong = 4;
    game.bestStreak = 9;
    game.timeLeft = 87;
    endRun(game, true);
  }
}
