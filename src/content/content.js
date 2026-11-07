(() => {
  const stateKey = "__nvdaNavigatorPanelListener";
  if (window[stateKey]) {
    return;
  }
  window[stateKey] = true;

  const defaultSettings = {
    position: "top-right",
    textColor: "#172033",
    backgroundColor: "#fff4cc",
    fontSize: 14,
  };
  const positions = new Set([
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "center",
  ]);
  const colorPattern = /^#[0-9a-f]{6}$/i;
  let activePanel = null;
  let settingsPort = null;

  function getSafeSettings(settings) {
    return {
      position: positions.has(settings?.position)
        ? settings.position
        : defaultSettings.position,
      textColor: colorPattern.test(settings?.textColor)
        ? settings.textColor
        : defaultSettings.textColor,
      backgroundColor: colorPattern.test(settings?.backgroundColor)
        ? settings.backgroundColor
        : defaultSettings.backgroundColor,
      fontSize:
        Number.isInteger(settings?.fontSize) &&
        settings.fontSize >= 12 &&
        settings.fontSize <= 24
          ? settings.fontSize
          : defaultSettings.fontSize,
    };
  }

  function createPanel(settings) {
    const host = document.createElement("div");
    host.id = "nvda-navigator-shortcuts";
    host.style.setProperty("--nvda-text-color", settings.textColor);
    host.style.setProperty("--nvda-background-color", settings.backgroundColor);
    host.style.setProperty("--nvda-font-size", `${settings.fontSize}px`);

    const shadow = host.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `
      :host {
        all: initial;
        color: var(--nvda-text-color);
        font-family: "Yu Gothic UI", "Meiryo", sans-serif;
        color-scheme: light;
        position: fixed;
        z-index: 2147483647;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
      }
      :host([data-position="top-left"]) { top: 16px; left: 16px; }
      :host([data-position="top-right"]) { top: 16px; right: 16px; }
      :host([data-position="bottom-left"]) { bottom: 16px; left: 16px; }
      :host([data-position="bottom-right"]) { bottom: 16px; right: 16px; }
      :host([data-position="center"]) {
        top: 50%; left: 50%; transform: translate(-50%, -50%);
      }
      * { box-sizing: border-box; }
      .panel {
        width: min(390px, calc(100vw - 32px));
        max-height: calc(100vh - 32px);
        overflow: auto;
        padding: 16px;
        border: 2px solid currentColor;
        border-radius: 12px;
        background: var(--nvda-background-color);
        color: var(--nvda-text-color);
        box-shadow: 0 8px 32px rgb(0 0 0 / 35%);
        font-size: var(--nvda-font-size);
        line-height: 1.5;
      }
      .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }
      h1 { margin: 0; font-size: 1.35em; line-height: 1.4; }
      .hint { margin: 3px 0 0; font-size: 0.86em; }
      .close {
        flex: 0 0 auto;
        width: 36px;
        height: 36px;
        border: 2px solid currentColor;
        border-radius: 6px;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
      }
      .close:focus-visible { outline: 3px solid currentColor; outline-offset: 2px; }
      section { margin-top: 12px; }
      h2 { margin: 0 0 5px; font-size: 1.08em; }
      ul { margin: 0; padding: 0; list-style: none; }
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 6px 2px;
        border-top: 1px solid currentColor;
      }
      kbd {
        flex: 0 0 auto;
        padding: 2px 6px;
        border: 1px solid currentColor;
        border-radius: 4px;
        background: rgb(127 127 127 / 18%);
        color: inherit;
        font: inherit;
        font-size: 0.86em;
        white-space: nowrap;
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; }
      }
    `;

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", "nvda-panel-title");

    const header = document.createElement("header");
    header.className = "header";
    const title = document.createElement("div");
    const heading = document.createElement("h1");
    heading.id = "nvda-panel-title";
    heading.textContent = "NVDAナビゲーター";
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent =
      "NVDAキーは通常 Insert または Caps Lock です。クイックナビゲーションはブラウズモードで使い、Shiftを加えると前の要素へ移動します。";
    title.append(heading, hint);

    const closeButton = document.createElement("button");
    closeButton.className = "close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "ショートカットパネルを閉じる");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => {
      host.remove();
      activePanel = null;
      settingsPort?.disconnect();
      settingsPort = null;
    });
    header.append(title, closeButton);
    panel.append(header);

    for (const group of globalThis.NVDA_SHORTCUTS) {
      const section = document.createElement("section");
      const groupHeading = document.createElement("h2");
      groupHeading.textContent = group.group;
      section.append(groupHeading);

      const list = document.createElement("ul");
      for (const command of group.commands) {
        const item = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = command.label;
        const keys = document.createElement("span");
        keys.setAttribute("aria-label", `キー: ${command.keys.join(" + ")}`);
        for (const [index, key] of command.keys.entries()) {
          if (index > 0) {
            const separator = document.createElement("span");
            separator.setAttribute("aria-hidden", "true");
            separator.textContent = " + ";
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
      panel.append(section);
    }

    shadow.append(style, panel);
    host.dataset.position = settings.position;
    return host;
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "NVDA_NAVIGATOR_TOGGLE_PANEL") {
      return;
    }

    if (activePanel?.isConnected) {
      activePanel.remove();
      activePanel = null;
      settingsPort?.disconnect();
      settingsPort = null;
      sendResponse({ success: true, visible: false });
      return;
    }
    activePanel = null;

    if (!globalThis.NVDA_SHORTCUTS) {
      sendResponse({ success: false });
      return;
    }

    activePanel = createPanel(getSafeSettings(message.settings));
    document.documentElement.append(activePanel);
    settingsPort = chrome.runtime.connect({
      name: "NVDA_NAVIGATOR_PANEL",
    });
    settingsPort.onMessage.addListener((update) => {
      if (update?.type === "NVDA_NAVIGATOR_SETTINGS_UPDATED") {
        applySettings(update.settings);
      }
    });
    sendResponse({ success: true, visible: true });
  });

  function applySettings(settings) {
    if (!activePanel?.isConnected) {
      return;
    }

    const updatedSettings = getSafeSettings(settings);
    activePanel.dataset.position = updatedSettings.position;
    activePanel.style.setProperty("--nvda-text-color", updatedSettings.textColor);
    activePanel.style.setProperty(
      "--nvda-background-color",
      updatedSettings.backgroundColor,
    );
    activePanel.style.setProperty(
      "--nvda-font-size",
      `${updatedSettings.fontSize}px`,
    );
  }

  if (chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local" || !activePanel) {
        return;
      }

      const updatedSettings = getSafeSettings({
        position: changes.position?.newValue ?? activePanel.dataset.position,
        textColor:
          changes.textColor?.newValue ??
          activePanel.style.getPropertyValue("--nvda-text-color"),
        backgroundColor:
          changes.backgroundColor?.newValue ??
          activePanel.style.getPropertyValue("--nvda-background-color"),
        fontSize:
          changes.fontSize?.newValue ??
          Number.parseInt(
            activePanel.style.getPropertyValue("--nvda-font-size"),
            10,
          ),
      });
      applySettings(updatedSettings);
    });
  }
})();
