import {
  Editor,
  BoldCommand,
  ItalicCommand,
  UnderlineCommand,
  StrikethroughCommand,
  CodeCommand,
  HighlightCommand,
  SuperscriptCommand,
  SubscriptCommand,
  UndoCommand,
  OrderedListCommand,
  UnorderedListCommand,
  LinkCommand,
  BlockquoteCommand,
  HeadingCommand,
  ImageCommand,
} from '../core/src/index';

/* ── Bootstrap editor ─────────────────────────────────────── */
const editorEl = document.getElementById('editor-container') as HTMLElement;

const editor = new Editor({
  element: editorEl,
  initialHTML: `<h2>Welcome to <strong>Tiny Editor</strong> ✏️</h2>
<p>Select text and click a toolbar button to format it. Try the new tools:</p>
<ul>
  <li><strong>H1 / H2 / H3</strong> — headings</li>
  <li><strong>❝</strong> — blockquote</li>
  <li><strong>1. / •</strong> — ordered &amp; unordered lists</li>
  <li><strong>🔗</strong> — hyperlinks</li>
  <li><strong>🖼️</strong> — insert an image from disk</li>
  <li><strong>X<sub>2</sub></strong> — subscript</li>
</ul>
<p>The <em>Preview</em> panel on the right updates live as you type.</p>`,
});

/* Register all commands */
editor.registerCommand(new UndoCommand());
editor.registerCommand(new BoldCommand());
editor.registerCommand(new ItalicCommand());
editor.registerCommand(new UnderlineCommand());
editor.registerCommand(new StrikethroughCommand());
editor.registerCommand(new CodeCommand());
editor.registerCommand(new HighlightCommand());
editor.registerCommand(new SuperscriptCommand());
editor.registerCommand(new SubscriptCommand());
editor.registerCommand(new OrderedListCommand());
editor.registerCommand(new UnorderedListCommand());
editor.registerCommand(new LinkCommand());
editor.registerCommand(new BlockquoteCommand());
editor.registerCommand(new HeadingCommand('h1'));
editor.registerCommand(new HeadingCommand('h2'));
editor.registerCommand(new HeadingCommand('h3'));
editor.registerCommand(new ImageCommand());

/* ── Wire up toolbar buttons ──────────────────────────────── */
const btn = (id: string, cmd: string) => {
  document.getElementById(id)?.addEventListener('click', () => editor.exec(cmd));
};

btn('btn-undo',          'undo');
btn('btn-bold',          'bold');
btn('btn-italic',        'italic');
btn('btn-underline',     'underline');
btn('btn-strikethrough', 'strikethrough');
btn('btn-code',          'code');
btn('btn-highlight',     'highlight');
btn('btn-superscript',   'superscript');
btn('btn-subscript',     'subscript');
btn('btn-heading-h1',    'heading-h1');
btn('btn-heading-h2',    'heading-h2');
btn('btn-heading-h3',    'heading-h3');
btn('btn-blockquote',    'blockquote');
btn('btn-orderedList',   'orderedList');
btn('btn-unorderedList', 'unorderedList');
btn('btn-link',          'link');
btn('btn-image',         'image');

/* ── Live preview ─────────────────────────────────────────── */
const previewFrame  = document.getElementById('preview-frame') as HTMLIFrameElement;
const htmlSourceEl  = document.getElementById('html-source') as HTMLPreElement;

const PREVIEW_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 15px;
    line-height: 1.7;
    padding: 1.25rem;
    color: #18181b;
    margin: 0;
  }
  h1 { font-size: 1.8rem; margin-bottom:.5rem; }
  h2 { font-size: 1.4rem; margin-bottom:.5rem; }
  h3 { font-size: 1.1rem; margin-bottom:.5rem; }
  p  { margin-bottom: .75rem; }
  blockquote {
    border-left: 3px solid #4f46e5;
    margin: .75rem 0; padding: .25rem .75rem;
    color: #71717a; font-style: italic;
  }
  code {
    background: #f4f4f5; padding: 1px 5px;
    border-radius: 4px;
    font-family: ui-monospace, Menlo, monospace;
    font-size: .9em;
  }
  mark { background: #fde68a; border-radius: 2px; }
  a    { color: #4f46e5; }
  ul, ol { padding-left: 1.5rem; margin-bottom: .75rem; }
  img  { max-width: 100%; border-radius: 4px; }
`;

function updatePreview() {
  const html = editor.getHTML();

  // Render in iframe (sandboxed, allows images via srcdoc)
  const doc = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${PREVIEW_STYLES}</style></head><body>${html}</body></html>`;
  previewFrame.srcdoc = doc;

  // Show prettified HTML source
  htmlSourceEl.textContent = html;
}

// Update on every input / mutation inside the editor
editorEl.addEventListener('input', updatePreview);

// Also catch image insertions & command-driven mutations via MutationObserver
const observer = new MutationObserver(updatePreview);
observer.observe(editorEl, { childList: true, subtree: true, characterData: true, attributes: true });

// Initial render
updatePreview();

/* ── Copy HTML button ─────────────────────────────────────── */
const copyBtn = document.getElementById('btn-copy-html') as HTMLButtonElement;
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(editor.getHTML());
    copyBtn.textContent = '✓ Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = 'Copy HTML';
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = editor.getHTML();
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
});
