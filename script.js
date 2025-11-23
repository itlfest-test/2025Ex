/* script.js - main behavior */

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
const INTRO_KEY = 'itlfest_seen_intro';

/* ---------------------------------
   1. select に options を流し込む
----------------------------------*/
function addOptions(select, list) {
  // 先頭は「指定なし」
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

addOptions(universityEl, universityOptions);
addOptions(categoryEl, categoryOptions);
addOptions(fieldEl, fieldOptions);

/* ---------------------------------
   2. 検索処理
----------------------------------*/
function getValue(e) {
  return e.value.trim();
}

function matchesFilter(ev) {
  const u = getValue(universityEl);
  const c = getValue(categoryEl);
  const f = getValue(fieldEl);

  const uni = ev['大学'] || ev.university;
  const cat = ev['カテゴリ'] || ev.category;
  const fld = ev['分野'] || ev.field;

  if (u && uni !== u) return false;
  if (c && cat !== c) return false;
  if (f && fld !== f) return false;

  return true;
}

/* ---------------------------------
   3. 結果描画
----------------------------------*/
function renderResults(list) {
  resultsEl.innerHTML = '';
  if (!list.length) {
    noResultsEl.hidden = false;
    return;
  }
  noResultsEl.hidden = true;

  list.forEach(ev => {
    const card = document.createElement('article');
    card.className = 'card-item';

    card.innerHTML = `
      <button class="star-btn" data-id="${ev.id}" title="お気に入り">
        <span class="star">☆</span>
      </button>
      <h4>${ev['企画名'] || ev.title || ev.name}</h4>
      <p class="muted">${(ev['説明'] || ev.description || '').slice(0, 120)}</p>
      <div class="card-meta">
        ${(ev['大学'] || ev.university || '')} /
        ${(ev['カテゴリ'] || ev.category || '')} /
        ${(ev['分野'] || ev.field || '')}<br>
        ${(ev['start_datetime'] || ev.start_datetime || '')}
        ${(ev['場所'] || ev.location || '')}
      </div>
    `;

    const starBtn = card.querySelector('.star-btn');
    updateStarUI(starBtn, ev.id);
    starBtn.addEventListener('click', () => toggleFavorite(ev));

    resultsEl.appendChild(card);
  });
}

/* ---------------------------------
   4. お気に入り
----------------------------------*/
function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(a) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(a));
}

function isFavorited(id) {
  return getFavorites().some(it => it.id == id);
}

function toggleFavorite(ev) {
  const id = ev.id;
  let favs = getFavorites();

  const exists = favs.findIndex(f => f.id == id);

  if (exists >= 0) {
    favs.splice(exists, 1);
  } else {
    favs.unshift({
      id: ev.id,
      title: ev['企画名'] || ev.title,
      university: ev['大学'] || ev.university,
      category: ev['カテゴリ'] || ev.category,
      field: ev['分野'] || ev.field,
      excerpt: (ev['説明'] || ev.description || '').slice(0, 120)
    });
  }

  saveFavorites(favs);
  refreshFavoritesUI();

  // STAR 更新
  document.querySelectorAll('.star-btn')
    .forEach(b => updateStarUI(b, b.dataset.id));
}

function updateStarUI(btn, id) {
  const fav = isFavorited(id);
  btn.classList.toggle('favorited', fav);
  btn.querySelector('.star').textContent = fav ? '★' : '☆';
}

function refreshFavoritesUI() {
  const favs = getFavorites();
  favoritesList.innerHTML = '';
  favHistory.innerHTML = '';

  if (favs.length === 0) {
    favoritesList.innerHTML = '<div class="muted">お気に入りはまだありません。</div>';
  } else {
    favs.forEach(f => {
      const el = document.createElement('div');
      el.className = 'card-item';
      el.innerHTML = `
        <button class="star-btn favorited" data-id="${f.id}"><span class="star">★</span></button>
        <h4>${f.title}</h4>
        <div class="card-meta">${f.university} / ${f.category} / ${f.field}</div>
      `;
      el.querySelector('.star-btn').addEventListener('click', () => {
        toggleFavorite(f);
      });
      favoritesList.appendChild(el);
    });
  }

  // 履歴（最新6件）
  const hist = [...favs].slice(0, 6);
  if (hist.length === 0) {
    favHistory.innerHTML = '<div class="muted">履歴はありません。</div>';
  } else {
    hist.forEach(h => {
      const row = document.createElement('div');
      row.className = 'history-item';
      row.innerHTML = `
        <div>
          <strong>${h.title}</strong>
          <div class="muted">${h.university}</div>
        </div>
        <div class="history-actions">
          <button class="btn small readd" data-id="${h.id}">再登録</button>
          <button class="btn small del" data-id="${h.id}">🗑️</button>
        </div>
      `;

      row.querySelector('.readd').addEventListener('click', () => {
        const f = getFavorites();
        if (!f.find(x => x.id == h.id)) f.unshift(h);
        saveFavorites(f);
        refreshFavoritesUI();
      });

      row.querySelector('.del').addEventListener('click', () => {
        let f = getFavorites();
        f = f.filter(x => x.id != h.id);
        saveFavorites(f);
        refreshFavoritesUI();
      });

      favHistory.appendChild(row);
    });
  }
}

/* ---------------------------------
   5. イベント
----------------------------------*/
searchBtn.addEventListener('click', () => {
  const filtered = (events || []).filter(matchesFilter);
  renderResults(filtered);
});

clearBtn.addEventListener('click', () => {
  universityEl.value = '';
  categoryEl.value = '';
  fieldEl.value = '';
  renderResults(events || []);
});

/* ---------------------------------
   6. ナビゲーション
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
   7. 初回モーダル
----------------------------------*/
function closeIntro() {
  if (dontShowCheck.checked) {
    localStorage.setItem(INTRO_KEY, '1');
  }
  introModal.classList.add('hidden');
}
introClose.addEventListener('click', closeIntro);
introOk.addEventListener('click', closeIntro);

/* ---------------------------------
   8. 初期化
----------------------------------*/
function init() {
  renderResults(events || []);
  refreshFavoritesUI();

  if (!localStorage.getItem(INTRO_KEY)) {
    setTimeout(() => introModal.classList.remove('hidden'), 350);
  }
}
document.addEventListener('DOMContentLoaded', init);
