export class StrikethroughCommand {
    constructor() {
        this.name = 'strikethrough';
    }
    execute() {
        document.execCommand('strikeThrough', false);
    }
}
