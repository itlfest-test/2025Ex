// ============================
// 初期ロード
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // ▼ まず options（検索フォームの候補）だけロード
  loadOptionsSafe();

  // ▼ favorites や history は「EVENT_DATA の読み込みが完了してから」
  // data.js が読み込まれるまで少し待つ
  waitForEventData(() => {
    loadFavorites();
    loadHistory();
  });

  setupNavigation();
  setupIntroModal();
});


// ============================
// データ保存用
// ============================
const FAVORITES_KEY = "favorites";
const HISTORY_KEY = "favorite_history";
const HISTORY_MAX = 15;

// ============================
// ▼ 検索処理
// ============================
document.getElementById("searchBtn").addEventListener("click", () => {
  const uni = document.getElementById("university").value;
  const cat = document.getElementById("category").value;
  const field = document.getElementById("field").value;

  const filtered = EVENT_DATA.filter(ev => {
    return (!uni || ev.university === uni) &&
           (!cat || ev.category === cat) &&
           (!field || ev.field === field);
  });

  renderResults(filtered);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("university").value = "";
  document.getElementById("category").value = "";
  document.getElementById("field").value = "";
  renderResults([]);
});

// ============================
// ▼ 結果表示
// ============================
function renderResults(list) {
  const area = document.getElementById("results");
  const noData = document.getElementById("no-results");

  area.innerHTML = "";

  if (list.length === 0) {
    noData.hidden = false;
    return;
  }

  noData.hidden = true;

  list.forEach(ev => {
    area.appendChild(createEventCard(ev));
  });
}

// ============================
// ▼ カード生成（共通）
// ============================
function createEventCard(ev) {
  const card = document.createElement("div");
  card.className = "result-card";

  const favs = loadFavoritesArray();
  const isFav = favs.includes(ev.id);

  card.innerHTML = `
    <h4>${ev.title}</h4>
    <p class="muted">${ev.university} / ${ev.category} / ${ev.field}</p>

    <div class="card-actions">
      <button class="fav-btn ${isFav ? "active" : ""}" data-id="${ev.id}">
        ⭐
      </button>
    </div>
  `;

  // ★ お気に入り切り替え
  card.querySelector(".fav-btn").addEventListener("click", () => toggleFavorite(ev));

  return card;
}

// ============================
// ▼ お気に入り操作
// ============================
function toggleFavorite(ev) {
  let favs = loadFavoritesArray();
  let history = loadHistoryArray();

  if (favs.includes(ev.id)) {
    // --- お気に入り解除 ---
    favs = favs.filter(id => id !== ev.id);

    // 履歴には「お気に入り解除しても残す」 → 追加はしない
  } else {
    // --- お気に入り追加 ---
    favs.push(ev.id);

    // 履歴記録（重複は最新へ移動）
    history = addToHistory(ev.id, history);
  }

  // 保存
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  renderFavorites();
  renderHistory();
  renderResults(EVENT_DATA); // 状態更新
}

// ============================
// ▼ お気に入り表示
// ============================
function renderFavorites() {
  const list = document.getElementById("favorites-list");
  list.innerHTML = "";

  const favs = loadFavoritesArray();
  const events = EVENT_DATA.filter(ev => favs.includes(ev.id));

  events.forEach(ev => list.appendChild(createEventCard(ev)));
}

// ============================
// ▼ 履歴処理
// ============================
function addToHistory(id, history) {
  // すでにある → 削除して先頭に入れ直す
  history = history.filter(h => h !== id);

  // 先頭へ
  history.unshift(id);

  // 15件上限
  if (history.length > HISTORY_MAX) {
    history = history.slice(0, HISTORY_MAX);
  }

  return history;
}

function renderHistory() {
  const area = document.getElementById("fav-history");
  area.innerHTML = "";

  const history = loadHistoryArray();

  history.forEach(id => {
    const ev = EVENT_DATA.find(e => e.id === id);
    if (!ev) return;

    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <span>${ev.title}</span>
      <button class="delete-history" data-id="${id}">🗑️</button>
    `;

    // 履歴個別削除（お気に入りには影響なし）
    item.querySelector(".delete-history").addEventListener("click", () => {
      const newHistory = history.filter(h => h !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      renderHistory();
    });

    area.appendChild(item);
  });
}

// ============================
// ▼ LocalStorage helper
// ============================
function loadFavoritesArray() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function loadHistoryArray() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
}

function loadFavorites() {
  renderFavorites();
}

function loadHistory() {
  renderHistory();
}

// ============================
// ▼ ページ切り替え
// ============================
function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;

      document.getElementById("search-area").classList.add("hidden");
      document.getElementById("results-area").classList.add("hidden");
      document.getElementById("favorites-area").classList.add("hidden");
      document.getElementById("map-area").classList.add("hidden");

      if (view === "search") {
        document.getElementById("search-area").classList.remove("hidden");
        document.getElementById("results-area").classList.remove("hidden");
      } else if (view === "favorites") {
        renderFavorites();
        renderHistory();
        document.getElementById("favorites-area").classList.remove("hidden");
      } else if (view === "map") {
        document.getElementById("map-area").classList.remove("hidden");
      }
    });
  });
}

// ============================
// ▼ 初回モーダル
// ============================
function setupIntroModal() {
  const modal = document.getElementById("introModal");
  const dontShow = document.getElementById("dontShow");

  if (!localStorage.getItem("hideIntro")) {
    modal.classList.remove("hidden");
  }

  document.getElementById("introClose").addEventListener("click", close);
  document.getElementById("introOk").addEventListener("click", close);

  function close() {
    modal.classList.add("hidden");
    if (dontShow.checked) {
      localStorage.setItem("hideIntro", "1");
    }
  }
}
