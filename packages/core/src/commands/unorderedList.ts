import { Command } from '../types';

export class UnorderedListCommand implements Command {
  name = 'unorderedList';

  execute(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;

    // Walk up to find if already inside a <ul>
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'UL') {
        const ul = node as HTMLElement;
        const frag = document.createDocumentFragment();
        Array.from(ul.children).forEach((li) => {
          const p = document.createElement('p');
          p.innerHTML = li.innerHTML;
          frag.appendChild(p);
        });
        ul.replaceWith(frag);
        return;
      }
      node = node.parentNode;
    }

    const content = range.extractContents();
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.appendChild(content);
    ul.appendChild(li);
    range.insertNode(ul);

    const newSelection = window.getSelection();
    newSelection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(false);
    newSelection?.addRange(newRange);
  }
}
