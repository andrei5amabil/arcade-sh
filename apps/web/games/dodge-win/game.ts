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

  const floor = k.add([
    k.rect(k.width(), 100), 
    k.pos(0, 500),          
    k.color(43, 48, 59),   
    k.area(),
    k.outline(2, k.rgb(158, 238, 255)), 
    "floor",
  ]);

  k.onLoad(() => {
    const player = k.add([
        k.sprite("tux"),
        k.pos(400,500),
        k.anchor("bot"),
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

    k.add([
      k.rect(10, k.height()),
      k.pos(0, 0),
      k.area(),
      k.body({ isStatic: true }),
      k.color(k.rgb(43, 48, 59)),
      "wall"
    ]);

    k.add([
        k.rect(10, k.height()),
        k.pos(k.width() - 10, 0),
        k.area(),
        k.body({ isStatic: true }),
        k.color(k.rgb(43, 48, 59)),
        "wall"
    ]);

    k.onUpdate(() => {
      if (player.exists()) {
        score += k.dt() * 0.1; 
        scoreLabel.text = `SCORE: ${Math.floor(score * 10)}`; 
        const screenWidth = k.width();
        const margin = 20; 

        if (player.pos.x < margin) {
            player.pos.x = margin;
        }
        if (player.pos.x > screenWidth - margin) {
            player.pos.x = screenWidth - margin;
        }
      }
    });
    
    k.onKeyDown("left", () => player.move(-SPEED, 0));
    k.onKeyDown("right", () => player.move(SPEED, 0));

    const initialSpeed = 300.0;
    let projectileSpeed = initialSpeed;
    let spawnDelay = 1.0;

    const spawnEnemy = () => {  
      const type = k.choose(["normal", "bouncy", "sniper"]);
      const projectileWidth = 25; 
      const margin = 10;

      const minX = margin + (projectileWidth / 2);
      const maxX = k.width() - margin - (projectileWidth / 2);

      const x = k.rand(minX, maxX);

      const components: any[] = [
        k.sprite("win"),
        k.scale(0.05),
        k.pos(x, -100),
        k.anchor("center"),
        k.area(),
        k.offscreen({ destroy: true }),
        "enemy",
        type,
      ];

      if (type === "bouncy") {
        components.push(k.color(k.rgb(100, 255, 100)));
        components.push({ bounces: 0 }); // Direct property injection
        components.push(k.move(k.DOWN, projectileSpeed));
      } else if (type === "sniper") {
        components.push(k.color(k.rgb(255, 100, 100)));
        components.push({ state: "falling" }); // Direct property injection
        components.push(k.move(k.DOWN, projectileSpeed));
      } else {
        components.push(k.move(k.DOWN, projectileSpeed));
      }

      k.add(components);


      const currentScore = Math.floor(score * 10);
      const difficultyMultiplier = Math.max(0.1, 1.0 - (currentScore / 250));
      spawnDelay = 1.0 * difficultyMultiplier;
      projectileSpeed = initialSpeed + (1.0 - difficultyMultiplier) * initialSpeed;

      k.wait(spawnDelay, spawnEnemy);
    };

    spawnEnemy();

    k.onUpdate("bouncy", (b) => {
      const floorY = 500;
      if (b.pos.y >= floorY) {
        if (b.bounces < 2) {
          b.pos.y = floorY - 5;
          b.unuse("move"); 
          b.use(k.move(k.UP, projectileSpeed)); 
          b.bounces += 1; // Direct access
          
          k.wait(0.3, () => {
            if (b.exists()) {
              b.unuse("move");
              b.use(k.move(k.DOWN, projectileSpeed));
            }
          });
        }
      }
    });

    k.onUpdate("sniper", async (s) => {
      if (s.state === "falling" && s.pos.y >= k.height() / 2) {
        s.state = "aiming"; // Direct access
        s.unuse("move");
        
        const targetPos = player.exists() ? player.pos.clone() : s.pos.add(0, 200);
        
        // PC Performance Tip: use tween for smoother scaling
        k.tween(s.scale.x, 0.08, 0.2, (val) => s.scale = k.vec2(val));

        await k.wait(0.5);

        if (s.exists()) {
          s.state = "dashing";
          k.tween(s.scale.x, 0.05, 0.1, (val) => s.scale = k.vec2(val));
          const angle = targetPos.sub(s.pos).angle();
          s.use(k.move(angle, projectileSpeed * 1.5));
        }
      }
    });

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