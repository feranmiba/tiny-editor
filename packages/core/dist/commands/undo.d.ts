import { Command } from '../types';
/**
 * UndoCommand — lightweight undo using the native browser history.
 * document.execCommand('undo') is the only spec-compliant way to undo
 * in a contenteditable without implementing a full history stack.
 */
export declare class UndoCommand implements Command {
    name: string;
    execute(): void;
}
