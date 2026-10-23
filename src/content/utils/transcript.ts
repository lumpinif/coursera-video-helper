import { waitForElement } from './domUtils';

const TRANSCRIPT_SELECTOR =
  '[data-track-component="interactive_transcript"], .rc-Transcript';

const cleanText = (text: string) =>
  text
    .replace(/[\u200B\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getTranscriptContainer = (
  scope: ParentNode = document
): Element | null =>
  Array.from(scope.querySelectorAll(TRANSCRIPT_SELECTOR)).find(
    element => !element.closest('[hidden], [aria-hidden="true"]')
  ) ?? null;

export const getTimestamp = (paragraph: Element): string | null => {
  const button = paragraph.querySelector('.timestamp');
  // Exclude the screen-reader instruction before reading the visible time.
  const text = Array.from(button?.childNodes ?? [])
    .filter(node => node.nodeType === 3)
    .map(node => node.textContent)
    .join('');
  return cleanText(text) || null;
};

export const getTranscriptWithTimestamps = (
  scope: ParentNode = document
): string | null => {
  const transcript = getTranscriptContainer(scope);
  if (!transcript) return null;

  const segments = Array.from(transcript.querySelectorAll('.rc-Paragraph'))
    .map(paragraph => {
      const text = cleanText(
        Array.from(paragraph.querySelectorAll('.rc-Phrase'))
          .map(phrase => phrase.textContent ?? '')
          .join(' ')
      );
      if (!text) return null;
      const timestamp = getTimestamp(paragraph);
      return timestamp ? `[video playing at time ${timestamp}]: ${text}` : text;
    })
    .filter(Boolean);

  // A title alone is not a successfully copied transcript.
  if (!segments.length) return null;
  const title = cleanText(
    scope.querySelector('.video-name')?.textContent ?? ''
  );
  return [...(title ? [`# ${title}`] : []), ...segments].join('\n\n');
};

export const playFromFirstCaption = async (): Promise<void> => {
  const url = location.href;
  const video = document.querySelector('video');
  if (!getTranscriptContainer()) {
    const trigger = document.querySelector<HTMLButtonElement>(
      '[data-testid="item-tool-panel-button-transcript"], ' +
        '[data-testid="lecture-transcript-tab"], [role="tab"][id$="-tab-transcript"]'
    );
    if (!trigger) throw new Error('Transcript control not found');
    if (
      trigger.getAttribute('aria-pressed') !== 'true' &&
      trigger.getAttribute('aria-selected') !== 'true'
    ) {
      trigger.click();
    }
  }
  if (!getTranscriptContainer()?.querySelector('.timestamp')) {
    await waitForElement(
      '[data-track-component="interactive_transcript"] .timestamp, .rc-Transcript .timestamp'
    );
  }
  // A delayed load must not start playback in a different lecture.
  if (
    location.href !== url ||
    (video && document.querySelector('video') !== video)
  )
    return;
  const timestamp = getTranscriptContainer()?.querySelector<HTMLButtonElement>(
    '.rc-Paragraph .timestamp'
  );
  if (!timestamp) throw new Error('First caption not available');
  timestamp.click();
};
