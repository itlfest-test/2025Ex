// ============================
// script.js - complete replacement (FULL WORKING VERSION)
// ============================

// --- constants / keys
const FAVORITES_KEY = "favorites";
const HISTORY_KEY = "favorite_history";
const HISTORY_MAX = 15;

// --- helper: unified data accessor
function getAllEvents() {
  const raw = window.EVENT_DATA || window.events || [];
  return Array.isArray(raw) ? raw : [];
}

// normalize accessors
function evTitle(ev) {
  return ev["企画名"] || ev.title || ev.name || "(無題)";
}
function evUniversity(ev) {
  return ev["大学"] || ev.university || "";
}
function evCategory(ev) {
  return ev["カテゴリ"] || ev.category || "";
}
function evField(ev) {
  return ev["分野"] || ev.field || "";
}
function evExcerpt(ev) {
  return (ev["説明"] || ev.description || "").slice(0, 140);
}
function evDateTime(ev) {
  return ev["start_datetime"] || ev.start_datetime || "";
}
function evPlace(ev) {
  return ev["場所"] || ev.location || "";
}

// ============================
// 初期ロード
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // ① セレクトボックスの読み込み
  try {
    loadOptionsSafe();
  } catch (e) {
    console.warn("loadOptionsSafe error:", e);
  }

  // ② ナビゲーション
  try {
    setupNavigation();
  } catch (e) {
    console.warn("setupNavigation error:", e);
  }

  // ③ 初回モーダル
  try {
    setupIntroModal();
  } catch (e) {
    console.warn("setupIntroModal error:", e);
  }

  // ④ EVENT_DATA 読み込み後に実行
  waitForEventData(() => {
    renderResults(getAllEvents());
    loadFavorites();
    loadHistory();
  });

  // ⑤ イベント登録
  const sBtn = document.getElementById("searchBtn");
  const cBtn = document.getElementById("clearBtn");
  if (sBtn) sBtn.addEventListener("click", onSearch);
  if (cBtn) cBtn.addEventListener("click", onClear);
});

// ============================
// EVENT_DATA 読み込み待ち
// ============================
function waitForEventData(callback) {
  if (typeof window.EVENT_DATA !== "undefined" || typeof window.events !== "undefined") {
    callback();
    return;
  }
  const timer = setInterval(() => {
    if (typeof window.EVENT_DATA !== "undefined" || typeof window.events !== "undefined") {
      clearInterval(timer);
      callback();
    }
  }, 50);
}

// ============================
// 🔍 検索処理
// ============================
function onSearch() {
  const uni = (document.getElementById("university") || {}).value || "";
  const cat = (document.getElementById("category") || {}).value || "";
  const field = (document.getElementById("field") || {}).value || "";

  const all = getAllEvents();
  const filtered = all.filter((ev) => {
    if (uni && evUniversity(ev) !== uni) return false;
    if (cat && evCategory(ev) !== cat) return false;
    if (field && evField(ev) !== field) return false;
    return true;
  });

  renderResults(filtered);
}

function onClear() {
  const uniEl = document.getElementById("university");
  const catEl = document.getElementById("category");
  const fieldEl = document.getElementById("field");
  if (uniEl) uniEl.value = "";
  if (catEl) catEl.value = "";
  if (fieldEl) fieldEl.value = "";
  renderResults(getAllEvents());
}

// ============================
// 📄 結果表示
// ============================
function renderResults(list) {
  const area = document.getElementById("results");
  const noData = document.getElementById("no-results");
  if (!area) return;

  area.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    if (noData) noData.hidden = false;
    return;
  }
  if (noData) noData.hidden = true;

  list.forEach((ev) => area.appendChild(createEventCard(ev)));
}

// ============================
// カード生成
// ============================
function createEventCard(ev) {
  const card = document.createElement("article");
  card.className = "result-card";

  const favs = loadFavoritesArray();
  const isFav = favs.includes(ev.id);

  card.innerHTML = `
    <button class="fav-btn ${isFav ? "active" : ""}" data-id="${ev.id}" aria-label="お気に入り">
      ⭐
    </button>
    <h4>${escapeHtml(evTitle(ev))}</h4>
    <p class="muted">${escapeHtml(evExcerpt(ev))}</p>
    <div class="card-meta">
      ${escapeHtml(evUniversity(ev))} / ${escapeHtml(evCategory(ev))} / ${escapeHtml(evField(ev))}<br>
      ${escapeHtml(evDateTime(ev))} ${escapeHtml(evPlace(ev))}
    </div>
  `;

  const btn = card.querySelector(".fav-btn");
  if (btn) {
    btn.addEventListener("click", () => toggleFavorite(ev));
  }

  return card;
}

function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ============================
// ⭐ お気に入り管理
// ============================
function loadFavoritesArray() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}
function loadHistoryArray() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveFavoritesArray(arr) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
}
function saveHistoryArray(arr) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
}

function toggleFavorite(ev) {
  const id = ev.id;
  if (typeof id === "undefined") return;

  let favs = loadFavoritesArray();
  let history = loadHistoryArray();

  if (favs.includes(id)) {
    favs = favs.filter((x) => x !== id);
  } else {
    favs.unshift(id);
    history = addToHistory(id, history);
  }

  saveFavoritesArray(favs);
  saveHistoryArray(history);

  renderFavorites();
  renderHistory();

  const uni = (document.getElementById("university") || {}).value || "";
  const cat = (document.getElementById("category") || {}).value || "";
  const field = (document.getElementById("field") || {}).value || "";

  if (uni || cat || field) onSearch();
  else renderResults(getAllEvents());
}

// ============================
// ⭐ お気に入り表示
// ============================
function loadFavorites() {
  renderFavorites();
}
function loadHistory() {
  renderHistory();
}

function renderFavorites() {
  const list = document.getElementById("favorites-list");
  if (!list) return;
  list.innerHTML = "";

  const favs = loadFavoritesArray();
  if (favs.length === 0) {
    list.innerHTML = '<div class="muted">お気に入りはまだありません。</div>';
    return;
  }

  const all = getAllEvents();
  favs.forEach((id) => {
    const ev = all.find((x) => x.id === id);
    if (ev) list.appendChild(createEventCard(ev));
  });
}

// ============================
// 🕘 履歴管理
// ============================
function addToHistory(id, history) {
  let h = Array.isArray(history) ? history.slice() : loadHistoryArray();
  h = h.filter((x) => x !== id);
  h.unshift(id);
  if (h.length > HISTORY_MAX) h = h.slice(0, HISTORY_MAX);
  return h;
}

function renderHistory() {
  const area = document.getElementById("fav-history");
  if (!area) return;
  area.innerHTML = "";

  const history = loadHistoryArray();
  if (history.length === 0) {
    area.innerHTML = '<div class="muted">履歴はありません。</div>';
    return;
  }

  const all = getAllEvents();
  history.forEach((id) => {
    const ev = all.find((e) => e.id === id);
    if (!ev) return;

    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(evTitle(ev))}</strong>
        <div class="muted">${escapeHtml(evUniversity(ev))}</div>
      </div>
      <div class="history-actions">
        <button class="btn small readd" data-id="${id}">再登録</button>
        <button class="btn small del" data-id="${id}">🗑️</button>
      </div>
    `;

    item.querySelector(".readd").addEventListener("click", () => {
      const favs = loadFavoritesArray();
      if (!favs.includes(id)) {
        favs.unshift(id);
        saveFavoritesArray(favs);
      }
      renderFavorites();
      renderHistory();
    });

    item.querySelector(".del").addEventListener("click", () => {
      let h = loadHistoryArray().filter((x) => x !== id);
      saveHistoryArray(h);
      renderHistory();
    });

    area.appendChild(item);
  });
}

// ============================
// 📱 ナビゲーション
// ============================
function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");
  if (!buttons) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;
      const searchArea = document.getElementById("search-area");
      const resultsArea = document.getElementById("results-area");
      const favoritesArea = document.getElementById("favorites-area");
      const mapArea = document.getElementById("map-area");

      if (searchArea) searchArea.classList.toggle("hidden", view !== "search");
      if (resultsArea) resultsArea.classList.toggle("hidden", view !== "search");
      if (favoritesArea) favoritesArea.classList.toggle("hidden", view !== "favorites");
      if (mapArea) mapArea.classList.toggle("hidden", view !== "map");

      if (view === "favorites") {
        renderFavorites();
        renderHistory();
      }
    });
  });
}

// ============================
// 📝 初回モーダル
// ============================
function setupIntroModal() {
  const modal = document.getElementById("introModal");
  const dontShow = document.getElementById("dontShow");
  const closeBtns = [
    document.getElementById("introClose"),
    document.getElementById("introOk")
  ];

  if (!localStorage.getItem("hideIntro") && modal) {
    setTimeout(() => modal.classList.remove("hidden"), 280);
  }

  closeBtns.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (dontShow && dontShow.checked) localStorage.setItem("hideIntro", "1");
      if (modal) modal.classList.add("hidden");
    });
  });
}

// ============================
// 📌 セレクト選択肢ロード（options.js 依存）
// ============================
function loadOptionsSafe() {
  try {
    const uniEl = document.getElementById("university");
    const catEl = document.getElementById("category");
    const fieldEl = document.getElementById("field");

    if (!uniEl || !catEl || !fieldEl) {
      console.warn("select elements missing");
      return;
    }

    // university
    if (Array.isArray(window.universityOptions)) {
      uniEl.innerHTML = `<option value="">指定なし</option>`;
      window.universityOptions.forEach((u) => {
        const op = document.createElement("option");
        op.value = u;
        op.textContent = u;
        uniEl.appendChild(op);
      });
    }

    // category
    if (Array.isArray(window.categoryOptions)) {
      catEl.innerHTML = `<option value="">指定なし</option>`;
      window.categoryOptions.forEach((c) => {
        const op = document.createElement("option");
        op.value = c;
        op.textContent = c;
        catEl.appendChild(op);
      });
    }

    // field
    if (Array.isArray(window.fieldOptions)) {
      fieldEl.innerHTML = `<option value="">指定なし</option>`;
      window.fieldOptions.forEach((f) => {
        const op = document.createElement("option");
        op.value = f;
        op.textContent = f;
        fieldEl.appendChild(op);
      });
    }
  } catch (e) {
    console.error("loadOptionsSafe failed:", e);
  }
}
