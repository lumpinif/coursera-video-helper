import React, { useState } from 'react';
import { findElement } from '../utils/domUtils';

export const AutoSeekToTranscript: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'seeking' | 'error'>('idle');

  const handleSeekToStart = async () => {
    try {
      setStatus('seeking');
      const transcriptContainer = await findElement([
        '[data-track-component="interactive_transcript"]',
        '.rc-Transcript[role="presentation"]',
        '.rc-Transcript',
      ]);

      if (!transcriptContainer) {
        throw new Error('Transcript container not found');
      }

      const firstParagraph = transcriptContainer.querySelector('.rc-Paragraph');
      if (!firstParagraph) {
        throw new Error('First paragraph not found');
      }

      const timestampButton =
        firstParagraph.querySelector<HTMLButtonElement>('.timestamp');
      if (!timestampButton) {
        throw new Error('Timestamp button not found');
      }

      timestampButton.click();
      setStatus('idle');
    } catch (error) {
      console.error('[AutoSeek] Error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <button
      className={`cds-105 cds-button-disableElevation cds-button-ghost css-l0otf2 min-h-[48px] overflow-visible text-left align-middle px-2 py-3 opacity-100 font-[var(--cds-font-weight-600)] tracking-[var(--cds-letter-spacing-100)] whitespace-normal outline-none focus:outline-none focus:ring-0 transition-colors duration-200 ease-out rounded
        ${status === 'idle' ? 'text-[var(--cds-color-interactive-primary-hover)] hover:underline hover:bg-[var(--cds-color-interactive-background-primary-hover-weak)]' : ''}
        ${status === 'seeking' ? 'text-[var(--cds-color-neutral-disabled)] cursor-not-allowed' : ''}
        ${status === 'error' ? 'text-[var(--cds-color-feedback-error)]' : ''}`}
      onClick={handleSeekToStart}
      disabled={status === 'seeking'}
      type="button"
    >
      <span className="cds-button-label text-nowrap flex items-center gap-x-1">
        <span className="cds-button-startIcon">
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="16"
            viewBox="0 0 20 20"
            width="16"
            className="css-0"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z"
              fill="currentColor"
            />
            <path
              d="M10 6V10L13 12"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {status === 'idle' && 'Start from Beginning'}
        {status === 'seeking' && 'Seeking...'}
        {status === 'error' && 'Failed to seek'}
      </span>
    </button>
  );
};
