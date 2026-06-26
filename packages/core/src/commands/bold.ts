import { Command } from '../types';
import { getRange, restoreSelection } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';

/**
 * Command module for Bold using custom DOM manipulation.
 */
export class BoldCommand implements Command {
  name = 'bold';
 
 execute(): void {
  const range = getRange();
  if (!range || range.collapsed) return;

  // If already bold → unwrap logic
  if (isInsideTag('strong')) {
    unwrapTag('strong');
    return;
  }

  const content = range.extractContents();

  const strong = document.createElement('strong');
  strong.appendChild(content);

  range.insertNode(strong);

  // Better selection behavior
  const selection = window.getSelection();
  selection?.removeAllRanges();

  const newRange = document.createRange();
  newRange.setStartAfter(strong);
  newRange.collapse(true);

  selection?.addRange(newRange);
}
}
