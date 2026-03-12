import kaplay from "kaplay";

export async function startDodgeWin(canvas: HTMLCanvasElement) {

  const k = kaplay({
    canvas: canvas,
    background: [26, 27, 38],
    width: 800,
    height: 600,
  });

  k.loadSprite("tux", "/sprites/Tux.png");
  k.loadSprite("win", "/sprites/evil1.png");

  k.onLoad(() => {
    const player = k.add([
        k.sprite("tux"),
        k.pos(400,540),
        k.scale(0.2),
        k.area(),
        "player",
    ]);

    const SPEED = 400;
    let score = 0;

    const scoreLabel = k.add([
      k.text("SCORE: 0", { size: 24, font: "monospace" }),
      k.pos(24, 24),
      k.fixed(), 
      k.color(158, 238, 255), 
    ]);

    k.onUpdate(() => {
      if (k.get("player").length > 0) {
        score += k.dt() * 0.1; 
        scoreLabel.text = `SCORE: ${Math.floor(score * 10)}`; 
      }
    });
    
    k.onKeyDown("left", () => player.move(-SPEED, 0));
    k.onKeyDown("right", () => player.move(SPEED, 0));

    // projectile loop
    k.loop(1.0, () => {
      const x = k.rand(40, k.width() - 40);
      
      k.add([
        k.sprite("win"),
        k.scale(0.05),
        k.pos(x, -100), 
        k.area(),
        k.move(k.DOWN, k.rand(200, 500)),
        k.offscreen({ destroy: true }),
        "enemy",
      ]);
    });

    // collision logic
    player.onCollide("enemy", async () => {
      const finalScore = Math.floor(score * 10);
      k.destroy(player);
      k.add([
        k.text(`SYSTEM_CRASHED\n\nFINAL_SCORE: ${finalScore}`, { 
          size: 32, 
          align: "center",
          lineSpacing: 12
        }),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(247, 118, 142), 
      ]);

      const userData = localStorage.getItem('arcade_user');
      if (userData) {
        const user = JSON.parse(userData);

        try {
          await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              game_id: 'dodge-win',
              player_id: user.id,
              score: finalScore
            }),
          });
          
        } catch (err) {
          console.error("Failed to send score:", err);
        }
      }

    });

    
  });
  return k;
}