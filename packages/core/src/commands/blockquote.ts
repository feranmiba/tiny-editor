import { Command } from '../types';

export class BlockquoteCommand implements Command {
  name = 'blockquote';

  execute(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;

    // Toggle off if already inside a <blockquote>
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BLOCKQUOTE') {
        const bq = node as HTMLElement;
        const frag = document.createDocumentFragment();
        while (bq.firstChild) frag.appendChild(bq.firstChild);
        bq.replaceWith(frag);
        return;
      }
      node = node.parentNode;
    }

    const content = range.extractContents();
    const bq = document.createElement('blockquote');
    bq.appendChild(content);
    range.insertNode(bq);

    const newSelection = window.getSelection();
    newSelection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(bq);
    newRange.collapse(false);
    newSelection?.addRange(newRange);
  }
}
