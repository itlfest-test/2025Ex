// ============================
// イベント詳細ページ処理
// ============================

// URL パラメータから ?id=xxxx を取得
function getEventIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// データセットから該当 ID のイベントを検索
function findEventById(id) {
  if (!window.allEventData) {
    console.error("イベントデータが読み込まれていません");
    return null;
  }
  return window.allEventData.find(ev => String(ev.id) === String(id));
}

// お気に入り
function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

function toggleFavoriteDetail(id) {
  const favs = loadFavorites();
  const index = favs.indexOf(id);

  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    favs.push(id);
  }

  saveFavorites(favs);
  return favs.includes(id);
}

// HTMLへ反映
function renderDetail(ev) {
  document.getElementById("title").textContent = ev.title || "";
  document.getElementById("subtitle").textContent = ev.subtitle || "";

  document.getElementById("university").textContent = ev.university || "";
  document.getElementById("category-field").textContent =
    `${ev.category || ""} / ${ev.field || ""}`;

  // 日時
  let dt = "";
  if (ev.start_datetime) dt += ev.start_datetime;
  if (ev.end_datetime) dt += " 〜 " + ev.end_datetime;
  document.getElementById("datetime").textContent = dt;

  // 場所
  document.getElementById("place").textContent = ev.place || "";

  // 詳細説明
  document.getElementById("description").textContent = ev.description || "";

  // 画像（今は準備中）
  const imgBox = document.getElementById("event-image");
  if (ev.image_url) {
    const img = document.createElement("img");
    img.src = ev.image_url;
    img.alt = "イベント画像";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    imgBox.innerHTML = "";
    imgBox.appendChild(img);
  }

  // 地図リンク（任意）
  const mapLink = document.getElementById("map-link");
  if (ev.map_url) {
    mapLink.innerHTML = `<a href="${ev.map_url}" target="_blank">Google Map で見る</a>`;
  } else {
    mapLink.textContent = "なし";
  }

  // タグ（任意）
  const tagArea = document.getElementById("tag-list");
  if (ev.tags && ev.tags.length) {
    tagArea.textContent = "タグ: " + ev.tags.join(", ");
  }

  // お気に入りボタン
  const favBtn = document.getElementById("fav-btn");
  const isFav = loadFavorites().includes(ev.id);

  if (isFav) favBtn.classList.add("active");

  favBtn.addEventListener("click", () => {
    const nowFav = toggleFavoriteDetail(ev.id);
    favBtn.classList.toggle("active", nowFav);
  });
}

// ============================
// 初期化
// ============================
window.addEventListener("DOMContentLoaded", () => {
  const id = getEventIdFromUrl();
  if (!id) {
    alert("イベント ID が指定されていません");
    return;
  }

  if (!window.allEventData) {
    alert("イベントデータがまだ読み込まれていません");
    return;
  }

  const ev = findEventById(id);

  if (!ev) {
    alert("指定されたイベントが存在しません");
    return;
  }

  renderDetail(ev);
});
