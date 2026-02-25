const nightFoods = [
  "치킨",
  "떡볶이",
  "족발",
  "보쌈",
  "피자",
  "햄버거",
  "라면",
  "닭강정",
  "마라탕",
  "곱창",
  "순대국",
  "초밥",
  "김치찌개",
  "부대찌개",
  "감자탕",
  "삼겹살",
  "닭발",
  "쭈꾸미볶음",
  "오돌뼈",
  "해장국",
  "비빔국수",
  "냉면",
  "우동",
  "돈까스",
  "제육볶음",
  "찜닭",
  "회덮밥",
  "타코야끼",
  "핫도그",
  "토스트",
  "김밥",
  "샌드위치"
];

function pickNightFoods(count = 4) {
  const pool = [...nightFoods];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picks = pool.slice(0, count);
  const bestPick = picks[Math.floor(Math.random() * picks.length)];

  return { picks, bestPick };
}

function renderNightFoods() {
  const menusContainer = document.getElementById("menus");
  const pickEl = document.getElementById("pick");
  const { picks, bestPick } = pickNightFoods();

  menusContainer.innerHTML = "";

  for (const menu of picks) {
    const chip = document.createElement("span");
    chip.className = "menu-chip";
    chip.textContent = menu;
    menusContainer.appendChild(chip);
  }

  pickEl.innerHTML = `오늘의 원픽: <span class="pick-menu">${bestPick}</span>`;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.textContent = theme === "dark" ? "화이트모드" : "다크모드";
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  applyTheme(theme);
}

const generateBtn = document.getElementById("generate-btn");
const themeToggle = document.getElementById("theme-toggle");

generateBtn.addEventListener("click", renderNightFoods);
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

initTheme();
renderNightFoods();
