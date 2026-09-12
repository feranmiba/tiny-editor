import { Command } from '../types';
type HeadingLevel = 'h1' | 'h2' | 'h3';
/**
 * HeadingCommand wraps/unwraps the current block as a heading.
 * Pass a level ('h1', 'h2', 'h3') to the constructor.
 */
export declare class HeadingCommand implements Command {
    name: string;
    private level;
    constructor(level?: HeadingLevel);
    execute(): void;
}
export {};
