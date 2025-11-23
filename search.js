// ▼▼ 要素取得 ▼▼
const universitySelect = document.getElementById("university");
const categorySelect = document.getElementById("category");
const fieldSelect = document.getElementById("field");
const resultsBox = document.getElementById("results");
const searchButton = document.getElementById("search-btn"); // 名前を変更

// ▼▼ 大学、カテゴリ、分野の選択肢（仮のデータ） ▼▼
const universityOptions = [
  "中央（市谷田町）",
  "日本（水道橋）",
  "早稲田（西早稲田）",
  "東京大学（本郷）"
];

const categoryOptions = [
  "エンタメ・お笑い",
  "講演・セミナー",
  "音楽・パフォーマンス",
  "展示・出店"
];

const fieldOptions = [
  "その他",
  "社会",
  "文化",
  "法"
];

// ▼▼ プルダウンに選択肢を入れる ▼▼
function fillOptions(selectBox, list) {
  selectBox.innerHTML = "<option value=''>選択してください</option>";
  list.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    selectBox.appendChild(opt);
  });
}

fillOptions(universitySelect, universityOptions);
fillOptions(categorySelect, categoryOptions);
fillOptions(fieldSelect, fieldOptions);

// ▼▼ 検索ボタン押したら実行 ▼▼
searchButton.addEventListener("click", () => {
  const uni = universitySelect.value;
  const cat = categorySelect.value;
  const field = fieldSelect.value;

  const filtered = eventsData.filter(ev =>
    (!uni || ev.university === uni) &&
    (!cat || ev.category === cat) &&
    (!field || ev.field === field)
  );

  displayResults(filtered);
});

// ▼▼ 結果表示 ▼▼
function displayResults(list) {
  resultsBox.innerHTML = "";

  if (list.length === 0) {
    resultsBox.textContent = "該当するイベントがありません。";
    return;
  }

  list.forEach(ev => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <h3>${ev.title}</h3>
      <p>${ev.university} / ${ev.category} / ${ev.field}</p>
      <p>${ev.description}</p>
    `;
    resultsBox.appendChild(div);
  });
}
