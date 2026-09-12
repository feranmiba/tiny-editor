import { EditorOptions, Command } from './types';
export declare class Editor {
    private element;
    private commands;
    constructor(options: EditorOptions);
    /**
     * Intercepts Enter inside any inline formatting tag.
     * Instead of letting the browser duplicate the inline tag into the new line,
     * we prevent default and manually insert a fresh, clean block element.
     */
    private handleKeyDown;
    getHTML(): string;
    setHTML(html: string): void;
    focus(): void;
    registerCommand(command: Command): void;
    exec(commandName: string): void;
}
