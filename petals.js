// 🌸 仅桌面端启用花瓣
if (window.innerWidth > 768) {
  const count = 18;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDelay = Math.random() * 10 + "s";
    petal.style.animationDuration = 10 + Math.random() * 8 + "s";
    document.body.appendChild(petal);
  }
}
