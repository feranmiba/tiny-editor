
export function isInsideTag(tagName: string): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  let node = selection.anchorNode;

  while (node) {
    if (node.nodeType === 1 && (node as HTMLElement).tagName === tagName.toUpperCase()) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}