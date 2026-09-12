import { Command } from '../types';
import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';

export class SubscriptCommand implements Command {
  name = 'subscript';

  execute(): void {
    const range = getRange();
    if (!range || range.collapsed) return;

    if (isInsideTag('sub')) {
      unwrapTag('sub');
      return;
    }

    const content = range.extractContents();
    const sub = document.createElement('sub');
    sub.appendChild(content);
    range.insertNode(sub);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(sub);
    newRange.collapse(true);
    selection?.addRange(newRange);
  }
}
