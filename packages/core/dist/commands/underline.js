export class UnderlineCommand {
    constructor() {
        this.name = 'underline';
    }
    execute() {
        document.execCommand('underline', false);
    }
}
