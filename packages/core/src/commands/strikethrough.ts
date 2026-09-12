import { Command } from '../types';
import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';

export class StrikethroughCommand implements Command {
  name = 'strikethrough';

  execute(): void {
    const range = getRange();
    if (!range || range.collapsed) return;

    if (isInsideTag('s')) {
      unwrapTag('s');
      return;
    }

    const content = range.extractContents();
    const s = document.createElement('s');
    s.appendChild(content);
    range.insertNode(s);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(s);
    newRange.collapse(true);
    selection?.addRange(newRange);
  }
}
