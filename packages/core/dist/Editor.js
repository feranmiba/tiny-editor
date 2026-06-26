/**
 * The main Editor class.
 */
export class Editor {
    constructor(options) {
        this.commands = new Map();
        this.element = options.element;
        this.element.setAttribute('contenteditable', 'true');
        this.element.classList.add('tiny-editor-root');
        if (options.initialHTML) {
            this.setHTML(options.initialHTML);
        }
    }
    getHTML() {
        return this.element.innerHTML;
    }
    setHTML(html) {
        this.element.innerHTML = html;
    }
    focus() {
        this.element.focus();
    }
    registerCommand(command) {
        this.commands.set(command.name, command);
    }
    exec(commandName) {
        const command = this.commands.get(commandName);
        if (command) {
            command.execute();
            this.focus();
        }
        else {
            console.warn(`Command "${commandName}" is not registered.`);
        }
    }
}
