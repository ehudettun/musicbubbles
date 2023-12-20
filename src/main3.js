import kaboom from "kaboom";

const k = kaboom({
  background: [74, 48, 82],
});

k.loadSprite("bubble", "/sprites/bubble.png");
k.loadSound("a", "/sounds/a.mp3");
k.loadSound("b", "/sounds/b.mp3");
k.loadSound("c", "/sounds/c.mp3");
k.loadSound("d", "/sounds/d.mp3");
k.loadSound("e", "/sounds/e.mp3");
k.loadSound("f", "/sounds/f.mp3");
k.loadSound("g", "/sounds/g.mp3");

const notes = ["a", "b", "c", "d", "e", "f", "g"];

k.scene("gameplay", () => {
  const BUBBLE_SPEED = 6000; // Adjusted speed
  const BUBBLE_FREQUENCY = 3;
  const BPM = 120;

  const sky = k.add([
    k.rect(k.width(), k.height()),
    k.color(0, 0, 0),
    k.opacity(0),
  ]);

  function spawnBubble() {
    const note = k.choose(notes);

    k.add([
      k.sprite("bubble"),
      k.pos(k.rand(0, k.width()), 0),
      "bubble",
      { speed: BUBBLE_SPEED, note: note },
    ]);

    k.wait(BUBBLE_FREQUENCY, spawnBubble);
  }

  let beat = 1;
  let beatInterval = 60 / BPM;
  let nextBeatTime = 0;

  k.onUpdate("bubble", (t) => {
    t.move(0, t.speed * k.dt());

    if (t.pos.y - t.height > k.height()) {
      k.destroy(t);
    }

    if (k.time() >= nextBeatTime) {
      k.play(t.note);
      nextBeatTime += beatInterval;
      t.scale = k.vec2(2, 2); // Scale up
      k.wait(beatInterval / 2, () => {
        t.scale = k.vec2(1, 1); // Scale down
      });
    }
  });

  function createClickableKeyboard() {
    const keyWidth = k.width() / notes.length;

    notes.forEach((note, i) => {
      const left = i * keyWidth;
      const right = (i + 1) * keyWidth;

      const keyEntity = k.add([
        k.rect(keyWidth, 50),
        k.pos(left, k.height() - 50),
        k.color(i % 2 === 0 ? k.rgb(255, 255, 255) : k.rgb(0, 0, 0)),
        {
          note: note,
          left: left,
          right: right,
        },
      ]);

      k.onClick(() => {
        const mousePos = k.mousePos();
        const clickedKey = k.get("keyboardKey").find((k) => {
          return mousePos.x >= k.left && mousePos.x <= k.right;
        });

        if (clickedKey) {
          const bubble = k.get("bubble").find((b) => b.note === clickedKey.note);

          if (bubble) {
            k.play(bubble.note);
            k.destroy(bubble);
          }
        }
      }, { target: keyEntity });
    });
  }

  createClickableKeyboard();
  spawnBubble();
});

k.go("gameplay");
