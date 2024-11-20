// src/content/utils/transcript.ts
import { findElement } from './domUtils';

export const getTranscript = async (): Promise<string | null> => {
  try {
    console.log('[Coursera Copilot] Attempting to extract transcript...');

    // Multiple selectors for transcript container, prioritizing data attributes and role
    const transcriptContainer = await findElement([
      '[data-track-component="interactive_transcript"]',
      '.rc-Transcript[role="presentation"]',
      '.rc-Transcript',
    ]);

    if (!transcriptContainer) {
      console.warn('[Coursera Copilot] Transcript container not found');
      return null;
    }

    // Find all phrase elements using stable selectors
    const phrases = transcriptContainer.querySelectorAll(
      '.rc-Phrase[role="button"] span'
    );

    if (!phrases || phrases.length === 0) {
      console.warn('[Coursera Copilot] No transcript phrases found');
      return null;
    }

    console.log(
      `[Coursera Copilot] Found ${phrases.length} transcript phrases`
    );

    const transcriptText = Array.from(phrases)
      .map(phrase => phrase.textContent?.trim())
      .filter(Boolean)
      .join(' ');

    console.log('[Coursera Copilot] Successfully extracted transcript');
    return transcriptText || null;
  } catch (error) {
    console.error('[Coursera Copilot] Error extracting transcript:', error);
    return null;
  }
};
