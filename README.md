# Coursera Video Helper

A Chrome extension that adds transcript tools to Coursera lectures.
Version 0.3.0 supports the October 2026 course player with its transcript side panel.

## Features

- **Copy transcript**: Open **Transcript**, then select **Copy transcript** below
  the language selector. The copy includes the lecture title, all paragraphs,
  and their timestamps in the selected language.
- **Play from first caption**: Select the button below the lecture title to play
  from the first spoken caption. The extension opens the transcript if needed.
  This preserves the previous **Start from Beginning** behavior, which skips
  any introduction before the first caption.
- **Page navigation**: Controls follow the current lecture and transcript panel.
  Closing a panel or switching to Notes removes the copy button. Opening the
  transcript again restores it. Reading and assignment pages have no video tools.
- **Zen cleanup**: The existing rules in `src/content/config/zenMode.ts` remove
  matching page elements across Coursera. This is a build-time configuration,
  not a settings toggle.

The extension reads the transcript already displayed by Coursera. It does not
send transcript text to another service. Copying requires an available transcript.

## Install or update

Requires Bun, Node.js 20 or later, and a Chromium browser.

```bash
git clone https://github.com/lumpinif/coursera-video-helper.git
cd coursera-video-helper
bun install --frozen-lockfile
bun run build
```

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked** and choose this project's `dist` directory.
4. Open or reload a Coursera lecture.

For an existing installation, rebuild, select **Reload** on the extension card,
and reload the Coursera page. A Git update alone does not update a loaded content
script. No Chrome Web Store release is implied by a repository update.

## Development

```bash
bun run dev        # Rebuild the extension when source files change
bun run build      # Create the production extension in dist/
bun run typecheck  # Check TypeScript
bun test           # Check transcript extraction, playback, and lecture URLs
bun run lint       # Check source code without changing it
bun run format     # Format source files
```

The extension uses React 18, TypeScript, and Webpack. All injected styles are
scoped to the extension controls. The extension does not move Coursera's own
controls or apply a global CSS reset.

## Validation

The automated tests use synthetic text with the observed transcript markup.
They cover timestamps, nested phrase markup, empty and hidden transcripts,
language/content replacement, and lecture-only URL matching. Playback tests cover
delayed captions, opening the panel, and cancellation after a lesson change.

For changes to the host layout, also check the production bundle on a real
Coursera page:

1. Copy a complete transcript and check the title, first and last paragraphs,
   and timestamps. Check keyboard activation and the copy failure/retry state.
2. Close the transcript and select **Play from first caption**.
3. Switch between Transcript, Notes, and Files. Reopen Transcript and check that
   there is one copy button.
4. Switch lectures, visit a reading, and return through browser history.
5. Check the side panel in wide and narrow desktop windows and the bottom sheet
   layout below Coursera's desktop breakpoint.

A browser script injection validates the bundle's page behavior. It does not
validate Chrome's unpacked-extension installation or Web Store distribution.
