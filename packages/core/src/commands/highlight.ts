import { Command } from '../types';

export class HighlightCommand implements Command {
  name = 'highlight';

  execute(): void {
    document.execCommand('backColor', false, 'yellow');
  }
}
