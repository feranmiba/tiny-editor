import { Command } from '../types';
import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';

export class HighlightCommand implements Command {
  name = 'highlight';

  execute(): void {
    const range = getRange();
    if (!range || range.collapsed) return;

    if (isInsideTag('mark')) {
      unwrapTag('mark');
      return;
    }

    const content = range.extractContents();
    const mark = document.createElement('mark');
    mark.appendChild(content);
    range.insertNode(mark);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(mark);
    newRange.collapse(true);
    selection?.addRange(newRange);
  }
}
