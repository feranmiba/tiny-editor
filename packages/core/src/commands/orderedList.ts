import { Command } from '../types';

export class OrderedListCommand implements Command {
  name = 'orderedList';

  execute(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;

    // Walk up to find if already inside an <ol>
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'OL') {
        // Unwrap: lift all <li> content out and replace with <p>
        const ol = node as HTMLElement;
        const frag = document.createDocumentFragment();
        Array.from(ol.children).forEach((li) => {
          const p = document.createElement('p');
          p.innerHTML = li.innerHTML;
          frag.appendChild(p);
        });
        ol.replaceWith(frag);
        return;
      }
      node = node.parentNode;
    }

    // Wrap selection in <ol><li>...</li></ol>
    const content = range.extractContents();
    const ol = document.createElement('ol');
    const li = document.createElement('li');
    li.appendChild(content);
    ol.appendChild(li);
    range.insertNode(ol);

    const newSelection = window.getSelection();
    newSelection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(false);
    newSelection?.addRange(newRange);
  }
}
