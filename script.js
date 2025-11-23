// ============================
// script.js - complete replacement
// ============================

// --- constants / keys
const FAVORITES_KEY = "favorites";
const HISTORY_KEY = "favorite_history";
const HISTORY_MAX = 15;

// --- helper: unified data accessor
function getAllEvents() {
  // support both EVENT_DATA and events variable names
  const raw = window.EVENT_DATA || window.events || [];
  // ensure it's an array
  return Array.isArray(raw) ? raw : [];
}

// normalize accessors (works for Japanese-keyed data or english-keyed)
function evTitle(ev) {
  return ev['企画名'] || ev.title || ev.name || "(無題)";
}
function evUniversity(ev) {
  return ev['大学'] || ev.university || "";
}
function evCategory(ev) {
  return ev['カテゴリ'] || ev.category || "";
}
function evField(ev) {
  return ev['分野'] || ev.field || "";
}
function evExcerpt(ev) {
  return (ev['説明'] || ev.description || '').slice(0, 140);
}
function evDateTime(ev) {
  return ev['start_datetime'] || ev.start_datetime || '';
}
function evPlace(ev) {
  return ev['場所'] || ev.location || '';
}

// ============================
// 初期ロード
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // populate selects (options.js should provide universityOptions/categoryOptions/fieldOptions)
  try { loadOptionsSafe(); } catch(e){ console.warn("loadOptionsSafe error:", e); }

  // navigation and modal do not need EVENT_DATA; set them up immediately
  try { setupNavigation(); } catch(e){ console.warn("setupNavigation error:", e); }
  try { setupIntroModal(); } catch(e){ console.warn("setupIntroModal error:", e); }

  // wait for events data, then load favorites/history and initial rendering
  waitForEventData(() => {
    renderResults(getAllEvents());
    loadFavorites();
    loadHistory();
  });

  // bind search/clear (safe-guard if elements missing)
  const sBtn = document.getElementById("searchBtn");
  const cBtn = document.getElementById("clearBtn");
  if(sBtn) sBtn.addEventListener("click", onSearch);
  if(cBtn) cBtn.addEventListener("click", onClear);
});

// ============================
// EVENT_DATA が読めるまで待つ (supports either events or EVENT_DATA)
// ============================
function waitForEventData(callback) {
  // if already present, call immediately
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
// 検索処理
// ============================
function onSearch() {
  const uni = (document.getElementById("university") || {}).value || "";
  const cat = (document.getElementById("category") || {}).value || "";
  const field = (document.getElementById("field") || {}).value || "";

  const all = getAllEvents();
  const filtered = all.filter(ev => {
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
// 結果表示
// ============================
function renderResults(list) {
  const area = document.getElementById("results");
  const noData = document.getElementById("no-results");
  if(!area) return;

  area.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    if(noData) noData.hidden = false;
    return;
  }
  if(noData) noData.hidden = true;

  list.forEach(ev => area.appendChild(createEventCard(ev)));
}

// ============================
// カード生成（共通）
// ============================
function createEventCard(ev) {
  const card = document.createElement("article");
  card.className = "result-card";

  const favs = loadFavoritesArray();
  const isFav = favs.includes(ev.id);

  // build inner HTML using normalized accessors
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

  // bind favorite toggle
  const btn = card.querySelector(".fav-btn");
  if(btn){
    btn.addEventListener("click", () => toggleFavorite(ev));
  }

  return card;
}

// small utility to avoid inserting raw HTML from data
function escapeHtml(str) {
  if(!str && str !== 0) return "";
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'", "&#39;");
}

// ============================
// お気に入り操作 (ids array)
// ============================
function loadFavoritesArray() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch (e) { return []; }
}

function loadHistoryArray() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch (e) { return []; }
}

function saveFavoritesArray(arr) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
}
function saveHistoryArray(arr) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
}

function toggleFavorite(ev) {
  const id = ev.id;
  if(typeof id === "undefined") return;

  let favs = loadFavoritesArray();
  let history = loadHistoryArray();

  if (favs.includes(id)) {
    // remove
    favs = favs.filter(x => x !== id);
  } else {
    // add to top
    favs.unshift(id);
    // add to history (move to top)
    history = addToHistory(id, history);
  }

  // persist
  saveFavoritesArray(favs);
  saveHistoryArray(history);

  // refresh UIs
  renderFavorites();
  renderHistory();
  // refresh results area to update star UI
  // If results currently filtered, re-render them based on current selects
  const uni = (document.getElementById("university") || {}).value || "";
  const cat = (document.getElementById("category") || {}).value || "";
  const field = (document.getElementById("field") || {}).value || "";
  if (uni || cat || field) {
    onSearch();
  } else {
    renderResults(getAllEvents());
  }
}

// ============================
// お気に入り表示
// ============================
function renderFavorites() {
  const list = document.getElementById("favorites-list");
  if(!list) return;
  list.innerHTML = "";

  const favs = loadFavoritesArray();
  if(favs.length === 0) {
    list.innerHTML = '<div class="muted">お気に入りはまだありません。</div>';
    return;
  }

  const all = getAllEvents();
  // keep original order of favs (most-recent first)
  favs.forEach(id => {
    const ev = all.find(x => x.id === id);
    if(ev) list.appendChild(createEventCard(ev));
  });
}

// ============================
// 履歴処理
// ============================
function addToHistory(id, history) {
  let h = Array.isArray(history) ? history.slice() : loadHistoryArray();
  // remove existing
  h = h.filter(x => x !== id);
  // add to top
  h.unshift(id);
  if (h.length > HISTORY_MAX) h = h.slice(0, HISTORY_MAX);
  return h;
}

function renderHistory() {
  const area = document.getElementById("fav-history");
  if(!area) return;
  area.innerHTML = "";

  const history = loadHistoryArray();
  if (history.length === 0) {
    area.innerHTML = '<div class="muted">履歴はありません。</div>';
    return;
  }

  const all = getAllEvents();
  history.forEach(id => {
    const ev = all.find(e => e.id === id);
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

    // re-add (move to top of favorites if not present)
    const readdBtn = item.querySelector(".readd");
    readdBtn.addEventListener("click", () => {
      const favs = loadFavoritesArray();
      if (!favs.find(x => x === id)) {
        favs.unshift(id);
        saveFavoritesArray(favs);
      }
      renderFavorites();
      renderHistory();
    });

    // delete from history only
    const delBtn = item.querySelector(".del");
    delBtn.addEventListener("click", () => {
      let h = loadHistoryArray();
      h = h.filter(x => x !== id);
      saveHistoryArray(h);
      renderHistory();
    });

    area.appendChild(item);
  });
}

// ============================
// ページ切り替え（タブ）
// ============================
function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");
  if (!buttons) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.dataset.view;

      // hide all
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
// 初回モーダル
// ============================
function setupIntroModal() {
  const modal = document.getElementById("introModal");
  const dontShow = document.getElementById("dontShow");
  const closeBtns = [document.getElementById("introClose"), document.getElementById("introOk")];

  // show only if not hidden
  if (!localStorage.getItem("hideIntro") && modal) {
    // slight delay so user sees layout before modal overlay
    setTimeout(() => modal.classList.remove("hidden"), 280);
  }

  closeBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (dontShow && dontShow.checked) localStorage.setItem("hideIntro", "1");
      if(modal) modal.classList.add("hidden");
    });
  });
}
