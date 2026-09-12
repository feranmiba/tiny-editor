/**
 * UndoCommand — lightweight undo using the native browser history.
 * document.execCommand('undo') is the only spec-compliant way to undo
 * in a contenteditable without implementing a full history stack.
 */
export class UndoCommand {
    constructor() {
        this.name = 'undo';
    }
    execute() {
        document.execCommand('undo', false);
    }
}
