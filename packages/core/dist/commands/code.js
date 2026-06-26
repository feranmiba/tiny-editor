import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';
export class CodeCommand {
    constructor() {
        this.name = 'code';
    }
    execute() {
        const range = getRange();
        if (!range || range.collapsed)
            return;
        if (isInsideTag('code')) {
            unwrapTag('code');
            return;
        }
        const content = range.extractContents();
        const code = document.createElement('code');
        code.style.backgroundColor = '#f4f4f4';
        code.style.padding = '2px 4px';
        code.style.borderRadius = '4px';
        code.style.fontFamily = 'monospace';
        code.appendChild(content);
        range.insertNode(code);
        const selection = window.getSelection();
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(code);
        newRange.collapse(true);
        selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
    }
}
