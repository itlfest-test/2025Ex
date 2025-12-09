// event_cards.js
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

  // 要約を生成（非同期）
  const summary = await getSummary(ev.id, fullDescription);

  // 画像URLまたはプレースホルダー
  const imageUrl = ev.image ? ev.image : "placeholder.jpg";

  card.innerHTML = `
    <div class="event-image-wrapper">
      <img src="${imageUrl}" alt="画像準備中…" class="event-image" />
    </div>
    <button class="fav-btn ${isFav ? "active" : ""}" data-id="${ev.id}" aria-label="お気に入り">
      ⭐
    </button>
    <h4>${escapeHtml(evTitle(ev))}</h4>
    <p class="muted event-summary">${escapeHtml(summary)}</p>
    <div class="event-details hidden">
      <p><strong>詳細：</strong>${escapeHtml(fullDescription)}</p>
      ${dateTimeStr ? `<p><strong>日時：</strong>${escapeHtml(dateTimeStr)}</p>` : ''}
      ${placeStr ? `<p><strong>場所：</strong>${escapeHtml(placeStr)}</p>` : ''}
    </div>
    <button class="toggle-details-btn">詳細を見る ▼</button>
    <div class="card-meta">
      <span class="university-tag" style="cursor: pointer; text-decoration: underline;">${escapeHtml(university)}</span> / ${escapeHtml(evCategory(ev))} / ${escapeHtml(evField(ev))}
    </div>
  `;

  // お気に入りボタン
  const favBtn = card.querySelector(".fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(ev);
    });
  }

  // 詳細表示切り替え
  const toggleBtn = card.querySelector(".toggle-details-btn");
  const detailsDiv = card.querySelector(".event-details");
  const summaryP = card.querySelector(".event-summary");

  if (toggleBtn && detailsDiv && summaryP) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = detailsDiv.classList.contains("hidden");
      if (isHidden) {
        detailsDiv.classList.remove("hidden");
        summaryP.classList.add("hidden");
        toggleBtn.textContent = "要約を見る ▲";
      } else {
        detailsDiv.classList.add("hidden");
        summaryP.classList.remove("hidden");
        toggleBtn.textContent = "詳細を見る ▼";
      }
    });
  }

  // 大学名クリックで検索フィルター適用
  const universityTag = card.querySelector(".university-tag");
  if (universityTag) {
    universityTag.addEventListener("click", (e) => {
      e.stopPropagation();
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
