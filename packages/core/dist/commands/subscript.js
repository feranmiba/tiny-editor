import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';
export class SubscriptCommand {
    constructor() {
        this.name = 'subscript';
    }
    execute() {
        const range = getRange();
        if (!range || range.collapsed)
            return;
        if (isInsideTag('sub')) {
            unwrapTag('sub');
            return;
        }
        const content = range.extractContents();
        const sub = document.createElement('sub');
        sub.appendChild(content);
        range.insertNode(sub);
        const selection = window.getSelection();
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(sub);
        newRange.collapse(true);
        selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
    }
}
