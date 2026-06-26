import { EditorOptions, Command } from './types';
/**
 * The main Editor class.
 */
export declare class Editor {
    private element;
    private commands;
    constructor(options: EditorOptions);
    getHTML(): string;
    setHTML(html: string): void;
    focus(): void;
    registerCommand(command: Command): void;
    exec(commandName: string): void;
}
