const status = document.getElementById("status");
const openSettings = document.getElementById("open-settings");
const togglePanel = document.getElementById("toggle-panel");
const shortcutList = document.getElementById("shortcut-list");
const defaultSettings = {
  position: "top-right",
  textColor: "#172033",
  backgroundColor: "#fff4cc",
};

openSettings.addEventListener("click", async () => {
  try {
    await chrome.runtime.openOptionsPage();
  } catch (error) {
    console.error("表示設定を開けませんでした。", error);
    status.textContent = "表示設定を開けませんでした。拡張機能の設定からお試しください。";
  }
});

togglePanel.addEventListener("click", () => {
  togglePanel.disabled = true;
  status.textContent = "ページにパネルを表示しています…";
  showPanel();
});

async function showPanel() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      throw new Error("アクティブなタブを取得できませんでした。");
    }

    const storedSettings = await chrome.storage.local.get(defaultSettings);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/shared/shortcuts.js", "src/content/content.js"],
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "NVDA_NAVIGATOR_TOGGLE_PANEL",
      settings: { ...defaultSettings, ...storedSettings },
    });

    if (!response?.success) {
      throw new Error("ページ上にパネルを表示できませんでした。");
    }
    window.close();
  } catch (error) {
    console.error("ページ上にショートカットパネルを表示できませんでした。", error);
    status.textContent =
      "パネルを表示できませんでした。ショートカット一覧を表示します。Chromeの設定画面などではページ上に表示できません。";
    renderShortcutList();
    togglePanel.disabled = false;
  }
}

function renderShortcutList() {
  shortcutList.replaceChildren();
  for (const group of globalThis.NVDA_SHORTCUTS) {
    const section = document.createElement("section");
    section.className = "shortcut-group";
    const heading = document.createElement("h2");
    heading.textContent = group.group;
    section.append(heading);

    const list = document.createElement("ul");
    for (const command of group.commands) {
      const item = document.createElement("li");
      item.textContent = `${command.label} — ${command.keys.join(" + ")}`;
      list.append(item);
    }
    section.append(list);
    shortcutList.append(section);
  }
  shortcutList.hidden = false;
}
