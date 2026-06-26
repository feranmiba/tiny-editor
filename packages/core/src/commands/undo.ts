import { Command } from '../types';

export class UndoCommand implements Command {
  name = 'undo';

  execute(): void {
    document.execCommand('undo', false);
  }
}
