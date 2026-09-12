import { Command } from '../types';

type HeadingLevel = 'h1' | 'h2' | 'h3';

/**
 * HeadingCommand wraps/unwraps the current block as a heading.
 * Pass a level ('h1', 'h2', 'h3') to the constructor.
 */
export class HeadingCommand implements Command {
  name: string;
  private level: HeadingLevel;

  constructor(level: HeadingLevel = 'h2') {
    this.level = level;
    this.name = `heading-${level}`;
  }

  execute(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;

    // Walk up to find the nearest block element
    while (node && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }
    if (!node) return;

    const el = node as HTMLElement;
    const blockTags = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

    // Find the nearest block ancestor (or self)
    let block: HTMLElement | null = null;
    let cur: Node | null = el;
    while (cur && cur.nodeType === Node.ELEMENT_NODE) {
      if (blockTags.has((cur as HTMLElement).tagName)) {
        block = cur as HTMLElement;
        break;
      }
      cur = cur.parentNode;
    }

    if (!block) return;

    // If already this heading, convert back to <p>
    if (block.tagName === this.level.toUpperCase()) {
      const p = document.createElement('p');
      while (block.firstChild) p.appendChild(block.firstChild);
      block.replaceWith(p);
    } else {
      // Replace block with the heading tag
      const heading = document.createElement(this.level);
      while (block.firstChild) heading.appendChild(block.firstChild);
      block.replaceWith(heading);
    }
  }
}
