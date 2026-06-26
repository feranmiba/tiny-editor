import { EditorOptions, Command } from './types';
/**
 * The main Editor class.
 * Architectural decision: We use a simple class that wraps an HTMLElement
 * and makes it contenteditable. This keeps the core lightweight and
 * relies on native browser APIs.
 */
export declare class Editor {
    private element;
    private commands;
    constructor(options: EditorOptions);
    /**
     * Retrieves the current HTML content of the editor.
     */
    getHTML(): string;
    /**
     * Sets the HTML content of the editor.
     */
    setHTML(html: string): void;
    /**
     * Focuses the editor element.
     */
    focus(): void;
    /**
     * Registers a command with the editor.
     */
    registerCommand(command: Command): void;
    /**
     * Executes a registered command by name.
     */
    exec(commandName: string): void;
}
