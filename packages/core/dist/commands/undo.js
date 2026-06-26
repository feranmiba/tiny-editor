export class UndoCommand {
    constructor() {
        this.name = 'undo';
    }
    execute() {
        document.execCommand('undo', false);
    }
}
