import { Command } from '../types';

export class ImageCommand implements Command {
  name = 'image';

  execute(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (!src) return;

        const img = document.createElement('img');
        img.src = src;
        img.alt = file.name;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.marginTop = '0.5rem';
        img.style.marginBottom = '0.5rem';

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.collapse(false);
          range.insertNode(img);

          // Move cursor after the image
          const newRange = document.createRange();
          newRange.setStartAfter(img);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }
}
