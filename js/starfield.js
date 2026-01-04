const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let width, height;

/* ================= CANVAS SETUP ================= */
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ================= BACKGROUND STARS ================= */
const STAR_COUNT = 180;
const stars = [];

function initStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.5 + 0.3,

      // subtle drift
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05
    });
  }
}
initStars();

function drawStars() {
  ctx.fillStyle = "#ffffff";
  stars.forEach(star => {
    ctx.globalAlpha = star.alpha;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function updateStars() {
  stars.forEach(star => {
    star.x += star.vx;
    star.y += star.vy;

    // wrap around edges
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;
  });
}

/* ================= SHOOTING STAR CLASS ================= */
class ShootingStar {
  constructor() {
    // Spawn outside viewport
    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) {
      this.x = Math.random() * width;
      this.y = -120;
    } else if (edge === 1) {
      this.x = width + 120;
      this.y = Math.random() * height;
    } else if (edge === 2) {
      this.x = Math.random() * width;
      this.y = height + 120;
    } else {
      this.x = -120;
      this.y = Math.random() * height;
    }

    const angle = Math.random() * Math.PI * 2;
    const speed = 14 + Math.random() * 6;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.life = 0;
    this.maxLife = 24 + Math.random() * 10;
    this.length = 220 + Math.random() * 200;

    const palette = [
      [170, 200, 255], // cool blue
      [190, 170, 255], // violet
      [140, 220, 255], // cyan
      [255, 220, 200]  // warm white
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
  }

  draw() {
    const progress = this.life / this.maxLife;
    const alpha = 1 - progress;

    const tailX = this.x - this.vx * this.length * 0.045;
    const tailY = this.y - this.vy * this.length * 0.045;

    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      tailX,
      tailY
    );

    gradient.addColorStop(
      0,
      `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha})`
    );
    gradient.addColorStop(
      1,
      `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0)`
    );

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
  }

  isDead() {
    return this.life > this.maxLife;
  }
}

/* ================= SHOOTING STAR SYSTEM ================= */
const shootingStars = [];
const SHOOTING_STAR_PROBABILITY = 0.005;

function maybeSpawnShootingStar() {
  if (Math.random() < SHOOTING_STAR_PROBABILITY) {
    shootingStars.push(new ShootingStar());
  }
}

/* ================= MAIN ANIMATION LOOP ================= */
function animate() {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";

  updateStars();
  drawStars();

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i];
    star.update();
    star.draw();
    if (star.isDead()) shootingStars.splice(i, 1);
  }

  maybeSpawnShootingStar();
  requestAnimationFrame(animate);
}

animate();
