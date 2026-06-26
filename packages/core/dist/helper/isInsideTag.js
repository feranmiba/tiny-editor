export function isInsideTag(tagName) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return false;
    let node = selection.anchorNode;
    while (node) {
        if (node.nodeType === 1 && node.tagName === tagName.toUpperCase()) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
