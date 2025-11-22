// 大学リスト
const UNIVERSITY_LIST = [
  "中央（市谷田町）",
  "中央（後楽園）",
  "中央（茗荷谷）",
  "中央（多摩）",
  "理科大（神楽坂）",
  "理科大（葛飾）",
  "法政（市ヶ谷）",
  "上智（四谷）",
  "日本（水道橋）",
  "明治（明大前）",
  "東京（駒場）",
  "早稲田（理工）",
  "早稲田（文）",
  "東京科学（湯島）",
  "東京科学（大岡山）",
  "武蔵野美術（鷹の台）"
];

// カテゴリリスト
const CATEGORY_LIST = [
  "エンタメ・お笑い",
  "講演・セミナー",
  "音楽・パフォーマンス",
  "展示・発表",
  "体験・実験",
  "飲食",
  "物販",
  "プレゼント企画",
  "その他"
];

// 分野リスト
const FIELD_LIST = [
  "法",
  "情報",
  "理工",
  "社会",
  "デザイン",
  "芸術",
  "文化",
  "医科歯科",
  "その他"
];

// ▼ ページ読み込み時にリストを挿入
window.addEventListener("DOMContentLoaded", () => {
  fillSelectOptions("university", UNIVERSITY_LIST);
  fillSelectOptions("category", CATEGORY_LIST);
  fillSelectOptions("field", FIELD_LIST);
});

// ▼ セレクトに選択肢を追加
function fillSelectOptions(selectId, list) {
  const select = document.getElementById(selectId);
  list.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}
