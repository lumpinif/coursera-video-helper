import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CopyTranscriptButton } from './components/CopyTranscriptButton';
import { findElement } from './utils/domUtils';
import './styles.css';

const TABLIST_SELECTORS = [
  '[role="tablist"][aria-label="Related lecture content tabs"]',
  'div[role="tablist"]',
  '[aria-label="Related lecture content tabs"][role="tablist"]',
];

const App = () => {
  const [isTranscriptSelected, setIsTranscriptSelected] = useState(false);

  useEffect(() => {
    const checkTranscriptTab = () => {
      const transcriptTab = document.querySelector('[id*="tab-TRANSCRIPT"]');
      setIsTranscriptSelected(
        transcriptTab?.getAttribute('aria-selected') === 'true'
      );
    };

    // Initial check
    checkTranscriptTab();

    // Create observer to watch for changes
    const observer = new MutationObserver(checkTranscriptTab);
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['aria-selected'],
    });

    return () => observer.disconnect();
  }, []);

  return isTranscriptSelected ? <CopyTranscriptButton /> : null;
};

const init = async () => {
  console.log('[Coursera Copilot] Initializing extension...');

  const tablist = await findElement(TABLIST_SELECTORS);

  if (tablist) {
    console.log('[Coursera Copilot] Found tablist, injecting button...');
    const container = document.createElement('div');
    container.id = 'coursera-copilot-container';
    // Insert at the beginning of the tablist
    tablist.appendChild(container);

    const root = createRoot(container);
    root.render(<App />);
    console.log('[Coursera Copilot] Button injected successfully');
  } else {
    console.warn('[Coursera Copilot] Could not find tablist');
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log(
    '[Coursera Copilot] Document loading, waiting for DOMContentLoaded...'
  );
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  console.log('[Coursera Copilot] Document already loaded, initializing...');
  init();
}

// Re-initialize on URL changes (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    console.log('[Coursera Copilot] URL changed, reinitializing...');
    lastUrl = url;
    init();
  }
}).observe(document, { subtree: true, childList: true });
