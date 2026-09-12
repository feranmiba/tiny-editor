import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';
import { getRange } from '../Selection';
export class ItalicCommand {
    constructor() {
        this.name = 'italic';
    }
    execute() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        // If already italic → unwrap the em tag (same pattern as BoldCommand)
        if (isInsideTag('em')) {
            unwrapTag('em');
            return;
        }
        const range = getRange();
        if (!range || range.collapsed)
            return;
        const content = range.extractContents();
        const em = document.createElement('em');
        em.appendChild(content);
        range.insertNode(em);
        // Move cursor to after the em tag
        const newSelection = window.getSelection();
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(em);
        newRange.collapse(true);
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.addRange(newRange);
    }
}
