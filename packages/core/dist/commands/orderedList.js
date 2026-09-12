export class OrderedListCommand {
    constructor() {
        this.name = 'orderedList';
    }
    execute() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        // Walk up to find if already inside an <ol>
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'OL') {
                // Unwrap: lift all <li> content out and replace with <p>
                const ol = node;
                const frag = document.createDocumentFragment();
                Array.from(ol.children).forEach((li) => {
                    const p = document.createElement('p');
                    p.innerHTML = li.innerHTML;
                    frag.appendChild(p);
                });
                ol.replaceWith(frag);
                return;
            }
            node = node.parentNode;
        }
        // Wrap selection in <ol><li>...</li></ol>
        const content = range.extractContents();
        const ol = document.createElement('ol');
        const li = document.createElement('li');
        li.appendChild(content);
        ol.appendChild(li);
        range.insertNode(ol);
        const newSelection = window.getSelection();
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(li);
        newRange.collapse(false);
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.addRange(newRange);
    }
}
