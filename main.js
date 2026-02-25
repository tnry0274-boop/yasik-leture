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
  "초밥"
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

const generateBtn = document.getElementById("generate-btn");
generateBtn.addEventListener("click", renderNightFoods);

renderNightFoods();
