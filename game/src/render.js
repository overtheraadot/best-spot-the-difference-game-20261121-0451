// Night Market — Cari Bedanya!  Canvas renderer.
// Paints the frame every animation tick from the game state: HUD, the two
// panels side by side, found-difference rings, wrong-click marks, the
// magnifier lens, the keyboard cursor and the title / scene-clear / game-over
// screens. No game rules live here.

import {
  PANEL_W,
  PANEL_H,
  CANVAS_W,
  CANVAS_H,
  PANEL_LEFT,
  PANEL_RIGHT,
} from './config.js';
import { currentScene, remainingInScene, PHASE } from './game.js';

const BG_TOP = '#120a2e';
const BG_BOTTOM = '#2a1545';
const GOLD = '#ffd24d';
const CREAM = '#f5ead2';
const RED = '#ff5a5a';
const GREEN = '#5ad48a';

function panelOrigin(panel) {
  return panel === 'left' ? PANEL_LEFT : PANEL_RIGHT;
}

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawPanelFrame(ctx, origin, label) {
  ctx.strokeStyle = '#6b5432';
  ctx.lineWidth = 4;
  ctx.strokeRect(origin.x - 4, origin.y - 4, PANEL_W + 8, PANEL_H + 8);
  ctx.fillStyle = '#f5ead2';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, origin.x, origin.y - 12);
}

function drawFoundRing(ctx, origin, x, y, now) {
  const pulse = 1 + 0.06 * Math.sin(now / 180);
  const r = 26 * pulse;
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(origin.x + x, origin.y + y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(90,212,138,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(origin.x + x, origin.y + y, r + 6, 0, Math.PI * 2);
  ctx.stroke();
  // check mark
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(origin.x + x - 10, origin.y + y);
  ctx.lineTo(origin.x + x - 3, origin.y + y + 7);
  ctx.lineTo(origin.x + x + 11, origin.y + y - 8);
  ctx.stroke();
}

function drawWrongMark(ctx, origin, x, y, age) {
  const alpha = Math.max(0, 1 - age / 1200);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = RED;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(origin.x + x - 12, origin.y + y - 12);
  ctx.lineTo(origin.x + x + 12, origin.y + y + 12);
  ctx.moveTo(origin.x + x + 12, origin.y + y - 12);
  ctx.lineTo(origin.x + x - 12, origin.y + y + 12);
  ctx.stroke();
  ctx.restore();
}

function drawHintRing(ctx, origin, x, y, now) {
  const r = 24 + 8 * Math.sin(now / 120);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(origin.x + x, origin.y + y, Math.max(10, r), 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPopup(ctx, origin, popup, now) {
  const age = now - popup.at;
  if (age > 1100) return;
  const y = origin.y + popup.y - 34 - age * 0.03;
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - age / 1100);
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = popup.text.startsWith('+') ? GREEN : RED;
  ctx.fillText(popup.text, origin.x + popup.x, y);
  ctx.restore();
}

function drawMagnifier(ctx, game, now) {
  if (!game.magnifier || !game.mouse.inside) return;
  const m = game.mouse;
  const panel = m.x < PANEL_LEFT.x + PANEL_W + 10 && m.x >= PANEL_LEFT.x
    ? 'left'
    : m.x >= PANEL_RIGHT.x && m.x < PANEL_RIGHT.x + PANEL_W
      ? 'right'
      : null;
  if (!panel) return;
  const origin = panelOrigin(panel);
  const sx = m.x - origin.x;
  const sy = m.y - origin.y;
  const R = 72;
  const ZOOM = 2;
  const src = panel === 'left' ? game.panels.left : game.panels.right;
  ctx.save();
  ctx.beginPath();
  ctx.arc(m.x, m.y, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, sx - R / ZOOM, sy - R / ZOOM, (R * 2) / ZOOM, (R * 2) / ZOOM, m.x - R, m.y - R, R * 2, R * 2);
  ctx.restore();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(m.x, m.y, R, 0, Math.PI * 2);
  ctx.stroke();
  // crosshair inside the lens
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(m.x - 10, m.y);
  ctx.lineTo(m.x + 10, m.y);
  ctx.moveTo(m.x, m.y - 10);
  ctx.lineTo(m.x, m.y + 10);
  ctx.stroke();
}

function drawCursor(ctx, game) {
  const c = game.cursor;
  if (!c.visible || game.phase !== PHASE.PLAYING) return;
  const origin = panelOrigin(c.panel);
  const x = origin.x + c.x;
  const y = origin.y + c.y;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x - 8, y);
  ctx.moveTo(x + 8, y);
  ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 20);
  ctx.stroke();
}

function drawHud(ctx, game) {
  const scene = currentScene(game);
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Night Market — Cari Bedanya!', 20, 42);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#c9b8e8';
  ctx.fillText(`Scene ${game.sceneIndex + 1} of 4: ${scene.name} — ${scene.subtitle}`, 20, 66);

  // right-side HUD: score, streak, time, hints
  ctx.textAlign = 'right';
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`Score ${game.score}`, 1260, 40);
  const timeColor = game.timeLeft < 30 ? RED : CREAM;
  ctx.fillStyle = timeColor;
  ctx.fillText(`⏱ ${fmtTime(game.timeLeft)}`, 1260, 68);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = game.streak >= 2 ? GOLD : '#c9b8e8';
  ctx.fillText(game.streak >= 2 ? `🔥 Streak x${game.streak}` : 'Streak —', 1260, 92);
  ctx.fillStyle = CREAM;
  ctx.fillText(`Hints: ${game.hintsLeft}  (H)`, 940, 68);

  // remaining counter, big and central
  const remaining = remainingInScene(game);
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = remaining === 0 ? GREEN : GOLD;
  ctx.fillText(`${remaining} difference${remaining === 1 ? '' : 's'} left`, 640, 112);
}

function drawBottomBar(ctx, game, now) {
  ctx.fillStyle = '#c9b8e8';
  ctx.font = '15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Click a difference on either picture  •  Arrows move the cursor, Enter checks it  •  H = hint (−50)  •  M = magnifier  •  Wrong click −25',
    640, 582,
  );
  if (game.message && now < game.messageUntil) {
    ctx.fillStyle = GOLD;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(game.message, 640, 612);
  }
  // progress dots for the 4 scenes, under the bar
  for (let i = 0; i < 4; i++) {
    const x = 598 + i * 28;
    ctx.fillStyle = i < game.sceneIndex ? GREEN : i === game.sceneIndex ? GOLD : '#5a4a7a';
    ctx.beginPath();
    ctx.arc(x, 640, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#8a7ab0';
  ctx.font = '13px sans-serif';
  ctx.fillText(`Scene ${game.sceneIndex + 1} of 4`, 640, 664);
}

function drawTitle(ctx, game, now) {
  ctx.fillStyle = 'rgba(10,6,26,0.82)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 64px sans-serif';
  ctx.fillText('🌙 Night Market', 640, 190);
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('Cari Bedanya!', 640, 250);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#c9b8e8';
  ctx.fillText('Spot the difference — two near-identical pictures, side by side.', 640, 300);
  ctx.fillText('4 hand-drawn night-market scenes • 8 differences each • 5 minutes on the clock', 640, 330);
  ctx.fillText('Mouse or keyboard (arrows + Enter) • Hints cost 50 • Wrong clicks cost 25', 640, 360);

  // pulsing start button
  const pulse = 1 + 0.05 * Math.sin(now / 250);
  const bw = 300 * pulse;
  ctx.fillStyle = '#d23c2e';
  ctx.beginPath();
  ctx.roundRect(640 - bw / 2, 420, bw, 64, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('▶  Start the hunt', 640, 460);
  ctx.fillStyle = '#c9b8e8';
  ctx.font = '16px sans-serif';
  ctx.fillText('or press Enter', 640, 505);

  ctx.fillStyle = '#8a7ab0';
  ctx.font = '14px sans-serif';
  ctx.fillText('All art drawn in code — no borrowed images. Best score wins a place on the board.', 640, 700);
}

function drawSceneClear(ctx, game) {
  ctx.fillStyle = 'rgba(10,6,26,0.72)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  ctx.fillStyle = GREEN;
  ctx.font = 'bold 52px sans-serif';
  ctx.fillText('🎉 Scene complete!', 640, 320);
  ctx.fillStyle = CREAM;
  ctx.font = '24px sans-serif';
  ctx.fillText(`All 8 differences found in ${currentScene(game).name}  •  +${150} bonus`, 640, 370);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#c9b8e8';
  ctx.fillText(
    game.sceneIndex + 1 >= 4 ? 'That was the last scene!' : 'Next scene coming up — click or press Enter',
    640, 410,
  );
}

function drawGameOver(ctx, game) {
  ctx.fillStyle = 'rgba(10,6,26,0.86)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const s = game.finalStats;
  ctx.textAlign = 'center';
  ctx.fillStyle = s.won ? GOLD : CREAM;
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText(s.won ? '🏆 Night Market Cleared!' : "⏰ Time's up!", 640, 200);
  ctx.fillStyle = CREAM;
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(`Final score: ${s.score}`, 640, 280);
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#c9b8e8';
  ctx.fillText(`Differences found: ${s.found} / 32`, 640, 330);
  ctx.fillText(`Wrong clicks: ${s.wrong}   •   Best streak: ${s.bestStreak}   •   Accuracy: ${s.accuracy}%`, 640, 366);
  if (s.timeBonus > 0) ctx.fillText(`Time bonus: +${s.timeBonus} (${s.timeLeft}s left)`, 640, 402);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Press Enter or click to play again', 640, 470);
  ctx.fillStyle = '#8a7ab0';
  ctx.font = '15px sans-serif';
  ctx.fillText('Night Market — Cari Bedanya!  •  4 scenes, 32 differences, one night market.', 640, 700);
}

export function render(ctx, game, now) {
  // background
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bg.addColorStop(0, BG_TOP);
  bg.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  if (game.phase === PHASE.TITLE) {
    drawTitle(ctx, game, now);
    return;
  }

  drawHud(ctx, game);

  // panels
  if (game.panels) {
    ctx.drawImage(game.panels.left, PANEL_LEFT.x, PANEL_LEFT.y);
    ctx.drawImage(game.panels.right, PANEL_RIGHT.x, PANEL_RIGHT.y);
  }
  const scene = currentScene(game);
  drawPanelFrame(ctx, PANEL_LEFT, 'KIRI — Left');
  drawPanelFrame(ctx, PANEL_RIGHT, 'KANAN — Right');

  // markers
  game.found.forEach((i) => {
    const d = scene.diffs[i];
    drawFoundRing(ctx, PANEL_LEFT, d.x, d.y, now);
    drawFoundRing(ctx, PANEL_RIGHT, d.x, d.y, now);
  });
  game.wrongMarks = game.wrongMarks.filter((m) => now - m.at < 1200);
  game.wrongMarks.forEach((m) => drawWrongMark(ctx, panelOrigin(m.panel), m.x, m.y, now - m.at));
  if (game.hintFlash && now < game.hintFlash.until) {
    const d = scene.diffs[game.hintFlash.index];
    drawHintRing(ctx, PANEL_LEFT, d.x, d.y, now);
    drawHintRing(ctx, PANEL_RIGHT, d.x, d.y, now);
  }
  game.popups = game.popups.filter((p) => now - p.at < 1100);
  game.popups.forEach((p) => drawPopup(ctx, panelOrigin(p.panel), p, now));

  drawMagnifier(ctx, game, now);
  drawCursor(ctx, game);
  drawBottomBar(ctx, game, now);

  if (game.phase === PHASE.SCENE_CLEAR) drawSceneClear(ctx, game);
  if (game.phase === PHASE.GAME_OVER) drawGameOver(ctx, game);
}
