const container = document.getElementById("typing-container");
const bgm = document.getElementById("bgm");
const lockScreen = document.getElementById("lock-screen");
const finalPhoto = document.getElementById("final-photo");

[cite_start]// 🔒 解锁逻辑 (密码：20251231) [cite: 1]
function unlock() {
  const pwd = document.getElementById("password").value;
  if (pwd === "20251231") {
    lockScreen.style.opacity = "0";
    setTimeout(() => {
      lockScreen.style.display = "none";
      start();
    }, 1000);
  } else {
    alert("不对哦，请重新输入");
  }
}

// 监听回车键
document.getElementById("password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") unlock();
});

[cite_start]// 🕰 计算在一起的天数 [cite: 1]
function daysTogether() {
  const startDate = new Date("2025-12-31T00:00:00");
  const today = new Date();
  const diffTime = today.setHours(0,0,0,0) - startDate.setHours(0,0,0,0);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

[cite_start]// 🎂 生日判断 (2月1日) [cite: 1]
function isBirthday() {
  const d = new Date();
  return d.getMonth() === 1 && d.getDate() === 1;
}

// 💗 文案数组
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
[cite_start]// 点击屏幕任意位置加速 [cite: 1]
document.body.addEventListener("click", () => {
  speed = Math.max(25, speed - 15);
});

[cite_start]// 🎵 音乐淡入逻辑 [cite: 1]
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
  // 检查是否全部打完
  if (lineIndex >= lines.length) {
    if (currentLineElem) currentLineElem.classList.remove("active");
    
    // 📸 展示照片
    finalPhoto.classList.add("show");
    setTimeout(() => {
      finalPhoto.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 800);
    return;
  }

  // 开启新行
  if (charIndex === 0) {
    if (currentLineElem) currentLineElem.classList.remove("active");
    
    currentLineElem = document.createElement("p");
    currentLineElem.className = "typing-line active";
    container.appendChild(currentLineElem);
    
    if (lineIndex === 0) startMusic();
  }

  const text = lines[lineIndex];

  // 处理空行：停顿一下直接下一行
  if (text.length === 0) {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeNext, 500);
    return;
  }

  // 逐字输入
  if (charIndex < text.length) {
    currentLineElem.textContent += text.charAt(charIndex++);
    setTimeout(typeNext, speed);
  } else {
    // 这一行打完了，换行前停顿
    lineIndex++;
    charIndex = 0;
    setTimeout(typeNext, 900);
  }
}

function start() {
  typeNext();
}