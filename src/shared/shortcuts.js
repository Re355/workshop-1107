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
      { label: "見出しレベル1〜9へ移動", keys: ["1〜9"] },
      { label: "次のリンクへ移動", keys: ["K"] },
      { label: "次の未訪問リンクへ移動", keys: ["U"] },
      { label: "次の訪問済みリンクへ移動", keys: ["V"] },
      { label: "リンクのないテキストへ移動", keys: ["N"] },
      { label: "要素の一覧を表示", keys: ["NVDA", "F7"] },
    ],
  },
  {
    group: "フォーム・ページ要素",
    commands: [
      { label: "次のボタンへ移動", keys: ["B"] },
      { label: "次のフォームフィールドへ移動", keys: ["F"] },
      { label: "次の入力欄へ移動", keys: ["E"] },
      { label: "次のチェックボックスへ移動", keys: ["X"] },
      { label: "次のラジオボタンへ移動", keys: ["R"] },
      { label: "次のコンボボックスへ移動", keys: ["C"] },
      { label: "次のリスト項目へ移動", keys: ["I"] },
      { label: "次のランドマークへ移動", keys: ["D"] },
      { label: "次の画像へ移動", keys: ["G"] },
      { label: "次の引用へ移動", keys: ["Q"] },
      { label: "次の区切り線へ移動", keys: ["S"] },
      { label: "次のフレームへ移動", keys: ["M"] },
      { label: "次の埋め込みオブジェクトへ移動", keys: ["O"] },
      { label: "次のリストへ移動", keys: ["L"] },
      { label: "次の表へ移動", keys: ["T"] },
      { label: "次のテキスト段落へ移動", keys: ["P"] },
      { label: "次のスペルミスへ移動", keys: ["W"] },
      { label: "次の注釈へ移動", keys: ["A"] },
      { label: "次のコンテナへ移動", keys: ["カンマ"] },
      { label: "前のコンテナへ移動", keys: ["Shift", "カンマ"] },
    ],
  },
  {
    group: "操作モード",
    commands: [
      { label: "ブラウズモード／フォーカスモードを切り替え", keys: ["NVDA", "スペース"] },
      { label: "フォーカスモードを終了", keys: ["Esc"] },
      { label: "ブラウズモードの文書を更新", keys: ["NVDA", "F5"] },
    ],
  },
  {
    group: "検索",
    commands: [
      { label: "文書内を検索", keys: ["NVDA", "Ctrl", "F"] },
      { label: "次を検索", keys: ["NVDA", "F3"] },
      { label: "前を検索", keys: ["NVDA", "Shift", "F3"] },
    ],
  },
];
