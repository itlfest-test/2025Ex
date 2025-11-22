// -----------------------------
// 検索処理
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", handleSearch);
});

// 検索処理本体
function handleSearch() {
  const university = document.getElementById("university").value;
  const category = document.getElementById("category").value;
  const field = document.getElementById("field").value;

  // data.js にあるイベントデータを検索
  const results = EVENT_DATA.filter(item => {
    const matchUniversity = university === "" || item.university === university;
    const matchCategory = category === "" || item.category === category;
    const matchField = field === "" || item.field === field;
    return matchUniversity && matchCategory && matchField;
  });

  renderResults(results);
}

// -----------------------------
// 結果カード描画
// -----------------------------
function renderResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = "<p>該当するイベントがありません。</p>";
    return;
  }

  results.forEach(item => {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <div class="event-header">
        <h3>${item.title}</h3>
        <button class="star-btn" data-id="${item.id}">☆</button>
      </div>

      <p><strong>大学：</strong>${item.university}</p>
      <p><strong>カテゴリ：</strong>${item.category}</p>
      <p><strong>分野：</strong>${item.field}</p>
      <p><strong>概要：</strong>${item.description}</p>
    `;

    container.appendChild(card);
  });

  attachFavoriteButtons();
}

// -----------------------------
// ☆ お気に入りボタン処理
// -----------------------------
function attachFavoriteButtons() {
  const buttons = document.querySelectorAll(".star-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      toggleFavorite(id);
      updateStarDisplay(btn, id);
    });
  });
}

// お気に入り切り替え
function toggleFavorite(id) {
  let favs = loadFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem("itlfest_favorites", JSON.stringify(favs));
}

// ☆表示変更
function updateStarDisplay(btn, id) {
  const favs = loadFavorites();
  btn.textContent = favs.includes(id) ? "★" : "☆";
}

// localStorage 読み込み
function loadFavorites() {
  return JSON.parse(localStorage.getItem("itlfest_favorites") || "[]");
}
