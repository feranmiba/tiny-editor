export class UnorderedListCommand {
    constructor() {
        this.name = 'unorderedList';
    }
    execute() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        // Walk up to find if already inside a <ul>
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'UL') {
                const ul = node;
                const frag = document.createDocumentFragment();
                Array.from(ul.children).forEach((li) => {
                    const p = document.createElement('p');
                    p.innerHTML = li.innerHTML;
                    frag.appendChild(p);
                });
                ul.replaceWith(frag);
                return;
            }
            node = node.parentNode;
        }
        const content = range.extractContents();
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.appendChild(content);
        ul.appendChild(li);
        range.insertNode(ul);
        const newSelection = window.getSelection();
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(li);
        newRange.collapse(false);
        newSelection === null || newSelection === void 0 ? void 0 : newSelection.addRange(newRange);
    }
}
