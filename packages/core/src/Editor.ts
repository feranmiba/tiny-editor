import { EditorOptions, Command } from './types';

/**
 * The main Editor class.
 */
export class Editor {
  private element: HTMLElement;
  private commands: Map<string, Command> = new Map();

  constructor(options: EditorOptions) {
    this.element = options.element;
    
    this.element.setAttribute('contenteditable', 'true');
    this.element.classList.add('tiny-editor-root');
    
    if (options.initialHTML) {
      this.setHTML(options.initialHTML);
    }
  }


  public getHTML(): string {
    return this.element.innerHTML;
  }

  public setHTML(html: string): void {
    this.element.innerHTML = html;
  }

  public focus(): void {
    this.element.focus();
  }

  public registerCommand(command: Command): void {
    this.commands.set(command.name, command);
  }

 
  public exec(commandName: string): void {
    const command = this.commands.get(commandName);
    if (command) {
      command.execute();
      this.focus();
    } else {
      console.warn(`Command "${commandName}" is not registered.`);
    }
  }
}
