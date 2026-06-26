
export function getSelection(): Selection | null {
  return window.getSelection();
}


export function getRange(selection: Selection | null = getSelection()): Range | null {
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  return selection.getRangeAt(0);
}


export function hasSelection(): boolean {
  const selection = getSelection();
  return selection !== null && selection.rangeCount > 0;
}

export function saveSelection(): Range | null {
  return getRange();
}


export function restoreSelection(range: Range): void {
  const selection = getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
