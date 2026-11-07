const panelPorts = new Set();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "NVDA_NAVIGATOR_PANEL") {
    return;
  }

  panelPorts.add(port);
  port.onDisconnect.addListener(() => {
    panelPorts.delete(port);
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "NVDA_NAVIGATOR_SETTINGS_UPDATED") {
    return;
  }

  for (const port of panelPorts) {
    try {
      port.postMessage(message);
    } catch (error) {
      console.error("設定をパネルに送信できませんでした。", error);
      panelPorts.delete(port);
    }
  }
});
