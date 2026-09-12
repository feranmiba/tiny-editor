import { getRange } from '../Selection';
import { isInsideTag } from '../helper/isInsideTag';
import { unwrapTag } from '../helper/unwrapTag';
export class LinkCommand {
    constructor() {
        this.name = 'link';
    }
    execute() {
        // If inside a link, unlink
        if (isInsideTag('a')) {
            unwrapTag('a');
            return;
        }
        const range = getRange();
        if (!range || range.collapsed)
            return;
        const url = window.prompt('Enter URL:', 'https://');
        if (!url || url.trim() === '' || url === 'https://')
            return;
        const content = range.extractContents();
        const a = document.createElement('a');
        a.href = url.trim();
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.appendChild(content);
        range.insertNode(a);
        const selection = window.getSelection();
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(a);
        newRange.collapse(true);
        selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
    }
}
