export interface EditorOptions {
  element: HTMLElement;
  initialHTML?: string;
}

export interface Command {
  name: string;
  execute(): void;
}
