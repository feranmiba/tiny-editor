import {
  Editor,
  BoldCommand,
  ItalicCommand,
  UnderlineCommand,
  StrikethroughCommand,
  CodeCommand,
  HighlightCommand,
  SuperscriptCommand,
  UndoCommand
} from '../core/src/index';

const editorElement = document.getElementById('editor-container');

if (editorElement) {
  // Initialize the editor here
  const editor = new Editor({
    element: editorElement,
    initialHTML: '<p>Hello <b>Tiny Editor</b>!</p>'
  });

  // Register new commands
  editor.registerCommand(new UndoCommand());
  editor.registerCommand(new BoldCommand());
  editor.registerCommand(new ItalicCommand());
  editor.registerCommand(new UnderlineCommand());
  editor.registerCommand(new StrikethroughCommand());
  editor.registerCommand(new CodeCommand());
  editor.registerCommand(new HighlightCommand());
  editor.registerCommand(new SuperscriptCommand());

  // This is to connect the button in other to test locally 
  const setupButton = (id: string, commandName: string) => {
    const btn = document.getElementById(id);
    btn?.addEventListener('click', () => {
      editor.exec(commandName);
    });
  };

  setupButton('btn-undo', 'undo');
  setupButton('btn-bold', 'bold');
  setupButton('btn-italic', 'italic');
  setupButton('btn-underline', 'underline');
  setupButton('btn-strikethrough', 'strikethrough');
  setupButton('btn-code', 'code');
  setupButton('btn-highlight', 'highlight');
  setupButton('btn-superscript', 'superscript');
}
