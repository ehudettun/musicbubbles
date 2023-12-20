import kaboom from "kaboom";

const levels = {"1":{"notes": ["a", "b", "c", "d", "e", "f", "g"],"bubblespeed":"6000","bubblefrequency":"2", "bpm":"120"},"2":{"bubblespeed":"6000","bubblefrequency":"2", "bpm":"120"}}
let currentLevel = 1;

kaboom({
  background: [74, 48, 82],
});

loadSprite("bubble", "/sprites/bubble.png");
loadSound("a", "/sounds/a.mp3");
loadSound("b", "/sounds/b.mp3");
loadSound("c", "/sounds/c.mp3");
loadSound("d", "/sounds/d.mp3");
loadSound("e", "/sounds/e.mp3");
loadSound("f", "/sounds/f.mp3");
loadSound("g", "/sounds/g.mp3");

const notes = ["a", "b", "c", "d", "e", "f", "g"];
const keyboardNotes = ["c", "c#", "d", "d#", "e", "f","f#", "g", "g#", "a", "a#", "b"];

scene("lose", () => {
  add([
      text("Game Over"),
      pos(center()),
      anchor("center"),
  ])
})

scene("gameplay", () => {
  const BUBBLE_SPEED = 6000; // Adjusted speed
  const BUBBLE_FREQUENCY = 2;
  const BPM = 120;

	const timer = add([
		text(0),
		pos(12, 32),
		fixed(),
		{ time: 0 },
	])

	timer.onUpdate(() => {
		timer.time += dt()
		timer.text = timer.time.toFixed(2)
	})

  const bubbleCounter = add([
		text('0/0 Fails:0'),
		pos(200, 32),
		fixed(),
		{ popped: 0,
    totalBubbles: 0,
  fails: 0 },
	])

	bubbleCounter.onUpdate(() => {
		const { popped, totalBubbles, fails } = bubbleCounter;
  bubbleCounter.text = `${popped}/${totalBubbles} Fails: ${fails}`;
	})

  const level = add([
		text('Level: '),
		pos(200, 32),
		fixed(),
		{ popped: 0,
    totalBubbles: 0,
  fails: 0 },
	])

	bubbleCounter.onUpdate(() => {
		const { popped, totalBubbles, fails } = bubbleCounter;
  bubbleCounter.text = `${popped}/${totalBubbles} Fails: ${fails}`;
	})


  const sky = add([
    rect(width(), height()),
    color(0, 0, 0),
    opacity(0),
  ]);

  function spawnBubble() {
    const note = choose(notes);

    add([
      sprite("bubble"),
      pos(rand(0, width()), 0),
      "bubble",
      { speed: BUBBLE_SPEED, note: note },
    ]);
    bubbleCounter.totalBubbles +=1 
    wait(BUBBLE_FREQUENCY, spawnBubble);
  }

  let beat = 1;
  let beatInterval = 60 / BPM;
  let nextBeatTime = 0;

  onUpdate("bubble", (t) => {
    t.move(0, t.speed * dt());

    if (t.pos.y - t.height > height()-200) {
      destroy(t);
      bubbleCounter.fails +=1 
    }

    if (time() >= nextBeatTime) {
      play(t.note);
      nextBeatTime += beatInterval;
      t.scale = vec2(1.2, 1.2); // Scale up
      wait(beatInterval / 2, () => {
        t.scale = vec2(1, 1); // Scale down
      });
    }
  });


  // Create a simple keyboard
  const keys = [];
  const keyWidth = width() / keyboardNotes.length;
  keyboardNotes.forEach((note, i) => {
    console.log(note)
    const key =  add([
      rect(keyWidth, 100),
      pos(i * keyWidth, height() - 100),
      color(note.includes('#') ? rgb(0, 0, 0) : rgb(255, 255, 255)),
      outline(2),
      area()
    ]);

	

    key.onClick(() => {
      const bubble = get("bubble").find((b) => b.note === note);

      if (bubble) {
        play(bubble.note);
        destroy(bubble);
        bubbleCounter.popped += 1
        
      }
    });
  });

  

  spawnBubble();
});

wait(10000, go("gameplay"));

