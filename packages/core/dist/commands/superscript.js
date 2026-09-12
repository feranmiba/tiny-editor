import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';
export class SuperscriptCommand {
    constructor() {
        this.name = 'superscript';
    }
    execute() {
        const range = getRange();
        if (!range || range.collapsed)
            return;
        if (isInsideTag('sup')) {
            unwrapTag('sup');
            return;
        }
        const content = range.extractContents();
        const sup = document.createElement('sup');
        sup.appendChild(content);
        range.insertNode(sup);
        const selection = window.getSelection();
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(sup);
        newRange.collapse(true);
        selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
    }
}
