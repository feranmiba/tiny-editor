export class HighlightCommand {
    constructor() {
        this.name = 'highlight';
    }
    execute() {
        document.execCommand('backColor', false, 'yellow');
    }
}
