// ▼▼ 要素取得 ▼▼
const universitySelect = document.getElementById("university");
const categorySelect = document.getElementById("category");
const fieldSelect = document.getElementById("field");
const resultsBox = document.getElementById("results");
const searchBtn = document.getElementById("search-btn");

// ▼▼ 実際のイベントデータ ▼▼
// ここでは data.js から events 変数を直接使用
// data.js で定義されているイベントデータをそのまま使用

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

// 確認用: data.js のイベントデータから実際に必要な情報を取得してリスト化する
const universityOptions = [...new Set(events.map(event => event.university))];
const categoryOptions = [...new Set(events.map(event => event.category))];
const fieldOptions = [...new Set(events.map(event => event.field))];

// プルダウンに選択肢を設定
fillOptions(universitySelect, universityOptions);
fillOptions(categorySelect, categoryOptions);
fillOptions(fieldSelect, fieldOptions);

// ▼▼ 検索ボタン押したら実行 ▼▼
searchBtn.addEventListener("click", () => {
  const uni = universitySelect.value;
  const cat = categorySelect.value;
  const field = fieldSelect.value;

  // フィルタリング処理: 選択された条件で絞り込む
  const filtered = events.filter(ev =>
    (!uni || ev.university === uni) &&
    (!cat || ev.category === cat) &&
    (!field || ev.field === field)
  );

  // 絞り込んだ結果を表示
  displayResults(filtered);
});

// ▼▼ 結果表示 ▼▼
function displayResults(list) {
  resultsBox.innerHTML = ""; // 結果エリアをリセット

  // 結果がなければメッセージ表示
  if (list.length === 0) {
    resultsBox.textContent = "該当するイベントがありません。";
    return;
  }

  // 結果があればリスト表示
  list.forEach(ev => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <h3>${ev.title}</h3>
      <p>${ev.university} / ${ev.category} / ${ev.field}</p>
      <p>${ev.description}</p>
      <p>${ev.start_datetime} ～ ${ev.end_datetime}</p>
      <p>${ev.location}</p>
    `;
    resultsBox.appendChild(div);
  });
}
