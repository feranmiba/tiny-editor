import { Command } from '../types';

export class StrikethroughCommand implements Command {
  name = 'strikethrough';

  execute(): void {
    document.execCommand('strikeThrough', false);
  }
}
