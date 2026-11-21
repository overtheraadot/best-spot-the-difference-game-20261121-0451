// Night Market — Cari Bedanya!  Shared constants and scene metadata.
// Every scene is drawn twice (left / right panel) from the same painter; each
// of the 8 differences flips one small detail between the two panels.

export const PANEL_W = 600;
export const PANEL_H = 400;
export const CANVAS_W = 1280;
export const CANVAS_H = 800;

// Panel origins on the 1280x800 canvas.
export const PANEL_LEFT = { x: 20, y: 140 };
export const PANEL_RIGHT = { x: 660, y: 140 };

export const TOTAL_TIME_SEC = 300; // whole run, all four scenes
export const HINTS_PER_SCENE = 3;
export const FIND_POINTS = 100;
export const STREAK_BONUS = 25; // per consecutive find after the first
export const WRONG_PENALTY = 25;
export const HINT_COST = 50;
export const SCENE_CLEAR_BONUS = 150;
export const TIME_BONUS_PER_SEC = 5;

// A difference: where to click (scene space, 600x400) and its short label.
export const SCENES = [
  {
    id: 0,
    name: 'Lapak Buah',
    subtitle: 'Fruit stall under the string lights',
    diffs: [
      { x: 120, y: 62, label: 'Awning stripe colour' },
      { x: 300, y: 305, label: 'Oranges in the pile' },
      { x: 480, y: 78, label: 'Hanging lamp on / off' },
      { x: 520, y: 205, label: 'Price on the sign' },
      { x: 90, y: 345, label: 'Cat by the crate' },
      { x: 435, y: 330, label: 'Basket handle' },
      { x: 300, y: 148, label: "Vendor's hat colour" },
      { x: 560, y: 42, label: 'Star in the sky' },
    ],
  },
  {
    id: 1,
    name: 'Gerobak Sate',
    subtitle: 'Satay cart on the night street',
    diffs: [
      { x: 300, y: 68, label: 'Umbrella colour' },
      { x: 280, y: 258, label: 'Skewers on the grill' },
      { x: 355, y: 175, label: 'Smoke puff' },
      { x: 150, y: 238, label: 'Sauce bottles' },
      { x: 205, y: 345, label: 'Wheel spokes' },
      { x: 305, y: 300, label: 'Grill flame' },
      { x: 480, y: 150, label: 'Menu price' },
      { x: 430, y: 92, label: 'Flag on the cart' },
    ],
  },
  {
    id: 2,
    name: 'Gang Lampion',
    subtitle: 'Lantern alley after the rain',
    diffs: [
      { x: 200, y: 92, label: 'Lantern colour' },
      { x: 120, y: 180, label: 'Window lit / dark' },
      { x: 450, y: 330, label: 'Bicycle basket' },
      { x: 300, y: 372, label: 'Puddle reflection' },
      { x: 420, y: 82, label: 'Lanterns in the string' },
      { x: 520, y: 205, label: 'Door number' },
      { x: 545, y: 58, label: 'Cat on the roof' },
      { x: 62, y: 92, label: 'String-light bulb' },
    ],
  },
  {
    id: 3,
    name: 'Perahu di Sungai',
    subtitle: 'Boats on the river at moonrise',
    diffs: [
      { x: 520, y: 62, label: 'Moon shape' },
      { x: 200, y: 82, label: 'Birds in the sky' },
      { x: 300, y: 195, label: 'Boat flag colour' },
      { x: 150, y: 300, label: 'Fisherman' },
      { x: 480, y: 180, label: 'House window' },
      { x: 350, y: 122, label: 'Bridge lanterns' },
      { x: 250, y: 352, label: 'Ripple in the water' },
      { x: 450, y: 282, label: 'Crates on the boat' },
    ],
  },
];

export const CLICK_RADIUS = 30;
