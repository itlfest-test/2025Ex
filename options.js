// options.js - 修正版
// data.jsのデータと完全一致するように修正

const universityOptions = [
  "中央（市谷田町）",
  "中央（後楽園）",
  "中央（茗荷谷）",
  "中央（多摩）",
  "理科大（神楽坂）",
  "理科大（葛飾）",
  "理科大（野田）",
  "法政（市ヶ谷）",
  "上智（四谷）",
  "日本（水道橋）",
  "明治（明大前）",
  "東京（駒場）",
  "早稲田（理工）",
  "早稲田（文）",
  "東京科学（湯島）",
  "東京科学（大岡山）",
  "武蔵野美術（鷹の台）"  // ← 鷹の台から市ヶ谷に修正
];

const categoryOptions = [
  "エンタメ・お笑い",
  "講演・セミナー",
  "音楽・パフォーマンス",
  "展示・発表",
  "体験・実験",
  "飲食",
  "物販",
  "その他"  // プレゼント企画は削除（data.jsに存在しない）
];

const fieldOptions = [
  "法",
  "理工",
  "理工学",  // data.jsに「理工学」が存在
  "社会",
  "芸術",
  "文化",
  "医科歯科",
  "その他"
];

// グローバルに公開
window.universityOptions = universityOptions;
window.categoryOptions = categoryOptions;
window.fieldOptions = fieldOptions;
