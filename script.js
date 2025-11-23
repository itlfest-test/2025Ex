/* script.js - main behavior (改訂版) */

// DOM refs
const universityEl = document.getElementById('university');
const categoryEl = document.getElementById('category');
const fieldEl = document.getElementById('field');

const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsEl = document.getElementById('results');
const noResultsEl = document.getElementById('no-results');

const navBtns = document.querySelectorAll('.nav-btn');
const favoritesArea = document.getElementById('favorites-area');
const favoritesList = document.getElementById('favorites-list');
const favHistory = document.getElementById('fav-history');

const mapArea = document.getElementById('map-area');
const searchArea = document.getElementById('search-area');
const resultsArea = document.getElementById('results-area');

const introModal = document.getElementById('introModal');
const introClose = document.getElementById('introClose');
const introOk = document.getElementById('introOk');
const dontShowCheck = document.getElementById('dontShow');

// LocalStorage keys
const FAVORITES_KEY = 'itlfest_favorites';
const HISTORY_KEY = 'itlfest_history';
const INTRO_KEY = 'itlfest_seen_intro';

/* ---------------------------------
   0. ヒーロー（大文）挿入用 API
   - 画面の6〜8割を占めるテキストを後で挿入可能にする
----------------------------------*/
(function createHeroPlaceholder(){
  const container = document.getElementById('results-area');
  if(!container) return;
  const hero = document.createElement('div');
  hero.id = 'hero-text';
  hero.className = 'hero-text hidden'; // CSS 側で .hero-text を定義しておくとよい
  // minimal inline style so it occupies large area even without CSS
  hero.style.display = 'none';
  hero.style.minHeight = '65vh'; // 65% of viewport height; can be adjusted
  hero.style.boxSizing = 'border-box';
  hero.style.padding = '24px';
  hero.style.overflow = 'auto';
  hero.style.whiteSpace = 'pre-wrap';
  hero.style.fontSize = '1.05rem';
  hero.style.lineHeight = '1.6';
  hero.style.background = 'var(--hero-bg, rgba(0,0,0,0.02))';
  // insert hero before results
  const results = document.getElementById('results');
  container.insertBefore(hero, results);
})();

// call this to set or clear hero text (html allowed)
function setHeroText(htmlString) {
  const hero = document.getElementById('hero-text');
  if(!hero) return;
  if(!htmlString) {
    hero.style.display = 'none';
    hero.classList.add('hidden');
    return;
  }
  hero.innerHTML = htmlString;
  hero.style.display = '';
  hero.classList.remove('hidden');
}

/* ---------------------------------
   1. select に options を流し込む
----------------------------------*/
function addOptions(select, list) {
  if(!select || !Array.isArray(list)) return;
  // 先頭は「指定なし」
  select.innerHTML = '';
  const optNone = document.createElement('option');
  optNone.value = '';
  optNone.textContent = '指定なし';
  select.appendChild(optNone);

  list.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

try {
  addOptions(universityEl, universityOptions);
  addOptions(categoryEl, categoryOptions);
  addOptions(fieldEl, fieldOptions);
} catch(e){
  // fail silently if options not provided; ensure no exception bubbles
  console.warn('options not found or invalid:', e);
}

/* ---------------------------------
   2. 検索処理
----------------------------------*/
function getValue(e) {
  return (e && e.value) ? String(e.value).trim() : '';
}

function matchesFilter(ev) {
  const u = getValue(universityEl);
  const c = getValue(categoryEl);
  const f = getValue(fieldEl);

  const uni = (ev && (ev['大学'] || ev.university || '')) || '';
  const cat = (ev && (ev['カテゴリ'] || ev.category || '')) || '';
  const fld = (ev && (ev['分野'] || ev.field || '')) || '';

  if (u && uni !== u) return false;
  if (c && cat !== c) return false;
  if (f && fld !== f) return false;

  return true;
}

/* ---------------------------------
   3. 結果描画
----------------------------------*/
function renderResults(list) {
  // Hide hero if visible (search results should show instead)
  const hero = document.getElementById('hero-text');
  if(hero && hero.style.display !== 'none') {
    hero.style.display = 'none';
    hero.classList.add('hidden');
  }

  resultsEl.innerHTML = '';
  if (!Array.isArray(list) || !list.length) {
    noResultsEl.hidden = false;
    return;
  }
  noResultsEl.hidden = true;

  const frag = document.createDocumentFragment();
  list.forEach(ev => {
    const card = document.createElement('article');
    card.className = 'card-item';

    const title = escapeHtml(ev['企画名'] || ev.title || ev.name || '（タイトルなし）');
    const excerpt = escapeHtml((ev['説明'] || ev.description || '').slice(0, 120));
    const uni = escapeHtml(ev['大学'] || ev.university || '');
    const cat = escapeHtml(ev['カテゴリ'] || ev.category || '');
    const fld = escapeHtml(ev['分野'] || ev.field || '');
    const when = escapeHtml(ev['start_datetime'] || ev.start_datetime || '');
    const where = escapeHtml(ev['場所'] || ev.location || '');

    card.innerHTML = `
      <button class="star-btn" data-id="${ev.id}" title="お気に入り">
        <span class="star">☆</span>
      </button>
      <h4>${title}</h4>
      <p class="muted">${excerpt}</p>
      <div class="card-meta">
        ${uni} / ${cat} / ${fld}<br>
        ${when} ${where}
      </div>
    `;

    const starBtn = card.querySelector('.star-btn');
    updateStarUI(starBtn, ev.id);
    starBtn.addEventListener('click', () => toggleFavorite(ev));

    frag.appendChild(card);
  });
  resultsEl.appendChild(frag);
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
}

/* ---------------------------------
   4. お気に入り / 履歴 (localStorage)
   - favorites と history を明確に分離
----------------------------------*/
function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveFavorites(a) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(a)); } catch(e){}
}

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveHistory(a) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(a)); } catch(e){}
}

// add to history (most-recent-first), keep unique, max 6
function addToHistory(entry) {
  if(!entry || !entry.id) return;
  const hist = getHistory();
  const exists = hist.findIndex(h => h.id == entry.id);
  if(exists >= 0) {
    // move to top
    hist.splice(exists,1);
  }
  hist.unshift({ id: entry.id, title: entry.title, university: entry.university });
  const sliced = hist.slice(0,6);
  saveHistory(sliced);
}

/* favorite helpers */
function isFavorited(id) {
  return getFavorites().some(it => it.id == id);
}

function toggleFavorite(ev) {
  if(!ev || typeof ev.id === 'undefined') return;
  const id = ev.id;
  let favs = getFavorites();
  const idx = favs.findIndex(f => f.id == id);
  if(idx >= 0) {
    // remove from favorites, BUT keep history intact
    favs.splice(idx,1);
    saveFavorites(favs);
  } else {
    // add to top of favorites
    const newItem = {
      id: ev.id,
      title: ev['企画名'] || ev.title || '',
      university: ev['大学'] || ev.university || '',
      category: ev['カテゴリ'] || ev.category || '',
      field: ev['分野'] || ev.field || '',
      excerpt: (ev['説明'] || ev.description || '').slice(0,120)
    };
    favs.unshift(newItem);
    saveFavorites(favs);
    // also add to history when newly favorited
    addToHistory(newItem);
  }

  refreshFavoritesUI();
  // STAR 更新
  document.querySelectorAll('.star-btn')
    .forEach(b => updateStarUI(b, b.dataset.id));
}

function updateStarUI(btn, id) {
  if(!btn) return;
  const fav = isFavorited(id);
  btn.classList.toggle('favorited', fav);
  const star = btn.querySelector('.star');
  if(star) star.textContent = fav ? '★' : '☆';
}

/* ---------------------------------
   5. favorites list & history render
----------------------------------*/
function refreshFavoritesUI() {
  const favs = getFavorites();
  favoritesList.innerHTML = '';
  favHistory.innerHTML = '';

  // favorites area
  if(!favs || favs.length === 0) {
    favoritesList.innerHTML = '<div class="muted">お気に入りはまだありません。</div>';
  } else {
    const frag = document.createDocumentFragment();
    favs.forEach(f => {
      const el = document.createElement('div');
      el.className = 'card-item';
      el.innerHTML = `
        <button class="star-btn favorited" data-id="${f.id}"><span class="star">★</span></button>
        <h4>${escapeHtml(f.title)}</h4>
        <div class="card-meta">${escapeHtml(f.university)} / ${escapeHtml(f.category)} / ${escapeHtml(f.field)}</div>
      `;
      el.querySelector('.star-btn').addEventListener('click', () => {
        // toggle by id (no need to pass full object)
        toggleFavorite({ id: f.id });
      });
      frag.appendChild(el);
    });
    favoritesList.appendChild(frag);
  }

  // history area (from HISTORY_KEY) - independent of current favorites
  const hist = getHistory();
  if(!hist || hist.length === 0) {
    favHistory.innerHTML = '<div class="muted">履歴はありません。</div>';
  } else {
    const frag = document.createDocumentFragment();
    hist.forEach(h => {
      const row = document.createElement('div');
      row.className = 'history-item';
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(h.title)}</strong>
          <div class="muted">${escapeHtml(h.university)}</div>
        </div>
        <div class="history-actions">
          <button class="btn small readd" data-id="${h.id}">再登録</button>
          <button class="btn small del" data-id="${h.id}">🗑️</button>
        </div>
      `;
      // readd: add to favorites if missing
      row.querySelector('.readd').addEventListener('click', () => {
        const allFavs = getFavorites();
        if(!allFavs.find(x => x.id == h.id)) {
          // try to find full event in events[] to get more metadata
          const evFull = (window.events || []).find(e => String(e.id) == String(h.id));
          const item = evFull ? {
            id: evFull.id,
            title: evFull['企画名'] || evFull.title || '',
            university: evFull['大学'] || evFull.university || ''
          } : { id: h.id, title: h.title, university: h.university };
          allFavs.unshift(item);
          saveFavorites(allFavs);
        }
        refreshFavoritesUI();
      });
      // del: remove only from history (do NOT touch favorites)
      row.querySelector('.del').addEventListener('click', () => {
        let histArr = getHistory();
        histArr = histArr.filter(x => x.id != h.id);
        saveHistory(histArr);
        refreshFavoritesUI();
      });

      frag.appendChild(row);
    });
    favHistory.appendChild(frag);
  }
}

/* ---------------------------------
   6. イベント bind
----------------------------------*/
searchBtn.addEventListener('click', () => {
  const filtered = (window.events || []).filter(matchesFilter);
  renderResults(filtered);
});

clearBtn.addEventListener('click', () => {
  universityEl.value = '';
  categoryEl.value = '';
  fieldEl.value = '';
  renderResults(window.events || []);
});

/* ---------------------------------
   7. ナビゲーション
----------------------------------*/
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const v = btn.dataset.view;

    searchArea.classList.toggle('hidden', v !== 'search');
    resultsArea.classList.toggle('hidden', v !== 'search');
    favoritesArea.classList.toggle('hidden', v !== 'favorites');
    mapArea.classList.toggle('hidden', v !== 'map');

    if (v === 'favorites') refreshFavoritesUI();
  });
});

/* ---------------------------------
   8. 初回モーダル
----------------------------------*/
function closeIntro() {
  if (dontShowCheck && dontShowCheck.checked) {
    try{ localStorage.setItem(INTRO_KEY, '1'); }catch(e){}
  }
  if(introModal) introModal.classList.add('hidden');
}
if(introClose) introClose.addEventListener('click', closeIntro);
if(introOk) introOk.addEventListener('click', closeIntro);

/* ---------------------------------
   9. 初期化
----------------------------------*/
function init() {
  renderResults(window.events || []);
  refreshFavoritesUI();

  if (!localStorage.getItem(INTRO_KEY)) {
    setTimeout(() => {
      if(introModal) introModal.classList.remove('hidden');
    }, 350);
  }
}
document.addEventListener('DOMContentLoaded', init);
