# ✏️ Tiny Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)]()
[![Zero dependencies](https://img.shields.io/badge/deps-zero-blue.svg)]()

A **lightweight, framework-agnostic, zero-dependency** rich text editor built entirely on native DOM APIs.

---

## ✨ Features

| Category | Commands |
|---|---|
| **History** | Undo |
| **Inline text** | Bold · Italic · Underline · Strikethrough · Superscript · Subscript |
| **Inline decoration** | Inline code · Highlight |
| **Blocks** | Heading (H1/H2/H3) · Blockquote · Ordered list · Unordered list |
| **Media & links** | Insert image (from disk) · Insert / remove hyperlink |

- 🪶 **Extremely lightweight** — zero npm dependencies, pure TypeScript
- 🔌 **Pluggable** — register your own `Command` in two lines
- 🌍 **Framework-agnostic** — works in Vanilla JS, React, Vue, Svelte, Angular
- 🔒 **No `document.execCommand` abuse** — all formatting uses modern DOM APIs
- 🖼️ **Live preview** — playground shows rendered output & raw HTML side-by-side
- 📋 **Copy HTML** — one-click export of the editor content

---

## 📦 Workspace Structure

```
tiny-editor/
├── packages/
│   ├── core/          # The editor library (publishable)
│   └── playground/    # Vite-powered live demo
├── LICENSE            # MIT
└── README.md
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the playground dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔧 Usage

```typescript
import {
  Editor,
  BoldCommand,
  ItalicCommand,
  HeadingCommand,
  ImageCommand,
  LinkCommand,
} from 'light-text-editor';

// 1. Initialise
const editor = new Editor({
  element: document.getElementById('editor'),
  initialHTML: '<p>Hello <strong>world</strong>!</p>',
});

// 2. Register commands
editor.registerCommand(new BoldCommand());
editor.registerCommand(new ItalicCommand());
editor.registerCommand(new HeadingCommand('h2'));
editor.registerCommand(new ImageCommand());
editor.registerCommand(new LinkCommand());

// 3. Trigger from buttons
document.getElementById('bold-btn').addEventListener('click', () => {
  editor.exec('bold');
});

// 4. Get HTML output
const html = editor.getHTML();
```

### Writing your own command

```typescript
import type { Command } from 'light-text-editor';

export class RedTextCommand implements Command {
  name = 'redText';

  execute() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    span.style.color = 'red';
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }
}

editor.registerCommand(new RedTextCommand());
editor.exec('redText');
```

---

## 📄 License

[MIT](./LICENSE) © 2026 Tiny Editor contributors
