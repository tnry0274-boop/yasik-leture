const nightFoods = [
  { name: "치킨", keyword: "fried-chicken" },
  { name: "떡볶이", keyword: "tteokbokki" },
  { name: "족발", keyword: "pork-hock" },
  { name: "보쌈", keyword: "boiled-pork" },
  { name: "피자", keyword: "pizza" },
  { name: "햄버거", keyword: "burger" },
  { name: "라면", keyword: "ramen" },
  { name: "닭강정", keyword: "korean-fried-chicken" },
  { name: "마라탕", keyword: "spicy-hotpot" },
  { name: "곱창", keyword: "grilled-intestines" },
  { name: "순대국", keyword: "soup" },
  { name: "초밥", keyword: "sushi" },
  { name: "김치찌개", keyword: "kimchi-stew" },
  { name: "부대찌개", keyword: "stew" },
  { name: "감자탕", keyword: "pork-bone-soup" },
  { name: "삼겹살", keyword: "samgyeopsal" },
  { name: "닭발", keyword: "spicy-chicken" },
  { name: "쭈꾸미볶음", keyword: "stir-fried-octopus" },
  { name: "오돌뼈", keyword: "spicy-pork" },
  { name: "해장국", keyword: "hangover-soup" },
  { name: "비빔국수", keyword: "bibim-noodles" },
  { name: "냉면", keyword: "cold-noodles" },
  { name: "우동", keyword: "udon" },
  { name: "돈까스", keyword: "tonkatsu" },
  { name: "제육볶음", keyword: "spicy-pork-stirfry" },
  { name: "찜닭", keyword: "braised-chicken" },
  { name: "회덮밥", keyword: "raw-fish-rice" },
  { name: "타코야끼", keyword: "takoyaki" },
  { name: "핫도그", keyword: "hotdog" },
  { name: "토스트", keyword: "toast" },
  { name: "김밥", keyword: "gimbap" },
  { name: "샌드위치", keyword: "sandwich" }
];

const LOCAL_IMAGE_BASE = "images";
const FALLBACK_WIDTH = 600;
const FALLBACK_HEIGHT = 400;

function buildMenuImage(menu) {
  const slug = menu.keyword || "default";
  return `${LOCAL_IMAGE_BASE}/${slug}.svg`;
}

function buildFallbackImage(menu) {
  const label = menu.name;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${FALLBACK_WIDTH}" height="${FALLBACK_HEIGHT}" viewBox="0 0 ${FALLBACK_WIDTH} ${FALLBACK_HEIGHT}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffe7c2"/>
          <stop offset="100%" stop-color="#ffb36b"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="90" cy="90" r="60" fill="rgba(255,255,255,0.5)"/>
      <circle cx="520" cy="330" r="80" fill="rgba(255,255,255,0.35)"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="42" font-family="Pretendard, 'Apple SD Gothic Neo', sans-serif" fill="#7a3b00">${label}</text>
      <text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" font-size="18" font-family="Pretendard, 'Apple SD Gothic Neo', sans-serif" fill="#7a3b00">이미지를 불러오지 못했어요</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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
    img.src = buildMenuImage(menu);
    img.alt = `${menu.name} 사진`;
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.onerror = () => {
      img.onerror = null;
      img.src = buildFallbackImage(menu);
    };

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
