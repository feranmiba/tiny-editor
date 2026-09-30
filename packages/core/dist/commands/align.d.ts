import { Command } from '../types';
export type Alignment = 'left' | 'center' | 'right' | 'justify';
/**
 * AlignCommand sets or toggles text-align style of the nearest block element,
 * and also aligns any selected image inside the block.
 */
export declare class AlignCommand implements Command {
    name: string;
    private alignment;
    constructor(alignment: Alignment);
    execute(): void;
}
export declare class AlignLeftCommand extends AlignCommand {
    constructor();
}
export declare class AlignCenterCommand extends AlignCommand {
    constructor();
}
export declare class AlignRightCommand extends AlignCommand {
    constructor();
}
export declare class AlignJustifyCommand extends AlignCommand {
    constructor();
}
