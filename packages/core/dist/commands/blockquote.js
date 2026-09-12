export class BlockquoteCommand {
    constructor() {
        this.name = 'blockquote';
    }
    execute() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        // Toggle off if already inside a <blockquote>
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BLOCKQUOTE') {
                const bq = node;
                const frag = document.createDocumentFragment();
                while (bq.firstChild)
                    frag.appendChild(bq.firstChild);
                bq.replaceWith(frag);
                return;
            }
            node = node.parentNode;
        }
        const content = range.extractContents();
        const bq = document.createElement('blockquote');
        bq.appendChild(content);
        range.insertNode(bq);
        const newSelection = window.getSelection();
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(bq);
        newRange.collapse(false);
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.addRange(newRange);
    }
}
