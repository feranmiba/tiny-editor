/**
 * The main Editor class.
 * Architectural decision: We use a simple class that wraps an HTMLElement
 * and makes it contenteditable. This keeps the core lightweight and
 * relies on native browser APIs.
 */
export class Editor {
    constructor(options) {
        this.commands = new Map();
        this.element = options.element;
        // Initialize contenteditable region
        this.element.setAttribute('contenteditable', 'true');
        this.element.classList.add('tiny-editor-root');
        if (options.initialHTML) {
            this.setHTML(options.initialHTML);
        }
    }
    /**
     * Retrieves the current HTML content of the editor.
     */
    getHTML() {
        return this.element.innerHTML;
    }
    /**
     * Sets the HTML content of the editor.
     */
    setHTML(html) {
        this.element.innerHTML = html;
    }
    /**
     * Focuses the editor element.
     */
    focus() {
        this.element.focus();
    }
    /**
     * Registers a command with the editor.
     */
    registerCommand(command) {
        this.commands.set(command.name, command);
    }
    /**
     * Executes a registered command by name.
     */
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
