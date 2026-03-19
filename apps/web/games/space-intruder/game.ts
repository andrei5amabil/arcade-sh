import kaplay from "kaplay";

export const startSpaceIntruder = async (canvas: HTMLCanvasElement) => {
  const user = JSON.parse(localStorage.getItem("arcade_user") || "{}");

  const k = kaplay({
    canvas: canvas,
    width: 800,
    height: 600,
    letterbox: true,
    background: [26, 27, 36], 
  });

  k.loadSprite("bean", "/sprites/bean.png");
  k.loadSprite("ghosty", "/sprites/ghosty.png");

  let score = 0;
  let wave = 1;
  let direction = 1;
  const SPEED = 350;
  const ENEMY_SPEED = 100;

  k.onLoad(() => {
    // 1. UI Labels
    const scoreLabel = k.add([
      k.text(`SCORE: ${score}`, { size: 18 }),
      k.pos(20, 20),
    ]);

    const waveLabel = k.add([
      k.text(`WAVE: ${wave}`, { size: 18 }),
      k.pos(k.width() - 120, 20),
      k.color(187, 154, 247), 
    ]);

    const player = k.add([
      k.sprite("bean"),
      k.pos(k.width() / 2, k.height() - 100), 
      k.area(),
      k.anchor("center"),
      "player",
    ]);

    function spawnWave() {
        waveLabel.text = `WAVE: ${wave}`;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
            k.add([
                k.sprite("ghosty"),
                k.pos(j * 80 + 200, i * 60 + 80),
                k.area(),
                k.health(wave),
                "enemy",
            ]);
            }
        }
    }

    spawnWave();

    k.onKeyDown("left", () => player.pos.x > 30 && player.move(-SPEED, 0));
    k.onKeyDown("right", () => player.pos.x < k.width() - 30 && player.move(SPEED, 0));

    k.onKeyPress("space", () => {
      k.add([
        k.rect(4, 12),
        k.pos(player.pos.x, player.pos.y - 20),
        k.area(),
        k.color(224, 175, 104),
        k.anchor("center"),
        k.move(k.UP, 600),
        k.offscreen({ destroy: true }),
        "bullet",
      ]);
      if( wave > 3 ){
        k.add([
        k.rect(4, 12),
        k.pos(player.pos.x-10, player.pos.y - 20),
        k.area(),
        k.color(224, 175, 104),
        k.anchor("center"),
        k.move(k.UP, 600),
        k.offscreen({ destroy: true }),
        "bullet",
      ]);
      }
      if( wave > 5 ){
        k.add([
        k.rect(4, 12),
        k.pos(player.pos.x+10, player.pos.y - 20),
        k.area(),
        k.color(224, 175, 104),
        k.anchor("center"),
        k.move(k.UP, 600),
        k.offscreen({ destroy: true }),
        "bullet",
      ]);
      }
    });

    k.onCollide("bullet", "enemy", (b, e) => {
      k.destroy(b);
      
      e.hurt(1);
      
      e.opacity = 0.5;
      k.wait(0.05, () => e.opacity = 1);
    });

    k.on("death", "enemy", (e) => {
      k.destroy(e);
      score += 3 * wave;
      scoreLabel.text = `SCORE: ${score}`;

      if (k.get("enemy").length === 0) {
        wave++;
        k.wait(1, spawnWave); 
      }
    });

    k.onUpdate("enemy", (e) => {
      e.move((ENEMY_SPEED + (wave * 10)) * direction, 0);

      if (e.pos.x >= k.width() - 40 || e.pos.x <= 40) {
        direction *= -1;
        k.get("enemy").forEach((en) => {
          en.pos.y += 20;
          if (en.pos.y >= player.pos.y) saveAndQuit();
        });
      }
    });

    async function saveAndQuit() {
      k.debug.paused = true;
      if (user.id) {
        await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            player_id: user.id, 
            game_id: "space-intruder", 
            score: score 
          }),
        });
      }
      alert(`SYSTEM_FAILURE // WAVE_REACHED: ${wave} // SCORE: ${score}`);
      window.location.reload();
    }
  });

  return k;
};