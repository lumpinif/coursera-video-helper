# Coursera Copilot Chrome Extension

A Chrome extension that enhances the Coursera learning experience by providing additional functionality, starting with a transcript copy feature.

## Features

### Current

- Copy Lecture Transcript: Adds a "Copy" button next to the "Discuss" tab in course lectures to easily copy the entire transcript to clipboard

### Planned

- [Future features to be added]

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
└── package.json            # Project dependencies
```

## Technical Stack

- TypeScript for type safety
- React for UI components
- Webpack for bundling
- ESLint + Prettier for code formatting
- Jest for testing

## Development Plan

### Phase 1: Initial Setup and Copy Transcript Feature

1. Project scaffolding
   - Initialize package.json
   - Setup TypeScript configuration
   - Configure build tools (Webpack)
   - Setup linting and formatting

2. Core Extension Setup
   - Create manifest.json
   - Setup content script injection
   - Implement URL matching patterns

3. Transcript Copy Feature
   - Implement DOM manipulation to add Copy button
   - Create transcript extraction logic
   - Handle clipboard operations
   - Add loading states and error handling

4. Testing & Documentation
   - Add unit tests
   - Document code
   - Add usage instructions

### Best Practices Implementation

- **Performance**:
  - Efficient DOM manipulation
  - Debounced event handlers
  - Minimal re-renders

- **Code Quality**:
  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for consistent formatting

- **Error Handling**:
  - Graceful degradation
  - User-friendly error messages
  - Logging for debugging

- **Maintainability**:
  - Modular code structure
  - Clear documentation
  - Consistent naming conventions

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome
   - Go to chrome://extensions/
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

```bash
npm run dev # Start development mode
npm run build # Build for production
npm run test # Run tests
npm run lint # Run linting
```
