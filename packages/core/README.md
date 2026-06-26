# Tiny Editor

A lightweight, framework-agnostic, and highly reusable rich text editor.

## Features

- **Extremely Lightweight**: Uses standard native DOM APIs and `document.execCommand` where possible.
- **Framework Agnostic**: Works perfectly in Vanilla JS, React, Vue, Svelte, or Angular.
- **Pluggable Architecture**: Easily add and register your own commands.
- **Built-in Commands**: Bold, Italic, Underline, Strikethrough, Code, Highlight, Superscript, and Undo.

## Workspace Structure

This project is a monorepo containing:
- `packages/core`: The actual `@amiola_dev/tiny-editor-core` package.
- `packages/playground`: A Vite-powered vanilla TypeScript playground to test the editor in a browser.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the playground:**
   ```bash
   npm run dev
   ```
   This will start the Vite dev server for the playground.

3. **Build the core package:**
   ```bash
   cd packages/core
   npm run build
   ```

## Usage

```typescript
import { Editor, BoldCommand, ItalicCommand } from '@amiola_dev/tiny-editor-core';

// 1. Initialize the editor
const editor = new Editor({
  element: document.getElementById('editor-container'),
  initialHTML: '<p>Hello World!</p>'
});

// 2. Register desired commands
editor.registerCommand(new BoldCommand());
editor.registerCommand(new ItalicCommand());

// 3. Execute commands (e.g. from a button click)
document.getElementById('bold-btn').addEventListener('click', () => {
  editor.exec('bold');
});
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to set up your development environment and submit pull requests.
