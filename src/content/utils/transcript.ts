// src/content/utils/transcript.ts
import { findElement } from './domUtils';

export const getTimestamp = (paragraph: Element): string | null => {
  const timestampButton = paragraph.querySelector('.timestamp');
  if (!timestampButton) return null;

  // Get the last text node which contains just the timestamp
  const lastTextNode = Array.from(timestampButton.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .pop();

  return lastTextNode?.textContent?.trim() || null;
};

export const combineTimestampWithPhrase = (
  timestamp: string | null,
  phrase: string
): string => {
  if (!timestamp) return phrase;
  return `[video playing at time ${timestamp}]: ${phrase}`;
};

export const getLectureTitle = (): string | null => {
  const titleElement = document.querySelector('.video-name');
  return titleElement?.textContent?.trim() || null;
};

export const getTranscriptWithTimestamps = async (): Promise<string | null> => {
  try {
    console.log(
      '[Coursera Copilot] Attempting to extract transcript with timestamps'
    );

    const transcriptContainer = await findElement([
      '[data-track-component="interactive_transcript"]',
      '.rc-Transcript[role="presentation"]',
      '.rc-Transcript',
    ]);

    if (!transcriptContainer) {
      console.error('[Coursera Copilot] Could not find transcript container');
      return null;
    }

    const title = getLectureTitle();

    const paragraphs = transcriptContainer.querySelectorAll('.rc-Paragraph');

    const transcriptSegments = Array.from(paragraphs)
      .map(paragraph => {
        const timestamp = getTimestamp(paragraph);
        const phrases = Array.from(
          paragraph.querySelectorAll('.rc-Phrase span')
        )
          .map(phrase => phrase.textContent?.trim())
          .filter(Boolean)
          .join(' ');

        if (!phrases) return null;
        return combineTimestampWithPhrase(timestamp, phrases);
      })
      .filter(Boolean);

    const transcriptText = [
      title ? `# ${title}` : '',
      ...transcriptSegments,
    ].join('\n\n');

    console.log(
      '[Coursera Copilot] Successfully extracted transcript with timestamps'
    );
    return transcriptText || null;
  } catch (error) {
    console.error('[Coursera Copilot] Error extracting transcript:', error);
    return null;
  }
};
