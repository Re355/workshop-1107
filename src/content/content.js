(() => {
  const stateKey = "__nvdaNavigatorContentLoaded";
  if (window[stateKey]) {
    return;
  }
  window[stateKey] = true;

  const selector = [
    "a[href]",
    "area[href]",
    "button",
    "input",
    "textarea",
    "select",
    "[contenteditable='true']",
    "[role='link']",
    "[role='button']",
    "[role='textbox']",
    "[role='heading']",
    "[role='checkbox']",
    "[role='radio']",
    "[role='switch']",
    "[role='combobox']",
    "[role='searchbox']",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ].join(",");

  function getElement(target) {
    if (target instanceof Element) {
      return target;
    }
    return target instanceof Node ? target.parentElement : null;
  }

  function getContext(type, label, element) {
    const ariaLabel = element.getAttribute("aria-label")?.trim();
    const title = element.getAttribute("title")?.trim();
    const formLabel = Array.from(element.labels ?? [])
      .map((item) => item.innerText.trim())
      .find(Boolean);
    const imageAlt = element.querySelector("img[alt]")?.getAttribute("alt")?.trim();
    const visibleText = element.innerText?.replace(/\s+/g, " ").trim();
    const name = ariaLabel || formLabel || title || imageAlt || visibleText || "";
    const shortenedName = name.length > 50 ? `${name.slice(0, 49)}…` : name;
    return {
      type,
      label: shortenedName ? `${label}：${shortenedName}` : label,
    };
  }

  function describe(target) {
    const element = getElement(target);
    if (!element) {
      return null;
    }

    const semanticElement = element.closest(selector);
    if (!semanticElement) {
      return getContext("other", "Webページの要素", element);
    }

    const tagName = semanticElement.tagName.toLowerCase();
    const role = semanticElement.getAttribute("role");
    if (tagName === "a" || tagName === "area" || role === "link") {
      return getContext("link", "リンク", semanticElement);
    }
    if (/^h[1-6]$/.test(tagName) || role === "heading") {
      const label = /^h[1-6]$/.test(tagName) ? `見出し（${tagName}）` : "見出し";
      return getContext("heading", label, semanticElement);
    }
    if (tagName === "button" || role === "button") {
      return getContext("button", "ボタン", semanticElement);
    }
    if (tagName === "select") {
      return getContext("choice", "選択リスト", semanticElement);
    }
    if (["checkbox", "radio", "switch", "combobox"].includes(role)) {
      return getContext("choice", "フォームコントロール", semanticElement);
    }
    if (role === "searchbox") {
      return getContext("text", "検索入力欄", semanticElement);
    }
    if (tagName === "input") {
      const inputType = semanticElement.type.toLowerCase();
      if (inputType === "checkbox" || inputType === "radio") {
        const label = inputType === "checkbox" ? "チェックボックス" : "ラジオボタン";
        return getContext("choice", label, semanticElement);
      }
      if (["button", "submit", "reset", "image"].includes(inputType)) {
        return getContext("button", "フォームボタン", semanticElement);
      }
      const inputLabels = {
        email: "メールアドレス入力欄",
        number: "数値入力欄",
        password: "パスワード入力欄",
        search: "検索入力欄",
        tel: "電話番号入力欄",
        url: "URL入力欄",
      };
      return getContext("text", inputLabels[inputType] ?? "テキスト入力欄", semanticElement);
    }
    if (
      tagName === "textarea" ||
      semanticElement.isContentEditable ||
      role === "textbox"
    ) {
      return getContext("text", "テキスト入力欄", semanticElement);
    }

    return getContext("other", "Webページの要素", semanticElement);
  }

  let currentContext =
    document.activeElement && document.activeElement !== document.body
      ? describe(document.activeElement)
      : null;

  function updateContext(target) {
    const nextContext = describe(target);
    if (!nextContext) {
      return;
    }
    currentContext = nextContext;
    chrome.runtime.sendMessage(
      {
        type: "NVDA_NAVIGATOR_CONTEXT_CHANGED",
        context: currentContext,
      },
      () => void chrome.runtime.lastError,
    );
  }

  document.addEventListener("focusin", (event) => {
    updateContext(event.target);
  });
  document.addEventListener(
    "click",
    (event) => {
      updateContext(event.target);
    },
    true,
  );

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "NVDA_NAVIGATOR_GET_CONTEXT") {
      sendResponse({ context: currentContext });
    }
  });
})();
