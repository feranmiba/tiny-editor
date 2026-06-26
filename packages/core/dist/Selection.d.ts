/**
 * Utility helpers for Selection API.
 * Architectural decision: Abstracting Selection and Range APIs provides a
 * consistent interface for commands, handling browser quirks if needed later.
 */
/**
 * The Selection interface represents the range of text selected by the user or the current position of the caret.
 * It provides methods to examine and manipulate the selected text.
 */
export declare function getSelection(): Selection | null;
/**
 * A Range represents a fragment of a document that can contain nodes and parts of text nodes.
 * It allows you to select and modify a continuous part of the document structure.
 */
export declare function getRange(selection?: Selection | null): Range | null;
/**
 * Checks whether a selection exists in the document.
 */
export declare function hasSelection(): boolean;
/**
 * Saves the current selection by returning its Range.
 */
export declare function saveSelection(): Range | null;
/**
 * Restores a previously saved selection.
 */
export declare function restoreSelection(range: Range): void;
