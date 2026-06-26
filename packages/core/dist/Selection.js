export function getSelection() {
    return window.getSelection();
}
export function getRange(selection = getSelection()) {
    if (!selection || selection.rangeCount === 0) {
        return null;
    }
    return selection.getRangeAt(0);
}
export function hasSelection() {
    const selection = getSelection();
    return selection !== null && selection.rangeCount > 0;
}
export function saveSelection() {
    return getRange();
}
export function restoreSelection(range) {
    const selection = getSelection();
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
