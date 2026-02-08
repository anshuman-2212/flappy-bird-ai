const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ===== MODE ===== */
let mode = "AI";

/* ===== BIRD ===== */
let bird = {
  x: 80,
  y: 300,
  radius: 15,
  velocity: 0,
  gravity: 0.5,
  jump: -8
};

/* ===== PIPES ===== */
let pipeWidth = 70;
let pipeGap = 160;
let pipeX = canvas.width;
let pipeTopHeight = randomPipe();

/* ===== GAME ===== */
let score = 0;
let gameOver = false;

/* ===== FUNCTIONS ===== */

function randomPipe() {
  return Math.floor(Math.random() * 250) + 100;
}

function resetPipe() {
  pipeX = canvas.width;
  pipeTopHeight = randomPipe();
  score++;
}

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "green";

  ctx.fillRect(pipeX, 0, pipeWidth, pipeTopHeight);

  ctx.fillRect(
    pipeX,
    pipeTopHeight + pipeGap,
    pipeWidth,
    canvas.height
  );
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
  ctx.fillText("Mode: " + mode, 20, 70);
}

function collisionCheck() {
  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    gameOver = true;
  }

  if (
    bird.x + bird.radius > pipeX &&
    bird.x - bird.radius < pipeX + pipeWidth
  ) {
    if (
      bird.y - bird.radius < pipeTopHeight ||
      bird.y + bird.radius > pipeTopHeight + pipeGap
    ) {
      gameOver = true;
    }
  }
}

/* ===== AI ===== */
function aiDecision() {
  let pipeCenter = pipeTopHeight + pipeGap / 2;

  if (bird.y > pipeCenter) {
    bird.velocity = bird.jump;
  }
}

/* ===== KEYBOARD CONTROL ===== */
document.addEventListener("keydown", function(e) {

  if (mode === "MANUAL" && e.code === "Space") {
    bird.velocity = bird.jump;
  }

  if (e.key === "m" || e.key === "M") {
    mode = "MANUAL";
  }

  if (e.key === "a" || e.key === "A") {
    mode = "AI";
  }

});

/* ===== GAME LOOP ===== */

function update() {

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 110, 300);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (mode === "AI") {
    aiDecision();
  }

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  pipeX -= 3;
  if (pipeX < -pipeWidth) {
    resetPipe();
  }

  drawBird();
  drawPipes();
  drawScore();
  collisionCheck();

  requestAnimationFrame(update);
}

update();
