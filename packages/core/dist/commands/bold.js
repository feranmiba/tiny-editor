import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
/**
 * Command module for Bold using custom DOM manipulation.
 */
export class BoldCommand {
    constructor() {
        this.name = 'bold';
    }
    execute() {
        const range = getRange();
        if (!range || range.collapsed)
            return;
        // If already bold → unwrap logic (later phase)
        if (isInsideTag('strong')) {
            console.log('Already bold - undo not implemented yet');
            return;
        }
        const content = range.extractContents();
        const strong = document.createElement('strong');
        strong.appendChild(content);
        range.insertNode(strong);
        // Better selection behavior
        const selection = window.getSelection();
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(strong);
        newRange.collapse(true);
        selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
    }
}
