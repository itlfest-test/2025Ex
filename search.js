// ▼▼ 要素取得 ▼▼
const universitySelect = document.getElementById("universities");
const categorySelect = document.getElementById("categories");
const fieldSelect = document.getElementById("fields");
const resultsBox = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");

document.addEventListener("DOMContentLoaded", function () {
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
  searchBtn.addEventListener("click", () => {
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
});
