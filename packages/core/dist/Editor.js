const INLINE_FORMAT_TAGS = new Set(['STRONG', 'EM', 'U', 'S', 'CODE', 'MARK', 'SUP', 'B', 'I', 'STRIKE']);
const BLOCK_TAGS = new Set(['P', 'DIV', 'LI', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TD', 'TH']);
export class Editor {
    constructor(options) {
        this.commands = new Map();
        this.element = options.element;
        this.element.setAttribute('contenteditable', 'true');
        this.element.classList.add('tiny-editor-root');
        if (options.initialHTML) {
            this.setHTML(options.initialHTML);
        }
        this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    /**
     * Intercepts Enter inside any inline formatting tag.
     * Instead of letting the browser duplicate the inline tag into the new line,
     * we prevent default and manually insert a fresh, clean block element.
     */
    handleKeyDown(e) {
        var _a, _b;
        if (e.key !== 'Enter')
            return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        // Walk up from the cursor and collect all inline ancestors.
        // We also look for the nearest parent block element.
        let node = range.startContainer;
        let outermostInline = null;
        let parentBlock = null;
        while (node && node !== this.element) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node;
                if (INLINE_FORMAT_TAGS.has(el.tagName)) {
                    // Keep updating — we want the OUTERmost one
                    outermostInline = el;
                }
                else if (BLOCK_TAGS.has(el.tagName) && !parentBlock) {
                    parentBlock = el;
                }
            }
            node = node.parentNode;
        }
        // If cursor is not inside any inline tag, let browser handle Enter normally
        if (!outermostInline)
            return;
        e.preventDefault();
        // Collapse selection (delete any selected text)
        if (!range.collapsed)
            range.deleteContents();
        const targetBlock = (_b = (_a = parentBlock !== null && parentBlock !== void 0 ? parentBlock : outermostInline.closest('p, div, li, blockquote')) !== null && _a !== void 0 ? _a : outermostInline.parentElement) !== null && _b !== void 0 ? _b : this.element;
        const newBlockTag = BLOCK_TAGS.has(targetBlock.tagName) ? targetBlock.tagName.toLowerCase() : 'div';
        const newBlock = document.createElement(newBlockTag);
        newBlock.appendChild(document.createElement('br'));
        targetBlock.insertAdjacentElement('afterend', newBlock);
        const newRange = document.createRange();
        newRange.setStart(newBlock, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    getHTML() {
        return this.element.innerHTML;
    }
    setHTML(html) {
        this.element.innerHTML = html;
    }
    focus() {
        this.element.focus();
    }
    registerCommand(command) {
        this.commands.set(command.name, command);
    }
    exec(commandName) {
        const command = this.commands.get(commandName);
        if (command) {
            command.execute();
            this.focus();
        }
        else {
            console.warn(`Command "${commandName}" is not registered.`);
        }
    }
}
