/**
 * Utility helpers for Selection API.
 * Architectural decision: Abstracting Selection and Range APIs provides a
 * consistent interface for commands, handling browser quirks if needed later.
 */
/**
 * The Selection interface represents the range of text selected by the user or the current position of the caret.
 * It provides methods to examine and manipulate the selected text.
 */
export function getSelection() {
    return window.getSelection();
}
/**
 * A Range represents a fragment of a document that can contain nodes and parts of text nodes.
 * It allows you to select and modify a continuous part of the document structure.
 */
export function getRange(selection = getSelection()) {
    if (!selection || selection.rangeCount === 0) {
        return null;
    }
    return selection.getRangeAt(0);
}
/**
 * Checks whether a selection exists in the document.
 */
export function hasSelection() {
    const selection = getSelection();
    return selection !== null && selection.rangeCount > 0;
}
/**
 * Saves the current selection by returning its Range.
 */
export function saveSelection() {
    return getRange();
}
/**
 * Restores a previously saved selection.
 */
export function restoreSelection(range) {
    const selection = getSelection();
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
