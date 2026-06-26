import { Command } from '../types';
export declare class UndoCommand implements Command {
    name: string;
    execute(): void;
}
