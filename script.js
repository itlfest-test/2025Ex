/* script.js - main behavior */

// --- helper dom refs
const universitiesEl = document.getElementById('universities');
const categoriesEl = document.getElementById('categories');
const fieldsEl = document.getElementById('fields');

const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsEl = document.getElementById('results');
const noResultsEl = document.getElementById('no-results');

const navBtns = document.querySelectorAll('.nav-btn');
const favoritesArea = document.getElementById('favorites-area');
const favoritesList = document.getElementById('favorites-list');
const favHistory = document.getElementById('fav-history');
const favoritesViewBtn = document.querySelector('.nav-btn[data-view="favorites"]');

const mapArea = document.getElementById('map-area');
const searchArea = document.getElementById('search-area');

const introModal = document.getElementById('introModal');
const introClose = document.getElementById('introClose');
const introOk = document.getElementById('introOk');
const dontShowCheck = document.getElementById('dontShow');

// localStorage keys
const FAVORITES_KEY = 'itlfest_favorites';
const INTRO_KEY = 'itlfest_seen_intro';

// in-memory selected sets
let selUniversities = new Set();
let selCategories = new Set();
let selFields = new Set();

// ----------- render option buttons from options.js arrays -----------
function makeOptionButton(text, container, setRef){
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.textContent = text;
  btn.addEventListener('click', () => {
    if(btn.classList.contains('active')){
      btn.classList.remove('active');
      setRef.delete(text);
    } else {
      btn.classList.add('active');
      setRef.add(text);
    }
  });
  container.appendChild(btn);
}

// build UI options
UNIVERSITIES.forEach(u => makeOptionButton(u, universitiesEl, selUniversities));
CATEGORIES.forEach(c => makeOptionButton(c, categoriesEl, selCategories));
FIELDS.forEach(f => {
  // f may be object with desc
  const label = f.label || f;
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.textContent = label;
  // small tooltip / popup on long press or right-side info? we'll attach click for description
  btn.addEventListener('click', () => {
    if(btn.classList.contains('active')){
      btn.classList.remove('active');
      selFields.delete(label);
    } else {
      btn.classList.add('active');
      selFields.add(label);
    }
  });
  // add info on right-click or long hold (also accessible via alt+click)
  btn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert(`${label} — ${f.desc || ''}`);
  });
  btn.title = f.desc || '';
  fieldsEl.appendChild(btn);
});

// ---------- search logic ----------
// events array is supplied by data.js as `events`
function matchesFilter(event){
  // within-group: if no selection -> pass; if selected -> event must match at least one in that group (OR)
  // across groups combine with AND (i.e., event must satisfy each non-empty group's condition).
  if(selUniversities.size){
    if(!selUniversities.has(event.university)) return false;
  }
  if(selCategories.size){
    if(!selCategories.has(event.category)) return false;
  }
  if(selFields.size){
    // event.field may be single value; compare exact or includes
    if(!selFields.has(event.field)) return false;
  }
  return true;
}

function renderResults(list){
  resultsEl.innerHTML = '';
  if(!list.length){
    noResultsEl.hidden = false;
    return;
  } else {
    noResultsEl.hidden = true;
  }
  list.forEach(ev => {
    const card = document.createElement('article');
    card.className = 'card-item';
    card.innerHTML = `
      <button class="star-btn" data-id="${ev.id}" title="お気に入り">
        <span class="star">☆</span>
      </button>
      <h4>${ev['企画名'] || ev.title || ev.name}</h4>
      <p class="muted">${(ev['説明'] || ev.description || '').slice(0,120)}</p>
      <div class="card-meta">
        ${ev['大学'] || ev.university || ''} / ${ev['カテゴリ'] || ev.category || ''} / ${ev['分野'] || ev.field || ''}<br>
        ${ev['start_datetime'] || ev.start_datetime || ''} ${ev['場所'] || ev.location || ''}
      </div>
    `;
    // star behavior
    const starBtn = card.querySelector('.star-btn');
    updateStarUI(starBtn, ev.id);
    starBtn.addEventListener('click', () => toggleFavorite(ev));
    resultsEl.appendChild(card);
  });
}

// ---------- favorites (localStorage) ----------
function getFavorites(){
  try{
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return [];}
}
function saveFavorites(arr){
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
}
function isFavorited(id){
  return getFavorites().some(it => it.id === id);
}
function toggleFavorite(eventObj){
  // accept either event object or id
  const id = (typeof eventObj === 'object') ? (eventObj.id || eventObj['id']) : eventObj;
  const favs = getFavorites();
  const found = favs.findIndex(f => f.id == id);
  if(found >= 0){
    favs.splice(found,1);
    saveFavorites(favs);
  } else {
    // find event in events array
    const ev = (typeof eventObj === 'object') ? eventObj : events.find(e=>e.id==id);
    if(ev){
      favs.unshift({ id: ev.id, title: ev['企画名'] || ev.title, university: ev['大学'] || ev.university, category: ev['カテゴリ'] || ev.category, field: ev['分野'] || ev.field, excerpt: (ev['説明']||ev.description||'').slice(0,120) });
      saveFavorites(favs);
    }
  }
  refreshFavoritesUI();
  // update stars in results (repaint)
  document.querySelectorAll('.star-btn').forEach(sb => updateStarUI(sb, sb.dataset.id));
}

function updateStarUI(starBtn, id){
  const fav = isFavorited(id);
  starBtn.classList.toggle('favorited', fav);
  const star = starBtn.querySelector('.star');
  star.textContent = fav ? '★' : '☆';
}

// render favorites list & history area
function refreshFavoritesUI(){
  const favs = getFavorites();
  favoritesList.innerHTML = '';
  favHistory.innerHTML = '';
  if(favs.length === 0){
    favoritesList.innerHTML = '<div class="muted">お気に入りはまだありません。</div>';
  } else {
    favs.forEach(f=>{
      const el = document.createElement('div');
      el.className = 'card-item';
      el.innerHTML = `
        <button class="star-btn favorited" data-id="${f.id}" title="お気に入り"><span class="star">★</span></button>
        <h4>${f.title}</h4>
        <div class="card-meta">${f.university || ''} / ${f.category || ''} / ${f.field || ''}</div>
      `;
      // clicking star removes
      el.querySelector('.star-btn').addEventListener('click', () => {
        toggleFavorite(f.id);
      });
      favoritesList.appendChild(el);
    });
  }

  // history: show last 6 favorites for easy再登録 (with delete)
  const hist = [...favs].slice(0,6);
  if(hist.length === 0){
    favHistory.innerHTML = '<div class="muted">履歴はありません。</div>';
  } else {
    hist.forEach(h=>{
      const row = document.createElement('div');
      row.className = 'history-item';
      row.innerHTML = `<div><strong>${h.title}</strong><div class="muted">${h.university || ''}</div></div>
        <div class="history-actions">
          <button class="btn small readd" data-id="${h.id}">再登録</button>
          <button class="btn small del" data-id="${h.id}">🗑️</button>
        </div>`;
      row.querySelector('.readd').addEventListener('click', () => {
        // readd (move to top)
        const favs = getFavorites();
        if(!favs.find(x=>x.id==h.id)) favs.unshift(h);
        saveFavorites(favs);
        refreshFavoritesUI();
      });
      row.querySelector('.del').addEventListener('click', () => {
        let favs = getFavorites();
        favs = favs.filter(x=>x.id!=h.id);
        saveFavorites(favs);
        refreshFavoritesUI();
      });
      favHistory.appendChild(row);
    });
  }
}

// ---------- interactions ----------
searchBtn.addEventListener('click', () => {
  const filtered = (events || []).filter(matchesFilter);
  renderResults(filtered);
});

clearBtn.addEventListener('click', () => {
  // clear selections and UI
  selUniversities.clear(); selCategories.clear(); selFields.clear();
  document.querySelectorAll('.option-btn.active').forEach(b=>b.classList.remove('active'));
  renderResults(events || []);
});

// initial render
function init(){
  // show all at first
  renderResults(events || []);

  // load favorites UI
  refreshFavoritesUI();

  // tab nav
  navBtns.forEach(btn=>{
    btn.addEventListener('click', () => {
      navBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      // hide all
      searchArea.classList.toggle('hidden', view !== 'search');
      document.getElementById('results-area').classList.toggle('hidden', view !== 'search');
      favoritesArea.classList.toggle('hidden', view !== 'favorites');
      mapArea.classList.toggle('hidden', view !== 'map');
      // if favorites opened, refresh
      if(view === 'favorites') refreshFavoritesUI();
    });
  });

  // modal: show only once
  const already = localStorage.getItem(INTRO_KEY);
  if(!already){
    setTimeout(()=>{ introModal.classList.remove('hidden'); }, 350);
  }

  introClose.addEventListener('click', closeIntro);
  introOk.addEventListener('click', closeIntro);

  function closeIntro(){
    if(dontShowCheck.checked) localStorage.setItem(INTRO_KEY, '1');
    introModal.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', init);

