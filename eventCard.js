// ============================
// カード生成（要約版 + 画像プレースホルダー対応）
// ============================

async function createEventCard(ev) {
  const card = document.createElement("article");
  card.className = "result-card";
  card.dataset.eventId = ev.id;

  const favs = loadFavoritesArray();
  const isFav = favs.includes(ev.id);

  const dateTimeStr = formatDateTime(evStartDateTime(ev), evEndDateTime(ev));
  const placeStr = evPlace(ev);
  const fullDescription = evDescription(ev);
  const university = evUniversity(ev);

  // 要約生成
  const summary = await getSummary(ev.id, fullDescription);

  // 画像URLまたはプレースホルダー
  const imageUrl = ev.image ? ev.image : "placeholder.jpg";

  // タイル本体
  card.innerHTML = `
    <div class="event-image-wrapper">
      <img src="${imageUrl}" alt="画像準備中…" class="event-image" />
    </div>

    <button class="fav-btn ${isFav ? "active" : ""}" data-id="${ev.id}" aria-label="お気に入り">
      ⭐
    </button>

    <h4>${escapeHtml(evTitle(ev))}</h4>
    <p class="muted event-summary">${escapeHtml(summary)}</p>

    <div class="card-meta">
      <span class="university-tag">${escapeHtml(university)}</span>
      / ${escapeHtml(evCategory(ev))} / ${escapeHtml(evField(ev))}
    </div>
  `;

  // =============================
  // ① カード全体クリックで詳細ページへ
  // =============================
  card.addEventListener("click", () => {
    window.location.href = `detail.html?id=${encodeURIComponent(ev.id)}`;
  });

  // =============================
  // ② お気に入りボタン（遷移しない）
  // =============================
  const favBtn = card.querySelector(".fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // カードクリックを無効化
      toggleFavorite(ev);
      favBtn.classList.toggle("active");
    });
  }

  // =============================
  // ③ 大学名クリック → 検索欄に反映
  // =============================
  const universityTag = card.querySelector(".university-tag");
  if (universityTag) {
    universityTag.style.cursor = "pointer";
    universityTag.style.textDecoration = "underline";

    universityTag.addEventListener("click", (e) => {
      e.stopPropagation(); // 詳細ページへ飛ばないように

      const uniEl = document.getElementById("university");
      if (uniEl) {
        uniEl.value = university;
        onSearch();
        document.getElementById("search-area")?.scrollIntoView({ behavior: "smooth" });
      }
    });
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
