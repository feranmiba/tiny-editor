/**
 * AlignCommand sets or toggles text-align style of the nearest block element,
 * and also aligns any selected image inside the block.
 */
export class AlignCommand {
    constructor(alignment) {
        this.alignment = alignment;
        this.name = `align-${alignment}`;
    }
    execute() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        while (node && node.nodeType !== Node.ELEMENT_NODE) {
            node = node.parentNode;
        }
        if (!node)
            return;
        const blockTags = new Set([
            'P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'TD', 'TH'
        ]);
        let block = null;
        let cur = node;
        while (cur && cur.nodeType === Node.ELEMENT_NODE) {
            const el = cur;
            if (blockTags.has(el.tagName) || el.classList.contains('tiny-editor-root')) {
                block = el;
                break;
            }
            cur = cur.parentNode;
        }
        if (!block)
            return;
        // Check if selection contains or is an image
        let targetImg = null;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node;
            if (el.tagName === 'IMG') {
                targetImg = el;
            }
            else {
                const foundImg = el.querySelector('img');
                if (foundImg) {
                    targetImg = foundImg;
                }
            }
        }
        if (targetImg) {
            targetImg.style.display = 'block';
            if (this.alignment === 'left') {
                targetImg.style.marginLeft = '0';
                targetImg.style.marginRight = 'auto';
                targetImg.style.float = 'none';
            }
            else if (this.alignment === 'center') {
                targetImg.style.marginLeft = 'auto';
                targetImg.style.marginRight = 'auto';
                targetImg.style.float = 'none';
            }
            else if (this.alignment === 'right') {
                targetImg.style.marginLeft = 'auto';
                targetImg.style.marginRight = '0';
                targetImg.style.float = 'none';
            }
        }
        if (block.style.textAlign === this.alignment) {
            block.style.textAlign = '';
        }
        else {
            block.style.textAlign = this.alignment;
        }
    }
}
export class AlignLeftCommand extends AlignCommand {
    constructor() {
        super('left');
    }
}
export class AlignCenterCommand extends AlignCommand {
    constructor() {
        super('center');
    }
}
export class AlignRightCommand extends AlignCommand {
    constructor() {
        super('right');
    }
}
export class AlignJustifyCommand extends AlignCommand {
    constructor() {
        super('justify');
    }
}
