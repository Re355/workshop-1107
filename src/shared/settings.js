globalThis.NVDA_DEFAULT_SETTINGS = {
  position: "top-right",
  textColor: "#172033",
  backgroundColor: "#fff4cc",
  fontSize: 14,
};

function hasNVDAChromeStorage() {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

async function getNVDASettings() {
  if (hasNVDAChromeStorage()) {
    return chrome.storage.local.get(globalThis.NVDA_DEFAULT_SETTINGS);
  }

  const savedSettings = localStorage.getItem("nvdaNavigatorSettings");
  return {
    ...globalThis.NVDA_DEFAULT_SETTINGS,
    ...(savedSettings ? JSON.parse(savedSettings) : {}),
  };
}

async function saveNVDASettings(settings) {
  if (hasNVDAChromeStorage()) {
    await chrome.storage.local.set(settings);
    return;
  }

  localStorage.setItem("nvdaNavigatorSettings", JSON.stringify(settings));
}

async function notifyNVDASettingsChanged(settings) {
  if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
    await chrome.runtime.sendMessage({
      type: "NVDA_NAVIGATOR_SETTINGS_UPDATED",
      settings,
    });
  }
}

globalThis.hasNVDAChromeStorage = hasNVDAChromeStorage;
globalThis.getNVDASettings = getNVDASettings;
globalThis.saveNVDASettings = saveNVDASettings;
globalThis.notifyNVDASettingsChanged = notifyNVDASettingsChanged;
