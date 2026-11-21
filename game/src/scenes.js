// Night Market — Cari Bedanya!  Scene painters.
// Every scene is drawn by one painter that takes `v`, an array of 8 booleans:
// v[i] = false paints the left panel, v[i] = true paints the right panel's
// version of difference i. All art is drawn in code; no image assets.

import { PANEL_W, PANEL_H } from './config.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

function ground(ctx, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, y, PANEL_W, PANEL_H - y);
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function stringLights(ctx, y, sag, bulbColor) {
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.quadraticCurveTo(PANEL_W / 2, y + sag, PANEL_W, y);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = t * PANEL_W;
    const yy = y + sag * 4 * t * (1 - t);
    ctx.fillStyle = '#3a2c1c';
    ctx.fillRect(x - 1, yy - 6, 2, 6);
    circle(ctx, x, yy + 2, 5, bulbColor[i % bulbColor.length]);
  }
}

function lantern(ctx, x, y, color, lit) {
  ctx.fillStyle = '#8a6d1f';
  ctx.fillRect(x - 2, y - 18, 4, 4);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(x - 8, y - 12, 4, 22);
  ctx.fillStyle = '#8a6d1f';
  ctx.fillRect(x - 7, y + 14, 14, 4);
  if (lit) {
    const g = ctx.createRadialGradient(x, y, 2, x, y, 34);
    g.addColorStop(0, 'rgba(255,210,90,0.55)');
    g.addColorStop(1, 'rgba(255,210,90,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
  }
}

function cat(ctx, x, y, color) {
  ctx.fillStyle = color;
  // body
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // head
  circle(ctx, x + 14, y - 8, 8, color);
  // ears
  ctx.beginPath();
  ctx.moveTo(x + 8, y - 13);
  ctx.lineTo(x + 10, y - 20);
  ctx.lineTo(x + 14, y - 14);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 16, y - 14);
  ctx.lineTo(x + 20, y - 20);
  ctx.lineTo(x + 21, y - 12);
  ctx.closePath();
  ctx.fill();
  // tail
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 2);
  ctx.quadraticCurveTo(x - 26, y - 14, x - 20, y - 22);
  ctx.stroke();
}

// ---------------------------------------------------------------- scene 0
function paintFruitStall(ctx, v) {
  sky(ctx, '#1b1440', '#4a2560');
  if (!v[7]) star(ctx, 560, 42, 7, '#ffe9a8');
  star(ctx, 60, 50, 5, '#ffe9a8');
  star(ctx, 180, 30, 4, '#cfe4ff');
  circle(ctx, 500, 55, 22, '#f5e6b8'); // moon
  circle(ctx, 492, 50, 20, '#e8d49a');
  stringLights(ctx, 18, 26, ['#ff5a5a', '#ffd24d', '#5ad48a', '#5aa8ff']);
  ground(ctx, 300, '#241a12');

  // stall awning
  rect(ctx, 60, 96, 480, 14, '#5a2d1e');
  for (let i = 0; i < 8; i++) {
    const stripe = i % 2 === 0 ? (v[0] ? '#1f8a6d' : '#d23c2e') : '#f5ead2';
    rect(ctx, 60 + i * 60, 110, 60, 34, stripe);
  }
  rect(ctx, 60, 144, 480, 6, '#5a2d1e');
  // stall posts
  rect(ctx, 66, 150, 10, 150, '#6b4226');
  rect(ctx, 524, 150, 10, 150, '#6b4226');
  // hanging lamp
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(480, 150);
  ctx.lineTo(480, 168);
  ctx.stroke();
  lantern(ctx, 480, 182, '#ff9d2e', !v[2]);
  if (v[2]) {
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.ellipse(480, 182, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // vendor behind the counter
  circle(ctx, 300, 210, 26, '#f2c89b'); // head
  ctx.fillStyle = v[6] ? '#2e6fd8' : '#d23c2e'; // hat
  ctx.beginPath();
  ctx.arc(300, 204, 27, Math.PI, 0);
  ctx.fill();
  rect(ctx, 268, 200, 64, 8, v[6] ? '#2e6fd8' : '#d23c2e');
  ctx.fillStyle = '#f2c89b';
  circle(ctx, 290, 210, 3, '#241a12');
  circle(ctx, 310, 210, 3, '#241a12');
  ctx.strokeStyle = '#241a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(300, 218, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  rect(ctx, 262, 238, 76, 62, '#3f7a4e'); // body / apron

  // counter
  rect(ctx, 100, 300, 400, 16, '#8a5a2e');
  rect(ctx, 110, 316, 380, 62, '#6b4226');
  rect(ctx, 110, 316, 380, 6, '#a06a38');

  // fruit piles on the counter
  const orangeCount = v[1] ? 4 : 5;
  const ox = [250, 268, 286, 259, 277];
  for (let i = 0; i < orangeCount; i++) {
    circle(ctx, ox[i], 292 - (i >= 3 ? 12 : 0), 11, '#ff8c1a');
    circle(ctx, ox[i] - 3, 289 - (i >= 3 ? 12 : 0), 3, '#ffb35c');
  }
  // mangoes
  circle(ctx, 350, 292, 11, '#e84e7a');
  circle(ctx, 368, 292, 11, '#e84e7a');
  circle(ctx, 359, 280, 11, '#e84e7a');
  // bananas
  ctx.strokeStyle = '#ffd24d';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(420, 292, 12, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(436, 292, 12, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // price sign
  rect(ctx, 492, 180, 62, 52, '#f5ead2');
  rect(ctx, 492, 180, 62, 52, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#5a2d1e';
  ctx.lineWidth = 3;
  ctx.strokeRect(492, 180, 62, 52);
  ctx.fillStyle = '#5a2d1e';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(v[3] ? '7K' : '5K', 523, 214);
  ctx.font = '11px sans-serif';
  ctx.fillText('BUAH', 523, 196);

  // crates and basket
  rect(ctx, 60, 330, 52, 40, '#8a5a2e');
  ctx.strokeStyle = '#5a2d1e';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 330, 52, 40);
  ctx.beginPath();
  ctx.moveTo(60, 350);
  ctx.lineTo(112, 350);
  ctx.stroke();
  if (!v[4]) cat(ctx, 92, 352, '#2b2b2b');
  // basket
  ctx.fillStyle = '#b98a3e';
  ctx.beginPath();
  ctx.moveTo(400, 330);
  ctx.lineTo(470, 330);
  ctx.lineTo(460, 372);
  ctx.lineTo(410, 372);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8a5a2e';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(404 + i * 2, 342);
    ctx.lineTo(466 - i * 2, 342);
    ctx.stroke();
  }
  if (!v[5]) {
    ctx.strokeStyle = '#8a5a2e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(435, 330, 18, Math.PI, 0);
    ctx.stroke();
  }
  circle(ctx, 420, 322, 7, '#e84e7a');
  circle(ctx, 445, 322, 7, '#ff8c1a');
}

// ---------------------------------------------------------------- scene 1
function paintSatayCart(ctx, v) {
  sky(ctx, '#141033', '#3d1f52');
  star(ctx, 80, 40, 5, '#ffe9a8');
  star(ctx, 520, 30, 4, '#cfe4ff');
  circle(ctx, 90, 60, 18, '#f5e6b8');
  ground(ctx, 310, '#1d1710');
  // street
  rect(ctx, 0, 310, 600, 8, '#3a2f22');

  // umbrella
  ctx.fillStyle = v[0] ? '#2e6fd8' : '#d23c2e';
  ctx.beginPath();
  ctx.moveTo(140, 120);
  ctx.quadraticCurveTo(300, 10, 460, 120);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.moveTo(220, 120);
  ctx.quadraticCurveTo(300, 40, 380, 120);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 297, 30, 6, 100, '#5a2d1e');
  circle(ctx, 300, 28, 6, '#8a6d1f');

  // cart body
  rect(ctx, 120, 230, 360, 90, '#7a4a22');
  rect(ctx, 120, 230, 360, 10, '#9a6232');
  rect(ctx, 130, 250, 90, 56, '#5a3416');
  rect(ctx, 340, 250, 130, 56, '#5a3416');
  // grill
  rect(ctx, 225, 240, 110, 50, '#2b2b2b');
  ctx.fillStyle = '#ff7a1a';
  const flameH = v[5] ? 10 : 22;
  ctx.beginPath();
  ctx.moveTo(240, 288);
  ctx.quadraticCurveTo(255, 288 - flameH, 265, 288);
  ctx.quadraticCurveTo(280, 288 - flameH, 295, 288);
  ctx.quadraticCurveTo(310, 288 - flameH, 320, 288);
  ctx.closePath();
  ctx.fill();
  // skewers
  const skewers = v[1] ? 5 : 6;
  for (let i = 0; i < skewers; i++) {
    const x = 236 + i * 16;
    ctx.strokeStyle = '#d8b98a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 244);
    ctx.lineTo(x, 276);
    ctx.stroke();
    ctx.fillStyle = '#8a4a1a';
    ctx.fillRect(x - 4, 252, 8, 16);
  }
  // smoke
  if (!v[2]) {
    ctx.fillStyle = 'rgba(220,220,230,0.5)';
    circle(ctx, 350, 195, 12, 'rgba(220,220,230,0.5)');
    circle(ctx, 362, 178, 16, 'rgba(220,220,230,0.4)');
    circle(ctx, 352, 158, 10, 'rgba(220,220,230,0.35)');
  }
  // sauce bottles
  const bottles = v[3] ? 2 : 3;
  const bottleColors = ['#d23c2e', '#e8a13c', '#5ad48a'];
  for (let i = 0; i < bottles; i++) {
    const x = 140 + i * 18;
    ctx.fillStyle = bottleColors[i];
    ctx.fillRect(x, 226, 12, 22);
    ctx.fillRect(x + 3, 220, 6, 6);
  }
  // menu board
  rect(ctx, 452, 128, 62, 48, '#f5ead2');
  ctx.strokeStyle = '#5a2d1e';
  ctx.lineWidth = 3;
  ctx.strokeRect(452, 128, 62, 48);
  ctx.fillStyle = '#5a2d1e';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SATE', 483, 146);
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(v[6] ? '12K' : '10K', 483, 166);
  // flag
  if (!v[7]) {
    ctx.strokeStyle = '#2b2118';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(430, 120);
    ctx.lineTo(430, 84);
    ctx.stroke();
    ctx.fillStyle = '#ffd24d';
    ctx.beginPath();
    ctx.moveTo(430, 84);
    ctx.lineTo(458, 90);
    ctx.lineTo(430, 98);
    ctx.closePath();
    ctx.fill();
  }
  // wheels
  for (const wx of [205, 400]) {
    circle(ctx, wx, 340, 26, '#2b2118');
    circle(ctx, wx, 340, 12, '#8a6d1f');
    ctx.strokeStyle = '#d8b98a';
    ctx.lineWidth = 2;
    const spokes = wx === 205 && v[4] ? 6 : 8;
    for (let i = 0; i < spokes; i++) {
      const a = (i * Math.PI * 2) / spokes;
      ctx.beginPath();
      ctx.moveTo(wx, 340);
      ctx.lineTo(wx + Math.cos(a) * 22, 340 + Math.sin(a) * 22);
      ctx.stroke();
    }
  }
  // handle
  ctx.strokeStyle = '#5a2d1e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(480, 300);
  ctx.lineTo(530, 280);
  ctx.stroke();
}

// ---------------------------------------------------------------- scene 2
function paintLanternAlley(ctx, v) {
  sky(ctx, '#120e2e', '#33184a');
  star(ctx, 300, 28, 5, '#ffe9a8');
  star(ctx, 80, 60, 4, '#cfe4ff');
  ground(ctx, 330, '#171019');
  // left building
  rect(ctx, 30, 90, 190, 240, '#4a2b3a');
  rect(ctx, 30, 90, 190, 12, '#5d3648');
  // window (lit / dark)
  rect(ctx, 90, 150, 60, 70, v[1] ? '#2b2033' : '#ffd24d');
  ctx.strokeStyle = '#2b2033';
  ctx.lineWidth = 3;
  ctx.strokeRect(90, 150, 60, 70);
  ctx.beginPath();
  ctx.moveTo(120, 150);
  ctx.lineTo(120, 220);
  ctx.moveTo(90, 185);
  ctx.lineTo(150, 185);
  ctx.stroke();
  if (!v[1]) {
    ctx.fillStyle = 'rgba(255,210,77,0.25)';
    ctx.fillRect(84, 226, 72, 10);
  }
  // right building
  rect(ctx, 400, 70, 170, 260, '#33294a');
  rect(ctx, 400, 70, 170, 12, '#453763');
  // door
  rect(ctx, 470, 210, 70, 120, '#6b4226');
  circle(ctx, 532, 272, 4, '#ffd24d');
  ctx.fillStyle = '#f5ead2';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(v[5] ? '21' : '12', 505, 200);
  // roof cat
  if (!v[6]) cat(ctx, 545, 62, '#1c1c1c');
  // roof tiles
  rect(ctx, 400, 58, 170, 12, '#241a30');
  rect(ctx, 30, 78, 190, 12, '#241a30');

  // lantern strings across the alley
  const lanternCount = v[4] ? 4 : 5;
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 60);
  ctx.quadraticCurveTo(300, 130, 560, 60);
  ctx.stroke();
  for (let i = 0; i < lanternCount; i++) {
    const t = (i + 0.5) / lanternCount;
    const x = 40 + t * 520;
    const y = 60 + 70 * 4 * t * (1 - t) * 0.55;
    const isDiff = i === 2;
    lantern(ctx, x, y + 14, isDiff ? (v[0] ? '#ffd24d' : '#d23c2e') : '#ff5a3c', true);
  }
  // second string, small bulbs
  ctx.strokeStyle = '#2b2118';
  ctx.beginPath();
  ctx.moveTo(20, 100);
  ctx.quadraticCurveTo(300, 150, 580, 100);
  ctx.stroke();
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const x = 20 + t * 560;
    const y = 100 + 50 * 4 * t * (1 - t) * 0.5;
    const out = v[7] && i === 1;
    circle(ctx, x, y + 8, 4, out ? '#3a3a3a' : '#ffe9a8');
    if (!out) {
      ctx.fillStyle = 'rgba(255,233,168,0.3)';
      ctx.beginPath();
      ctx.arc(x, y + 8, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // bicycle
  ctx.strokeStyle = '#c8c8c8';
  ctx.lineWidth = 3;
  circle(ctx, 420, 320, 18, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#c8c8c8';
  ctx.beginPath();
  ctx.arc(420, 320, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(480, 320, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(420, 320);
  ctx.lineTo(450, 288);
  ctx.lineTo(480, 320);
  ctx.moveTo(450, 288);
  ctx.lineTo(440, 268);
  ctx.moveTo(450, 288);
  ctx.lineTo(472, 292);
  ctx.lineTo(480, 320);
  ctx.moveTo(440, 268);
  ctx.lineTo(428, 268);
  ctx.moveTo(472, 292);
  ctx.lineTo(478, 276);
  ctx.stroke();
  // basket
  if (!v[2]) {
    ctx.fillStyle = '#b98a3e';
    ctx.fillRect(452, 296, 26, 18);
    ctx.strokeStyle = '#8a5a2e';
    ctx.lineWidth = 2;
    ctx.strokeRect(452, 296, 26, 18);
  }
  // puddle with reflection
  ctx.fillStyle = 'rgba(90,140,200,0.35)';
  ctx.beginPath();
  ctx.ellipse(300, 372, 90, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!v[3]) {
    ctx.fillStyle = 'rgba(255,90,60,0.6)';
    ctx.beginPath();
    ctx.ellipse(300, 372, 30, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,210,77,0.6)';
    ctx.beginPath();
    ctx.ellipse(330, 374, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------- scene 3
function paintRiverBoats(ctx, v) {
  sky(ctx, '#0f1a3d', '#274a6e');
  // moon full / crescent
  circle(ctx, 520, 62, 26, '#f5e6b8');
  if (v[0]) circle(ctx, 530, 56, 22, '#274a6e');
  star(ctx, 80, 50, 5, '#ffe9a8');
  star(ctx, 340, 36, 4, '#cfe4ff');
  // birds
  const birds = v[1] ? 2 : 3;
  ctx.strokeStyle = '#1c1c1c';
  ctx.lineWidth = 2;
  for (let i = 0; i < birds; i++) {
    const x = 170 + i * 36;
    const y = 82 + (i % 2) * 8;
    ctx.beginPath();
    ctx.arc(x - 7, y, 7, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(x + 7, y, 7, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // far bank + houses
  rect(ctx, 0, 170, 600, 40, '#1c2a1a');
  rect(ctx, 420, 130, 80, 40, '#4a2b3a');
  rect(ctx, 420, 130, 80, 8, '#5d3648');
  rect(ctx, 445, 150, 24, 20, v[4] ? '#2b2033' : '#ffd24d');
  rect(ctx, 510, 140, 70, 30, '#33294a');
  rect(ctx, 510, 140, 70, 8, '#453763');
  // bridge
  ctx.fillStyle = '#5a3416';
  ctx.beginPath();
  ctx.moveTo(280, 170);
  ctx.quadraticCurveTo(350, 100, 420, 170);
  ctx.lineTo(420, 186);
  ctx.quadraticCurveTo(350, 120, 280, 186);
  ctx.closePath();
  ctx.fill();
  const bridgeLights = v[5] ? 3 : 4;
  for (let i = 0; i < bridgeLights; i++) {
    const x = 300 + i * 32;
    const y = 148 - Math.abs(i - 1.5) * 10;
    lantern(ctx, x, y, '#ff5a3c', true);
  }
  // river
  const wg = ctx.createLinearGradient(0, 210, 0, 400);
  wg.addColorStop(0, '#2e5a7a');
  wg.addColorStop(1, '#16324a');
  ctx.fillStyle = wg;
  ctx.fillRect(0, 210, 600, 190);
  // moon reflection
  ctx.fillStyle = 'rgba(245,230,184,0.35)';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(500 + (i % 2) * 12, 220 + i * 18, 40 - i * 4, 5);
  }
  // boat
  ctx.fillStyle = '#7a4a22';
  ctx.beginPath();
  ctx.moveTo(230, 280);
  ctx.lineTo(370, 280);
  ctx.lineTo(340, 310);
  ctx.lineTo(260, 310);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 292, 230, 6, 50, '#5a2d1e'); // mast
  ctx.fillStyle = v[2] ? '#2e6fd8' : '#d23c2e'; // flag
  ctx.beginPath();
  ctx.moveTo(298, 230);
  ctx.lineTo(330, 238);
  ctx.lineTo(298, 246);
  ctx.closePath();
  ctx.fill();
  // crates on the boat
  const crates = v[7] ? 2 : 3;
  for (let i = 0; i < crates; i++) {
    const x = 250 + i * 26;
    rect(ctx, x, 256, 22, 24, '#b98a3e');
    ctx.strokeStyle = '#8a5a2e';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 256, 22, 24);
  }
  // fisherman
  if (!v[3]) {
    ctx.fillStyle = '#1c1c1c';
    circle(ctx, 150, 268, 10, '#1c1c1c');
    rect(ctx, 140, 278, 20, 24, '#1c1c1c');
    ctx.strokeStyle = '#8a6d1f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, 282);
    ctx.lineTo(196, 240);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(200,220,255,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(196, 240);
    ctx.lineTo(196, 300);
    ctx.stroke();
  }
  // second small boat
  ctx.fillStyle = '#5a3416';
  ctx.beginPath();
  ctx.moveTo(60, 330);
  ctx.lineTo(140, 330);
  ctx.lineTo(125, 350);
  ctx.lineTo(75, 350);
  ctx.closePath();
  ctx.fill();
  // ripples
  ctx.strokeStyle = 'rgba(200,230,255,0.4)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(250 + i * 12, 352 + i * 8, 30 + i * 10, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (!v[6]) {
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.ellipse(250, 352, 44, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function paintScene(ctx, sceneId, v) {
  ctx.save();
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  if (sceneId === 0) paintFruitStall(ctx, v);
  else if (sceneId === 1) paintSatayCart(ctx, v);
  else if (sceneId === 2) paintLanternAlley(ctx, v);
  else paintRiverBoats(ctx, v);
  ctx.restore();
}

// One offscreen canvas per scene variant, painted once and reused.
export function renderScenePanels(sceneId) {
  const left = document.createElement('canvas');
  left.width = PANEL_W;
  left.height = PANEL_H;
  paintScene(left.getContext('2d'), sceneId, [false, false, false, false, false, false, false, false]);
  const right = document.createElement('canvas');
  right.width = PANEL_W;
  right.height = PANEL_H;
  paintScene(right.getContext('2d'), sceneId, [true, true, true, true, true, true, true, true]);
  return { left, right };
}
