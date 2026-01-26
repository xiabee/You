// 🔒 纪念日密码
const CORRECT_PASSWORD = "20251231";

document.getElementById("unlock").onclick = () => {
  const input = document.getElementById("password").value;
  if (input === CORRECT_PASSWORD) {
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  } else {
    document.getElementById("error").innerText = "不太对哦，再想想 🤍";
  }
};

// 🎵 音乐控制
const musicBtn = document.getElementById("music-btn");
const bgm = document.getElementById("bgm");
let playing = false;

musicBtn.onclick = () => {
  if (!playing) {
    bgm.play();
    musicBtn.innerText = "⏸";
  } else {
    bgm.pause();
    musicBtn.innerText = "🎵";
  }
  playing = !playing;
};

// 💌 进入信件
document.getElementById("enter").onclick = () => {
  document.querySelector(".cover").style.display = "none";
  document.querySelector(".letter").classList.remove("hidden");

  new Typed("#typed", {
    strings: [
      "曾老师，生日快乐。",
      "",
      "今天是 2026 年 2 月 1 日。",
      "你的农历生日。",
      "",
      "我想了很久，要送你什么。",
      "后来觉得，",
      "有些话，还是想慢慢说给你听。",
      "",
      "所以写了这个小小的页面。",
      "",
      "不盛大，也不喧闹。",
      "但每一行，都是认真的。",
      "",
      "谢谢你出现在我的生活里。",
      "谢谢你成为格妮，也成为 Jenny。",
      "",
      "以后的生日，",
      "我都想陪你一起过。",
      "",
      "—— 永远偏向你的那个人"
    ],
    typeSpeed: 45,
    backSpeed: 0,
    showCursor: false
  });
};
