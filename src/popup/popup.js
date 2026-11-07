const shortcuts = [
  {
    group: "読み上げ",
    commands: [
      {
        id: "stop-speech",
        label: "読み上げを一時停止",
        keys: ["Control"],
      },
      {
        id: "read-from-here",
        label: "現在位置から読み上げる",
        keys: ["NVDA", "下矢印"],
      },
    ],
  },
  {
    group: "見出し・リンク",
    commands: [
      {
        id: "next-heading",
        label: "次の見出しへ移動",
        keys: ["H"],
      },
      {
        id: "previous-heading",
        label: "前の見出しへ移動",
        keys: ["Shift", "H"],
      },
      {
        id: "next-link",
        label: "次のリンクへ移動",
        keys: ["K"],
      },
      {
        id: "elements-list",
        label: "要素の一覧を表示",
        keys: ["NVDA", "F7"],
      },
    ],
  },
  {
    group: "操作モード",
    commands: [
      {
        id: "toggle-mode",
        label: "ブラウズモード／フォーカスモードを切り替え",
        keys: ["NVDA", "スペース"],
      },
    ],
  },
];

const recommendationsByType = {
  link: {
    intro: "リンクの移動や一覧表示に使えます。",
    commandIds: ["next-link", "elements-list"],
  },
  heading: {
    intro: "見出しをたどったり、一覧から選んだりできます。",
    commandIds: ["next-heading", "previous-heading", "elements-list"],
  },
  text: {
    intro: "入力欄では、フォーカスモードとの切り替えが役立ちます。",
    commandIds: ["toggle-mode", "read-from-here"],
  },
  choice: {
    intro: "フォームの操作モードを切り替えられます。",
    commandIds: ["toggle-mode"],
  },
  button: {
    intro: "操作モードを切り替えると、ボタンの操作に役立つ場合があります。",
    commandIds: ["toggle-mode"],
  },
  other: {
    intro: "ページの読み上げや、要素一覧を利用できます。",
    commandIds: ["read-from-here", "elements-list"],
  },
};

const shortcutGroups = document.getElementById("shortcut-groups");
const contextStatus = document.getElementById("context-status");
const recommendations = document.getElementById("recommendations");
const recommendationList = document.getElementById("recommendation-list");
const commandsById = new Map();

for (const group of shortcuts) {
  const section = document.createElement("section");
  section.className = "shortcut-group";

  const heading = document.createElement("h3");
  heading.textContent = group.group;
  section.append(heading);

  const list = document.createElement("ul");
  for (const command of group.commands) {
    commandsById.set(command.id, command);
    const item = document.createElement("li");
    item.className = "shortcut";
    item.dataset.commandId = command.id;

    const label = document.createElement("span");
    label.className = "shortcut-label";
    label.textContent = command.label;

    const keys = document.createElement("span");
    keys.className = "shortcut-keys";
    keys.setAttribute("aria-label", `キー: ${command.keys.join(" + ")}`);
    for (const [index, key] of command.keys.entries()) {
      if (index > 0) {
        const separator = document.createElement("span");
        separator.className = "key-separator";
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = "+";
        keys.append(separator);
      }

      const keyElement = document.createElement("kbd");
      keyElement.textContent = key;
      keys.append(keyElement);
    }

    item.append(label, keys);
    list.append(item);
  }

  section.append(list);
  shortcutGroups.append(section);
}

function showContext(context) {
  for (const item of shortcutGroups.querySelectorAll(".is-recommended")) {
    item.classList.remove("is-recommended");
  }

  if (!context || typeof context.label !== "string") {
    contextStatus.textContent =
      "要素を検知できていません。ページ内の要素をクリックまたはフォーカスしてから、開き直してください。";
    recommendations.hidden = true;
    return;
  }

  contextStatus.textContent = context.label;
  recommendationList.replaceChildren();

  const recommendation = recommendationsByType[context.type] ?? recommendationsByType.other;
  const intro = document.createElement("li");
  intro.className = "recommendation-intro";
  intro.textContent = recommendation.intro;
  recommendationList.append(intro);

  for (const commandId of recommendation.commandIds) {
    const command = commandsById.get(commandId);
    if (!command) {
      continue;
    }

    const item = document.createElement("li");
    item.className = "recommendation";
    item.textContent = command.label;
    recommendationList.append(item);
    shortcutGroups
      .querySelector(`[data-command-id="${command.id}"]`)
      ?.classList.add("is-recommended");
  }

  recommendations.hidden = false;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "NVDA_NAVIGATOR_CONTEXT_CHANGED") {
    showContext(message.context);
  }
});

async function loadCurrentTabContext() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      throw new Error("アクティブなタブを取得できませんでした。");
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/content/content.js"],
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "NVDA_NAVIGATOR_GET_CONTEXT",
    });
    showContext(response?.context);
  } catch (error) {
    console.error("ページの要素を取得できませんでした。", error);
    contextStatus.textContent =
      "このページでは要素を確認できません。通常のWebページでお試しください。";
    recommendations.hidden = true;
  }
}

loadCurrentTabContext();
