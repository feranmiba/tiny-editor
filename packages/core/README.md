# light-text-editor

A lightweight, framework-agnostic, and highly reusable rich text editor.

## Installation

You can install the package via npm, yarn, or pnpm:

```bash
npm install light-text-editor
```

## Usage in React / Next.js

Since `light-text-editor` uses standard native DOM APIs, integrating it into a React or Next.js project is straightforward. You simply use a `useRef` to give the editor access to a DOM element.

Here is a full example of how to build a simple Rich Text Editor component in React:

```tsx
import { useEffect, useRef } from 'react';
import { Editor, BoldCommand, ItalicCommand } from 'light-text-editor';

export default function MyRichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<Editor | null>(null);

  useEffect(() => {
    // Make sure we only initialize the editor once
    if (editorRef.current && !editorInstance.current) {
      
      // 1. Initialize the editor
      editorInstance.current = new Editor({
        element: editorRef.current,
        initialHTML: '<p>Start typing here...</p>'
      });

      // 2. Register desired commands
      editorInstance.current.registerCommand(new BoldCommand());
      editorInstance.current.registerCommand(new ItalicCommand());
    }
  }, []);

  // 3. Execute commands from your custom toolbar buttons
  const toggleBold = () => editorInstance.current?.exec('bold');
  const toggleItalic = () => editorInstance.current?.exec('italic');

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="toolbar" style={{ marginBottom: '10px' }}>
        <button onClick={toggleBold} type="button">Bold</button>
        <button onClick={toggleItalic} type="button">Italic</button>
      </div>
      
      {/* Editor Content Area */}
      <div 
        ref={editorRef} 
        style={{ minHeight: '200px', border: '1px solid #ccc', padding: '12px' }}
      />
    </div>
  );
}
```

## Features

- **Extremely Lightweight**: Uses standard native DOM APIs and `document.execCommand` where possible.
- **Framework Agnostic**: Works perfectly in React, Next.js, Vue, Svelte, or Vanilla JS.
- **Pluggable Architecture**: Easily add and register your own custom formatting commands.
- **Built-in Commands**: Bold, Italic, Underline, Strikethrough, Code, Highlight, Superscript, and Undo.
