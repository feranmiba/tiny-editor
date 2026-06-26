# Contributing to Tiny Editor

First off, thank you for considering contributing to Tiny Editor! It's people like you that make Tiny Editor a great tool.

## Setting up your Development Environment

1. **Fork & Clone** the repository.
2. **Install dependencies** at the root of the workspace:
   ```bash
   npm install
   ```
3. **Start the Playground** to instantly see your changes:
   ```bash
   npm run dev
   ```
4. As you make changes in `packages/core/src`, they will automatically reflect in the Vite-powered playground.

## Project Architecture

- **`Editor.ts`**: The main class that wraps the DOM element and provides the `exec()` method and command registry.
- **Commands**: Each formatting action is its own class implementing the `Command` interface. Commands are located in `packages/core/src/commands/`.
- **Helpers**: Shared utility functions, such as DOM traversal or tag unwrapping, are stored in `packages/core/src/helper/`.

## Adding a New Command

1. Create a new file in `packages/core/src/commands/` (e.g., `blockquote.ts`).
2. Implement the `Command` interface:
   ```typescript
   import { Command } from '../types';

   export class BlockquoteCommand implements Command {
     name = 'blockquote';

     execute(): void {
       // Your logic using document.execCommand or custom DOM manipulation
     }
   }
   ```
3. Export your new command in `packages/core/src/index.ts`.
4. Register and wire up your command in `packages/playground/main.ts` so it can be tested manually.
5. Add a button for it in `packages/playground/index.html`.

## Submitting a Pull Request

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
2. Ensure the core package builds successfully:
   ```bash
   cd packages/core
   npm run build
   ```
3. Commit your changes with descriptive messages.
4. Push to your fork and submit a Pull Request against the `main` branch.

We look forward to reviewing your contributions!
