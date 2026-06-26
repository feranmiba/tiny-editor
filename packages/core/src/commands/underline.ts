import { Command } from '../types';

export class UnderlineCommand implements Command {
  name = 'underline';

  execute(): void {
    document.execCommand('underline', false);
  }
}
