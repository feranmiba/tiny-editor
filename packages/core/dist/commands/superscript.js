export class SuperscriptCommand {
    constructor() {
        this.name = 'superscript';
    }
    execute() {
        document.execCommand('superscript', false);
    }
}
