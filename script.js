/**
 * 致格妮的专属脚本
 * 功能：农历生日判断、飘雪背景、打字机效果、点击礼花、音乐淡入
 */

const container = document.getElementById("typing-container");
const bgm = document.getElementById("bgm");
const lockScreen = document.getElementById("lock-screen");
const finalPhoto = document.getElementById("final-photo");
const canvas = document.getElementById('effect-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let snowflakes = [];
let fireworks = [];
let isTypingFinished = false;
let lineIndex = 0;
let charIndex = 0;
let currentLineElem;
let speed = 80;

// --- 1. 基础工具与适配 ---
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 监听回车解锁
document.getElementById("password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") unlock();
});

// --- 2. 核心逻辑判断 (在一起天数 & 农历生日) ---

function daysTogether() {
  const startDate = new Date("2025-12-31T00:00:00");
  const today = new Date();
  const diffTime = today.setHours(0,0,0,0) - startDate.setHours(0,0,0,0);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function isLunarBirthday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

  // 预设农历腊月十四对应的公历日期
  const lunarDates = {
    2025: "2025-01-13",
    2026: "2026-02-01", 
    2027: "2027-01-21",
    2028: "2028-01-10",
    2029: "2029-01-28",
    2030: "2030-01-17"
  };
  return Object.values(lunarDates).includes(todayStr);
}

// --- 3. 文案配置 ---

const lines = [
  "见字如面，曾老师。",
  "",
  "有些话，",
  "想在今天这个特殊的时刻告诉你。",
  "",
  `这是我们共同走过的第 ${daysTogether()} 天。`,
  "在那些平凡的日子里，",
  "因为有你，",
  "连空气都变得清甜。",
  "",
];

// 🎂 农历腊月十四隐藏文案
if (isLunarBirthday()) {
  lines.push("今天是农历腊月十四。");
  lines.push("全世界都在忙着迎接新年，");
  lines.push("而我只想祝你生日快乐。");
  lines.push("愿你岁岁常欢愉，年年皆胜意。");
  lines.push("");
}

lines.push("愿我们往后余生，");
lines.push("不仅有星辰大海，");
lines.push("更有柴米油盐的温暖。");
lines.push("");
lines.push("—— 肖 sir");

// --- 4. 视觉特效系统 (飘雪 & 礼花) ---

class Snowflake {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.8 + 0.3;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.y += this.speed;
    if (this.y > height) this.y = -10;
  }
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    const colors = ['#ff9a9e', '#fad0c4', '#ffecd2', '#a1c4fd', '#c2e9fb'];
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: 0, y: 0,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }
  update() {
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.12; 
      p.life -= 0.02;
    });
    this.particles = this.particles.filter(p => p.life > 0);
  }
  draw() {
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(this.x + p.x, this.y + p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  snowflakes.forEach(s => { s.update(); s.draw(); });
  fireworks.forEach((f, i) => {
    f.update(); f.draw();
    if (f.particles.length === 0) fireworks.splice(i, 1);
  });
  requestAnimationFrame(animate);
}

// --- 5. 交互逻辑 ---

function unlock() {
  const pwd = document.getElementById("password").value;
  if (pwd === "20251231") {
    lockScreen.style.opacity = "0";
    lockScreen.style.transform = "scale(1.1)";
    setTimeout(() => {
      lockScreen.style.display = "none";
      start();
    }, 1000);
  } else {
    alert("密码不对哦，再想想？");
  }
}

document.body.addEventListener("click", (e) => {
  if (!isTypingFinished) {
    speed = Math.max(20, speed - 20); // 打字中点击加速
  } else {
    fireworks.push(new Firework(e.clientX, e.clientY)); // 结束后点击放礼花
  }
});

function startMusic() {
  bgm.volume = 0;
  bgm.play().catch(() => {});
  let v = 0;
  const fade = setInterval(() => {
    v += 0.05;
    if (v >= 1) { bgm.volume = 1; clearInterval(fade); } 
    else { bgm.volume = v; }
  }, 200);
}

// 带呼吸感的打字机逻辑
async function typeNext() {
  if (lineIndex >= lines.length) {
    if (currentLineElem) currentLineElem.classList.remove("active");
    isTypingFinished = true;
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
    lineIndex++;
    charIndex = 0;
    await new Promise(r => setTimeout(r, 600)); // 空行停顿
    typeNext();
    return;
  }

  if (charIndex < text.length) {
    currentLineElem.textContent += text.charAt(charIndex++);
    
    // 标点停顿逻辑
    let pause = speed;
    if (",，.。!！?？".includes(text.charAt(charIndex-1))) {
      pause = 500; 
    }
    
    setTimeout(typeNext, pause);
  } else {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeNext, 900);
  }
}

function start() {
  // 初始化特效
  for (let i = 0; i < 60; i++) snowflakes.push(new Snowflake());
  animate();
  
  // 启动音乐与打字
  startMusic();
  typeNext();
}