const form = document.getElementById("settings-form");
const position = document.getElementById("position");
const textColor = document.getElementById("text-color");
const backgroundColor = document.getElementById("background-color");
const status = document.getElementById("status");

async function loadSettings() {
  const settings = await globalThis.getNVDASettings();
  position.value = settings.position;
  textColor.value = settings.textColor;
  backgroundColor.value = settings.backgroundColor;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await globalThis.saveNVDASettings({
      position: position.value,
      textColor: textColor.value,
      backgroundColor: backgroundColor.value,
    });
    status.textContent = globalThis.hasNVDAChromeStorage()
      ? "設定を保存しました。"
      : "設定を保存しました。変更は次回パネル表示時に反映されます。";
  } catch (error) {
    console.error("表示設定を保存できませんでした。", error);
    status.textContent = "設定を保存できませんでした。もう一度お試しください。";
  }
});

document.getElementById("reset").addEventListener("click", async () => {
  try {
    await globalThis.saveNVDASettings(globalThis.NVDA_DEFAULT_SETTINGS);
    await loadSettings();
    status.textContent = globalThis.hasNVDAChromeStorage()
      ? "初期設定に戻しました。"
      : "初期設定に戻しました。変更は次回パネル表示時に反映されます。";
  } catch (error) {
    console.error("初期設定に戻せませんでした。", error);
    status.textContent = "初期設定に戻せませんでした。もう一度お試しください。";
  }
});

loadSettings().catch((error) => {
  console.error("表示設定を読み込めませんでした。", error);
  status.textContent = "設定を読み込めませんでした。ページを再読み込みしてください。";
});
