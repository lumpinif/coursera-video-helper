<img width="461" alt="image" src="https://github.com/user-attachments/assets/8fea1d83-b701-4660-b170-4e4ea9508f7c">

# A Coursera transcript copy button extension

## Coursera Copilot Chrome Extension

A Chrome extension that enhances the Coursera learning experience by providing additional functionality, starting with a transcript copy feature.

## Features

### Current

- Copy Lecture Transcript: Adds a "Copy" button next to the "Discuss" tab in course lectures to easily copy the entire transcript to clipboard
- Modern UI with Tailwind CSS styling
- Responsive design that matches Coursera's interface

### Planned

-

## Project Structure

```tree
coursera-extension/
├── src/
│   ├── content/              # Content scripts
│   │   ├── components/       # UI components
│   │   └── utils/           # Utility functions
│   ├── background/          # Background scripts
│   └── manifest.json        # Extension manifest
├── public/                  # Static assets
├── dist/                    # Built files
├── webpack.common.js        # Common webpack configuration
├── webpack.dev.js          # Development webpack configuration
├── webpack.prod.js         # Production webpack configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Project dependencies
```

## Technical Stack

- TypeScript for type safety
- React for UI components
- Tailwind CSS for styling
- Webpack for bundling
- ESLint + Prettier for code formatting
- Jest for testing
- PostCSS for CSS processing

## Getting Started

1. Clone the repository

2. Install Bun (if not already installed):

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Build the extension:

   ```bash
   bun run build
   ```

5. Load the extension in Chrome:
   - Open Chrome
   - Go to chrome://extensions/
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

```bash
bun install     # Install dependencies
bun run dev     # Start development mode with watch
bun run build   # Build for production
bun run test    # Run tests
bun run lint    # Run linting
bun run format  # Format code with Prettier
```

## Continuous Integration

This project uses GitHub Actions for CI with Bun. The CI pipeline:

- Runs on every push to main and pull requests
- Installs dependencies with Bun
- Runs build, tests, and linting
- Ensures code quality and functionality

## Best Practices Implementation

- **Performance**:

  - Efficient DOM manipulation
  - Debounced event handlers
  - Minimal re-renders
  - Optimized Tailwind CSS output

- **Code Quality**:

  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for consistent formatting
  - Modular React components

- **Error Handling**:

  - Graceful degradation
  - User-friendly error messages
  - Logging for debugging

- **Maintainability**:

  - Modular code structure
  - Clear documentation
  - Consistent naming conventions
  - Component-based architecture

## Browser Support

- Chrome: Latest version
- Other Chromium-based browsers (Edge, Brave, etc.): Should work but not officially supported

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
