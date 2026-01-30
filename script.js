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
let speed = 120; // 🐌 速度调慢，更有读信感

// --- 1. 农历生日判断 (腊月十四) ---
function isLunarBirthday() {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const birthdayMap = { 2025: "2025-01-13", 2026: "2026-02-01", 2027: "2027-01-21" };
  return Object.values(birthdayMap).includes(todayStr);
}

function daysTogether() {
  const start = new Date("2025-12-31T00:00:00");
  const today = new Date();
  return Math.floor((today.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / 86400000) + 1;
}

const isTodayBirthday = isLunarBirthday();
const lines = [
  "见字如面，曾老师。",
  "",
  `这是我们在一起的第 ${daysTogether()} 天。`,
  "也是我陪你度过的，",
  "很普通却又很重要的一天。",
  "",
  "我一直在想，",
  "该用什么样的文字去定义我们的相遇。",
  "后来发现，",
  "最好的定义，就是你正在读这段话的瞬间。",
  "",
];

if (isTodayBirthday) {
  lines.push("今天是农历腊月十四。");
  lines.push("你是这世间，我最想私藏的惊喜。");
  lines.push("祝你生日快乐，格妮。");
} else {
  lines.push("( ⚠️ 提示：信件末尾还有一段话，");
  lines.push("会在农历腊月十四那天自动开启。");
  lines.push("记得那天再来拆一次信。 )");
}
lines.push("", "—— 肖 sir");

// --- 2. 打字与自动跟随逻辑 ---
function typeNext() {
  if (lineIndex >= lines.length) {
    if (currentLineElem) currentLineElem.classList.remove("active");
    finalPhoto.classList.add("show");
    // 结束后滚动到照片位置
    setTimeout(() => {
        finalPhoto.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);
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
    setTimeout(typeNext, 800); 
    return;
  }

  if (charIndex < text.length) {
    currentLineElem.textContent += text.charAt(charIndex++);
    
    // ✨ 核心优化：自动翻动跟随
    // 每次打字时，让窗口平滑滚动到当前行
    currentLineElem.scrollIntoView({ behavior: "smooth", block: "end" });

    let pause = speed;
    if ("，。！".includes(text.charAt(charIndex-1))) pause = 600; 
    setTimeout(typeNext, pause);
  } else {
    lineIndex++; charIndex = 0;
    setTimeout(typeNext, 1200); // 行与行之间停顿长一点
  }
}

// --- 3. 基础引擎 (雪花/解锁等) ---
class Snowflake {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * snowCanvas.width;
    this.y = Math.random() * snowCanvas.height;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.5 + 0.2;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() { this.y += this.speed; if (this.y > snowCanvas.height) this.y = -10; }
  draw() { sCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; sCtx.beginPath(); sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); sCtx.fill(); }
}

function animateSnow() {
  sCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowflakes.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animateSnow);
}

function unlock() {
  if (document.getElementById("password").value === "20251231") {
    lockScreen.style.opacity = "0";
    setTimeout(() => { 
        lockScreen.style.display = "none"; 
        letterContainer.classList.add("open"); 
        start(); 
    }, 1000);
  } else { alert("密码不对哦"); }
}

function start() {
  snowCanvas.width = window.innerWidth; snowCanvas.height = window.innerHeight;
  for (let i = 0; i < 50; i++) snowflakes.push(new Snowflake());
  animateSnow();
  bgm.play().catch(() => {});
  setTimeout(typeNext, 1500);
}

// 监听回车解锁
document.getElementById("password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") unlock();
});

// 点击可以稍微提速，但不会变飞快
document.body.addEventListener("click", () => { speed = 50; });