/**
 * HeadingCommand wraps/unwraps the current block as a heading.
 * Pass a level ('h1', 'h2', 'h3') to the constructor.
 */
export class HeadingCommand {
    constructor(level = 'h2') {
        this.level = level;
        this.name = `heading-${level}`;
    }
    execute() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        // Walk up to find the nearest block element
        while (node && node.nodeType !== Node.ELEMENT_NODE) {
            node = node.parentNode;
        }
        if (!node)
            return;
        const el = node;
        const blockTags = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
        // Find the nearest block ancestor (or self)
        let block = null;
        let cur = el;
        while (cur && cur.nodeType === Node.ELEMENT_NODE) {
            if (blockTags.has(cur.tagName)) {
                block = cur;
                break;
            }
            cur = cur.parentNode;
        }
        if (!block)
            return;
        // If already this heading, convert back to <p>
        if (block.tagName === this.level.toUpperCase()) {
            const p = document.createElement('p');
            while (block.firstChild)
                p.appendChild(block.firstChild);
            block.replaceWith(p);
        }
        else {
            // Replace block with the heading tag
            const heading = document.createElement(this.level);
            while (block.firstChild)
                heading.appendChild(block.firstChild);
            block.replaceWith(heading);
        }
    }
}
