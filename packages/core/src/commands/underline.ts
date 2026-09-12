import { Command } from '../types';
import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';

export class UnderlineCommand implements Command {
  name = 'underline';

  execute(): void {
    const range = getRange();
    if (!range || range.collapsed) return;

    if (isInsideTag('u')) {
      unwrapTag('u');
      return;
    }

    const content = range.extractContents();
    const u = document.createElement('u');
    u.appendChild(content);
    range.insertNode(u);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(u);
    newRange.collapse(true);
    selection?.addRange(newRange);
  }
}
