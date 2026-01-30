const container = document.getElementById("typing-container");
const bgm = document.getElementById("bgm");
const lockScreen = document.getElementById("lock-screen");
const letterContainer = document.getElementById("letter-container");
const finalPhoto = document.getElementById("final-photo");
const snowCanvas = document.getElementById('snow-canvas');
const sCtx = snowCanvas.getContext('2d');

let snowflakes = [];
let lineIndex = 0;
let charIndex = 0;
let currentLineElem;
let speed = 80;

// --- 1. 静谧飘雪 ---
function initSnow() {
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
  for (let i = 0; i < 50; i++) snowflakes.push(new Snowflake());
  animateSnow();
}

class Snowflake {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * snowCanvas.width;
    this.y = Math.random() * snowCanvas.height;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.5 + 0.2;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.y += this.speed;
    if (this.y > snowCanvas.height) this.y = -10;
  }
  draw() {
    sCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    sCtx.beginPath();
    sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    sCtx.fill();
  }
}

function animateSnow() {
  sCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowflakes.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animateSnow);
}

// --- 2. 解锁与信封开启 ---
function unlock() {
  if (document.getElementById("password").value === "20251231") {
    lockScreen.style.opacity = "0";
    setTimeout(() => {
      lockScreen.style.display = "none";
      letterContainer.classList.add("open"); // 信件滑出动效
      start();
    }, 1000);
  } else { alert("不对哦，请重新输入"); }
}

// 监听回车
document.getElementById("password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") unlock();
});

// --- 3. 打字逻辑与文案 ---
function daysTogether() {
  const start = new Date("2025-12-31T00:00:00");
  const today = new Date();
  return Math.floor((today.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / 86400000) + 1;
}

const lines = [
  "见字如面，曾老师。",
  "",
  "这是一份迟到的，或者是正当其时的告白。",
  "",
  `这是我们在一起的第 ${daysTogether()} 天。`,
  "在那些平凡的日子里，",
  "因为有你，",
  "我开始学会去观察每一场日落，",
  "去感受每一阵微风。",
  "",
  "愿你此刻，",
  "刚好看到这里。",
  "",
  "—— 肖 sir"
];

function typeNext() {
  if (lineIndex >= lines.length) {
    if (currentLineElem) currentLineElem.classList.remove("active");
    finalPhoto.classList.add("show");
    return;
  }

  if (charIndex === 0) {
    if (currentLineElem) currentLineElem.classList.remove("active");
    currentLineElem = document.createElement("p");
    currentLineElem.className = "typing-line active";
    container.appendChild(currentLineElem);
  }

  const text = lines[lineIndex];
  if (text === "") {
    lineIndex++; charIndex = 0;
    setTimeout(typeNext, 600); return;
  }

  if (charIndex < text.length) {
    currentLineElem.textContent += text.charAt(charIndex++);
    // 遇到标点停顿一下，更有情感
    let pause = speed;
    if ("，。".includes(text.charAt(charIndex-1))) pause = 500;
    setTimeout(typeNext, pause);
  } else {
    lineIndex++; charIndex = 0;
    setTimeout(typeNext, 900);
  }
}

// 点击加速
document.body.addEventListener("click", () => {
  speed = 20;
});

function start() {
  initSnow();
  bgm.play().catch(() => {});
  setTimeout(typeNext, 1200); // 等待信件滑出动画完成后开始打字
}