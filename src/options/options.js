const form = document.getElementById("settings-form");
const position = document.getElementById("position");
const textColor = document.getElementById("text-color");
const backgroundColor = document.getElementById("background-color");
const fontSize = document.getElementById("font-size");
const fontSizeValue = document.getElementById("font-size-value");
const status = document.getElementById("status");

async function loadSettings() {
  const settings = await globalThis.getNVDASettings();
  position.value = settings.position;
  textColor.value = settings.textColor;
  backgroundColor.value = settings.backgroundColor;
  fontSize.value = String(settings.fontSize);
  fontSizeValue.value = `${settings.fontSize} px`;
}

fontSize.addEventListener("input", () => {
  fontSizeValue.value = `${fontSize.value} px`;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const settings = {
      position: position.value,
      textColor: textColor.value,
      backgroundColor: backgroundColor.value,
      fontSize: Number(fontSize.value),
    };
    await globalThis.saveNVDASettings(settings);
    await globalThis.notifyNVDASettingsChanged(settings);
    status.textContent =
      "設定を保存しました。表示が変わらない場合はパネルを閉じて開き直してください。";
  } catch (error) {
    console.error("表示設定を保存できませんでした。", error);
    status.textContent = "設定を保存できませんでした。もう一度お試しください。";
  }
});

document.getElementById("reset").addEventListener("click", async () => {
  try {
    await globalThis.saveNVDASettings(globalThis.NVDA_DEFAULT_SETTINGS);
    await globalThis.notifyNVDASettingsChanged(
      globalThis.NVDA_DEFAULT_SETTINGS,
    );
    await loadSettings();
    status.textContent =
      "初期設定に戻しました。表示が変わらない場合はパネルを閉じて開き直してください。";
  } catch (error) {
    console.error("初期設定に戻せませんでした。", error);
    status.textContent = "初期設定に戻せませんでした。もう一度お試しください。";
  }
});

loadSettings().catch((error) => {
  console.error("表示設定を読み込めませんでした。", error);
  status.textContent = "設定を読み込めませんでした。ページを再読み込みしてください。";
});
