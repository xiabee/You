const container = document.getElementById("typing-container");
const bgm = document.getElementById("bgm");
const lockScreen = document.getElementById("lock-screen");
const finalPhoto = document.getElementById("final-photo");

// 🔒 解锁（纪念日：2025-12-31）
function unlock() {
  const pwd = document.getElementById("password").value;
  if (pwd === "20251231") {
    lockScreen.style.display = "none";
    start();
  } else {
    alert("密码不对哦");
  }
}


// 🕰 在一起第 X 天
function daysTogether() {
  const start = new Date("2025-12-31");
  const today = new Date();
  const diff = today - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

// 🎂 是否生日（2026-02-01）
function isBirthday() {
  const d = new Date();
  return d.getFullYear() === 2026 && d.getMonth() === 1 && d.getDate() === 1;
}

// 💗 文案
const lines = [
  "曾老师，",
  "",
  isBirthday() ? "今天是你的生日。" : "今天不是一个普通的日子。",
  "",
  `这是我们在一起的第 ${daysTogether()} 天。`,
  "",
  "我想留下些什么。",
  "不吵闹，不炫耀。",
  "只在你愿意读的时候存在。",
  "",
  "愿你此刻，",
  "刚好看到这里。",
];

// 🎂 生日隐藏句（只在当天 push）
if (isBirthday()) {
  lines.push("");
  lines.push("这一行，只会在你生日这天出现。");
  lines.push("因为你本身，就值得被单独庆祝。");
}

// 署名（始终最后）
lines.push("");
lines.push("—— 肖 sir");


// ⏩ 点击加速
let speed = 80;
document.body.addEventListener("click", () => {
  speed = Math.max(20, speed - 15);
});


// 🎵 音乐淡入
function startMusic() {
  bgm.volume = 0;
  bgm.play().catch(() => {});
  let v = 0;
  const fade = setInterval(() => {
    v += 0.02;
    bgm.volume = Math.min(v, 1);
    if (v >= 1) clearInterval(fade);
  }, 200);
}

// ✍ 打字逻辑
let lineIndex = 0;
let charIndex = 0;
let currentLine;

function typeNext() {
if (lineIndex >= lines.length) {
  finalPhoto.classList.remove("hidden");

  // ✨ 轻微上滑，让照片进入视野中央
  setTimeout(() => {
    finalPhoto.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 800);

  return;
}

  if (charIndex === 0) {
    currentLine = document.createElement("p");
    currentLine.className = "typing-line";
    container.appendChild(currentLine);

    if (lineIndex === 0) startMusic();
  }

  const text = lines[lineIndex];
  if (charIndex < text.length) {
    currentLine.textContent += text.charAt(charIndex++);
    setTimeout(typeNext, speed);
  } else {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeNext, 600);
  }
}

// ▶ 启动
function start() {
  typeNext();
}
