const container = document.getElementById("typing-container");
const bgm = document.getElementById("bgm");
const lockScreen = document.getElementById("lock-screen");
const finalPhoto = document.getElementById("final-photo");

// 🔒 解锁逻辑
function unlock() {
  const pwd = document.getElementById("password").value;
  if (pwd === "20251231") {
    // 立即开始淡出动画 
    lockScreen.style.opacity = "0";
    setTimeout(() => {
      lockScreen.style.display = "none";
      start(); // 立即触发打字 
    }, 600); 
  } else {
    alert("密码不对哦，请重新输入");
  }
}

// 监听回车解锁 
document.getElementById("password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") unlock();
});

// 🕰 计算在一起的天数
function daysTogether() {
  const startDate = new Date("2025-12-31T00:00:00");
  const today = new Date();
  const diffTime = today.setHours(0,0,0,0) - startDate.setHours(0,0,0,0);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// 🎂 生日判断 (2月1日)
function isBirthday() {
  const d = new Date();
  return d.getMonth() === 1 && d.getDate() === 1;
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
  "",
  "—— 肖 sir"
];

let speed = 80;
// 点击加速 
document.body.addEventListener("click", () => {
  speed = Math.max(25, speed - 15);
});

// 🎵 音乐淡入 
function startMusic() {
  bgm.volume = 0;
  bgm.play().catch(() => {});
  let v = 0;
  const fade = setInterval(() => {
    v += 0.05;
    if (v >= 1) {
      bgm.volume = 1;
      clearInterval(fade);
    } else {
      bgm.volume = v;
    }
  }, 200);
}

let lineIndex = 0;
let charIndex = 0;
let currentLineElem;

function typeNext() {
  if (lineIndex >= lines.length) {
    if (currentLineElem) currentLineElem.classList.remove("active");
    // 显示照片并平滑滚动 
    finalPhoto.classList.add("show");
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
    
    if (lineIndex === 0) startMusic();
  }

  const text = lines[lineIndex];

  if (text.length === 0) {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeNext, 400);
    return;
  }

  if (charIndex < text.length) {
    currentLineElem.textContent += text.charAt(charIndex++);
    setTimeout(typeNext, speed);
  } else {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeNext, 850);
  }
}

function start() {
  container.innerHTML = "";
  typeNext();
}