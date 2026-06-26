import { Command } from '../types';

export class SuperscriptCommand implements Command {
  name = 'superscript';

  execute(): void {
    document.execCommand('superscript', false);
  }
}
