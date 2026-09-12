import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';
export class UnderlineCommand {
    constructor() {
        this.name = 'underline';
    }
    execute() {
        const range = getRange();
        if (!range || range.collapsed)
            return;
        if (isInsideTag('u')) {
            unwrapTag('u');
            return;
        }
        const content = range.extractContents();
        const u = document.createElement('u');
        u.appendChild(content);
        range.insertNode(u);
        const selection = window.getSelection();
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(u);
        newRange.collapse(true);
        selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
    }
}
