// script.js
const container = document.getElementById("typing-container");
const bgm = document.getElementById("bgm");
const lockScreen = document.getElementById("lock-screen");
const finalPhoto = document.getElementById("final-photo");
const canvas = document.getElementById('effect-canvas');
const ctx = canvas.getContext('2d');

let width, height, snowflakes = [], fireworks = [], isTypingFinished = false;

// --- 基础工具 ---
function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

// --- 腊月十四判断逻辑 ---
function isLunarBirthday() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const year = today.getFullYear();

    // 预设未来几年的农历腊月十四对应的公历日期
    const lunarDates = {
        2025: "2025-01-13", // 2024腊月十四在2025年初
        2026: "2026-02-01", 
        2027: "2027-01-21",
        2028: "2028-01-10",
        2029: "2029-01-28",
        2030: "2030-01-17"
    };

    const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return Object.values(lunarDates).includes(todayStr);
}

function daysTogether() {
    const start = new Date("2025-12-31T00:00:00");
    const today = new Date();
    return Math.floor((today.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / 86400000) + 1;
}

// --- 文案系统 ---
const lines = [
    "曾老师，",
    "",
    "愿你此刻，刚好看到这里。",
    "",
    `这是我们在一起的第 ${daysTogether()} 天。`,
    "",
    "我想留下些什么。",
    "不吵闹，不炫耀。",
    "只在你愿意读的时候存在。",
    "",
];

// 🎂 隐藏生日文案：农历腊月十四触发
if (isLunarBirthday()) {
    lines.push("今天是农历腊月十四。");
    lines.push("全世界都在忙着迎接新年，");
    lines.push("而我只想祝你生日快乐。");
    lines.push("愿你岁岁常欢愉，年年皆胜意。");
    lines.push("");
}

lines.push("—— 肖 sir");

// --- 动画系统（雪花与礼花保持原逻辑） ---
class Snowflake {
    constructor() { this.reset(); }
    reset() { this.x = Math.random() * width; this.y = Math.random() * height; this.size = Math.random() * 2 + 1; this.speed = Math.random() * 0.8 + 0.3; this.opacity = Math.random() * 0.5 + 0.2; }
    update() { this.y += this.speed; if (this.y > height) this.y = -10; }
    draw() { ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
}

class Firework {
    constructor(x, y) {
        this.x = x; this.y = y; this.particles = [];
        const colors = ['#ff9a9e', '#fad0c4', '#ffecd2', '#a1c4fd', '#c2e9fb'];
        for (let i = 0; i < 35; i++) {
            this.particles.push({ x: 0, y: 0, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 1.0, color: colors[Math.floor(Math.random() * colors.length)] });
        }
    }
    update() { this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= 0.02; }); this.particles = this.particles.filter(p => p.life > 0); }
    draw() { this.particles.forEach(p => { ctx.fillStyle = p.color; ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(this.x + p.x, this.y + p.y, 2.5, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1; }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    snowflakes.forEach(s => { s.update(); s.draw(); });
    fireworks.forEach((f, i) => { f.update(); f.draw(); if (f.particles.length === 0) fireworks.splice(i, 1); });
    requestAnimationFrame(animate);
}

// --- 交互逻辑 ---
function unlock() {
    if (document.getElementById("password").value === "20251231") {
        lockScreen.style.opacity = "0";
        setTimeout(() => { lockScreen.style.display = "none"; start(); }, 600);
    } else { alert("不对哦"); }
}

document.getElementById("password").addEventListener("keypress", (e) => { if (e.key === "Enter") unlock(); });

document.body.addEventListener("click", (e) => {
    if (!isTypingFinished) { speed = Math.max(20, speed - 15); } 
    else { fireworks.push(new Firework(e.clientX, e.clientY)); }
});

let speed = 80, lineIndex = 0, charIndex = 0, currentLineElem;

function typeNext() {
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
    if (text === "") { lineIndex++; charIndex = 0; setTimeout(typeNext, 400); return; }
    if (charIndex < text.length) {
        currentLineElem.textContent += text.charAt(charIndex++);
        setTimeout(typeNext, speed);
    } else { lineIndex++; charIndex = 0; setTimeout(typeNext, 900); }
}

function start() {
    for (let i = 0; i < 80; i++) snowflakes.push(new Snowflake());
    animate();
    bgm.volume = 0; bgm.play().catch(() => {});
    let v = 0;
    const fade = setInterval(() => { v += 0.05; if (v >= 1) { bgm.volume = 1; clearInterval(fade); } else { bgm.volume = v; } }, 200);
    typeNext();
}