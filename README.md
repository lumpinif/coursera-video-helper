# A Coursera transcript copy button extension

![image](https://github.com/user-attachments/assets/8fea1d83-b701-4660-b170-4e4ea9508f7c)

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
├── .github/                # GitHub configuration
├── src/
│   ├── content/           # Content scripts
│   ├── types/            # TypeScript type definitions
│   └── manifest.json     # Extension manifest
├── public/               # Static assets
├── dist/                 # Built files
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── tsconfig.json        # TypeScript configuration
├── webpack.common.js    # Common webpack configuration
├── webpack.dev.js       # Development webpack configuration
├── webpack.prod.js      # Production webpack configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.cjs   # PostCSS configuration
└── package.json         # Project dependencies
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

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/) (for faster package management)
- Google Chrome browser

### Installation Steps

1. Open your terminal and clone the repository:

   ```bash
   git clone https://github.com/lumpinif/coursera-extension.git
   cd coursera-extension
   ```

2. Install Bun (if not already installed):

   ```bash
   # For macOS and Linux:
   curl -fsSL https://bun.sh/install | bash
   
   # For Windows (using PowerShell):
   powershell -c "irm bun.sh/install.ps1|iex"
   ```

3. Install project dependencies:

   ```bash
   bun install
   ```

4. Build the extension:

   ```bash
   bun run build
   ```

### Loading the Extension in Chrome

1. Open Google Chrome
2. Type `chrome://extensions/` in the address bar and press Enter
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" button in the top-left corner
5. Navigate to your project's directory and select the `dist` folder
6. The extension should now appear in your extensions list
7. Pin the extension by clicking the puzzle piece icon in Chrome's toolbar and clicking the pin icon

### Testing the Extension

1. Go to any Coursera lecture page
2. You should see a new "Copy" button next to the "Discuss" tab
3. Click the button to copy the lecture transcript

### Troubleshooting

If the extension doesn't appear:

- Make sure you've built the project (`bun run build`)
- Check if Developer mode is enabled
- Try reloading the extension
- Clear Chrome's cache and restart the browser

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
