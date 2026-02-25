const nightFoods = [
  { name: "치킨", image: "https://source.unsplash.com/600x400/?fried-chicken" },
  { name: "떡볶이", image: "https://source.unsplash.com/600x400/?tteokbokki" },
  { name: "족발", image: "https://source.unsplash.com/600x400/?pork-hock" },
  { name: "보쌈", image: "https://source.unsplash.com/600x400/?boiled-pork" },
  { name: "피자", image: "https://source.unsplash.com/600x400/?pizza" },
  { name: "햄버거", image: "https://source.unsplash.com/600x400/?burger" },
  { name: "라면", image: "https://source.unsplash.com/600x400/?ramen" },
  { name: "닭강정", image: "https://source.unsplash.com/600x400/?korean-fried-chicken" },
  { name: "마라탕", image: "https://source.unsplash.com/600x400/?spicy-hotpot" },
  { name: "곱창", image: "https://source.unsplash.com/600x400/?grilled-intestines" },
  { name: "순대국", image: "https://source.unsplash.com/600x400/?soup" },
  { name: "초밥", image: "https://source.unsplash.com/600x400/?sushi" },
  { name: "김치찌개", image: "https://source.unsplash.com/600x400/?kimchi-stew" },
  { name: "부대찌개", image: "https://source.unsplash.com/600x400/?stew" },
  { name: "감자탕", image: "https://source.unsplash.com/600x400/?pork-bone-soup" },
  { name: "삼겹살", image: "https://source.unsplash.com/600x400/?samgyeopsal" },
  { name: "닭발", image: "https://source.unsplash.com/600x400/?spicy-chicken" },
  { name: "쭈꾸미볶음", image: "https://source.unsplash.com/600x400/?stir-fried-octopus" },
  { name: "오돌뼈", image: "https://source.unsplash.com/600x400/?spicy-pork" },
  { name: "해장국", image: "https://source.unsplash.com/600x400/?hangover-soup" },
  { name: "비빔국수", image: "https://source.unsplash.com/600x400/?bibim-noodles" },
  { name: "냉면", image: "https://source.unsplash.com/600x400/?cold-noodles" },
  { name: "우동", image: "https://source.unsplash.com/600x400/?udon" },
  { name: "돈까스", image: "https://source.unsplash.com/600x400/?tonkatsu" },
  { name: "제육볶음", image: "https://source.unsplash.com/600x400/?spicy-pork-stirfry" },
  { name: "찜닭", image: "https://source.unsplash.com/600x400/?braised-chicken" },
  { name: "회덮밥", image: "https://source.unsplash.com/600x400/?raw-fish-rice" },
  { name: "타코야끼", image: "https://source.unsplash.com/600x400/?takoyaki" },
  { name: "핫도그", image: "https://source.unsplash.com/600x400/?hotdog" },
  { name: "토스트", image: "https://source.unsplash.com/600x400/?toast" },
  { name: "김밥", image: "https://source.unsplash.com/600x400/?gimbap" },
  { name: "샌드위치", image: "https://source.unsplash.com/600x400/?sandwich" }
];

const voteStorageKey = "nightFoodVotes";
let currentBestPick = null;

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

function readVotes() {
  const raw = localStorage.getItem(voteStorageKey);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveVotes(votes) {
  localStorage.setItem(voteStorageKey, JSON.stringify(votes));
}

function getVoteSummary(menuName) {
  const votes = readVotes();
  const item = votes[menuName] || { like: 0, dislike: 0 };
  return item;
}

function updateVoteStatus(menuName) {
  const voteStatus = document.getElementById("vote-status");
  const { like, dislike } = getVoteSummary(menuName);
  voteStatus.textContent = `누적 투표 - 좋아요 ${like} / 별로예요 ${dislike}`;
}

function voteCurrent(type) {
  if (!currentBestPick) {
    return;
  }

  const votes = readVotes();
  const menuName = currentBestPick.name;

  if (!votes[menuName]) {
    votes[menuName] = { like: 0, dislike: 0 };
  }

  votes[menuName][type] += 1;
  saveVotes(votes);
  updateVoteStatus(menuName);
}

function renderNightFoods() {
  const menusContainer = document.getElementById("menus");
  const pickEl = document.getElementById("pick");
  const voteBox = document.getElementById("vote-box");
  const voteTitle = document.getElementById("vote-title");
  const { picks, bestPick } = pickNightFoods();

  currentBestPick = bestPick;
  menusContainer.innerHTML = "";

  for (const menu of picks) {
    const card = document.createElement("article");
    card.className = "menu-card";

    const img = document.createElement("img");
    img.className = "menu-image";
    img.src = menu.image;
    img.alt = `${menu.name} 사진`;
    img.loading = "lazy";

    const name = document.createElement("span");
    name.className = "menu-name";
    name.textContent = menu.name;

    card.appendChild(img);
    card.appendChild(name);
    menusContainer.appendChild(card);
  }

  pickEl.innerHTML = `오늘의 원픽: <span class="pick-menu">${bestPick.name}</span>`;
  voteTitle.textContent = `${bestPick.name}, 이 메뉴 어땠나요?`;
  voteBox.hidden = false;
  updateVoteStatus(bestPick.name);
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
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");

generateBtn.addEventListener("click", renderNightFoods);
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});
likeBtn.addEventListener("click", () => voteCurrent("like"));
dislikeBtn.addEventListener("click", () => voteCurrent("dislike"));

initTheme();
renderNightFoods();
