export function unwrapTag(tagName: string): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  let node = selection.anchorNode;

  while (node) {
    if (node.nodeType === 1 && (node as HTMLElement).tagName === tagName.toUpperCase()) {
      const parent = node.parentNode;
      if (parent) {
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
      }
      return;
    }
    node = node.parentNode;
  }
}
