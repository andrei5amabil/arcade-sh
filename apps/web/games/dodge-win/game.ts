export async function startDodgeWin(canvas: HTMLCanvasElement) {
  // 1. Import 'kaplay' instead of 'kaboom'
  const { default: kaplay } = await import("kaplay");

  const k = kaplay({
    canvas: canvas,
    background: [26, 27, 38], // Tokyo Night BG
    width: 800,
    height: 600,
    letterbox: true, // Keeps it centered and clean
  });

  // 2. Dragos (The Player)
  const player = k.add([
    k.rect(40, 40),
    k.pos(k.center()),
    k.color(122, 162, 247), // Blue
    k.area(), // Collision box
    k.outline(2, k.rgb(255, 255, 255)), // Give it a crisp border
    "player"
  ]);

  // 3. Movement Logic (Same as before, still buttery smooth)
  const SPEED = 400;
  
  k.onKeyDown("left", () => player.move(-SPEED, 0));
  k.onKeyDown("right", () => player.move(SPEED, 0));
  k.onKeyDown("up", () => player.move(0, -SPEED));
  k.onKeyDown("down", () => player.move(0, SPEED));
}