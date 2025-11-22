/* ▼ タブ切り替え処理 ▼ */
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    // タブの active を変更
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // 画面切り替え
    const target = btn.dataset.target;
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});
