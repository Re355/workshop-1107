globalThis.NVDA_SHORTCUTS = [
  {
    group: "読み上げ",
    commands: [
      { label: "読み上げを一時停止", keys: ["Control"] },
      { label: "現在位置から読み上げる", keys: ["NVDA", "下矢印"] },
    ],
  },
  {
    group: "見出し・リンク",
    commands: [
      { label: "次の見出しへ移動", keys: ["H"] },
      { label: "前の見出しへ移動", keys: ["Shift", "H"] },
      { label: "次のリンクへ移動", keys: ["K"] },
      { label: "要素の一覧を表示", keys: ["NVDA", "F7"] },
    ],
  },
  {
    group: "操作モード",
    commands: [
      { label: "ブラウズモード／フォーカスモードを切り替え", keys: ["NVDA", "スペース"] },
    ],
  },
];
