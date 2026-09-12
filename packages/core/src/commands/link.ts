import { Command } from '../types';
import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';

export class LinkCommand implements Command {
  name = 'link';

  execute(): void {
    // If inside a link, unlink
    if (isInsideTag('a')) {
      unwrapTag('a');
      return;
    }

    const range = getRange();
    if (!range || range.collapsed) return;

    const url = window.prompt('Enter URL:', 'https://');
    if (!url || url.trim() === '' || url === 'https://') return;

    const content = range.extractContents();
    const a = document.createElement('a');
    a.href = url.trim();
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.appendChild(content);
    range.insertNode(a);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(a);
    newRange.collapse(true);
    selection?.addRange(newRange);
  }
}
