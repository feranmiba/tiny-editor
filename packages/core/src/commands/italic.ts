import { Command } from '../types';
import { isInsideTag } from '../helper/isInsideTag';


export class ItalicCommand implements Command {
  name = 'italic';

  execute(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

      if (isInsideTag('em')) {
    console.log('Already bold - undo not implemented yet');
    return;
  }

    const range = selection.getRangeAt(0);

    if (range.collapsed) return;

    const content = range.extractContents();

    const em = document.createElement('em');
    em.appendChild(content);

    range.insertNode(em);
  }
}