import React, { useState } from 'react';
import { getTranscript } from '../utils/transcript';

export const CopyTranscriptButton: React.FC = () => {
  const [status, setStatus] = useState<
    'idle' | 'copying' | 'success' | 'error'
  >('idle');

  const handleCopy = async () => {
    try {
      setStatus('copying');
      const transcript = await getTranscript();

      if (!transcript) {
        throw new Error('No transcript found');
      }

      await navigator.clipboard.writeText(transcript);
      setStatus('success');

      // Reset status after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy transcript:', error);
      setStatus('error');

      // Reset status after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'copying':
        return 'Copying...';
      case 'success':
        return 'Copied ✅';
      case 'error':
        return 'Failed to copy';
      default:
        return 'Copy Transcript';
    }
  };

  return (
    <button
    className={`inline-flex items-center justify-center min-h-[48px] min-w-[44px] w-[140px] font-[var(--cds-font-weight-600)] text-sm px-3 py-3 mb-1 mr-6 transition-colors duration-200 ease-in-out outline-none focus:outline-none
      ${status === 'idle' ? 'bg-transparent text-[var(--cds-color-neutral-primary)] hover:text-[var(--cds-color-interactive-primary-hover)] hover:bg-[var(--cds-color-interactive-background-primary-hover-weak)]' : ''}
      ${status === 'copying' ? 'bg-transparent text-[var(--cds-color-neutral-disabled)] cursor-not-allowed' : ''}
      ${status === 'success' ? 'bg-transparent text-[var(--cds-color-feedback-success)]' : ''}
      ${status === 'error' ? 'bg-transparent text-[var(--cds-color-feedback-error)]' : ''}`}
      onClick={handleCopy}
      disabled={status === 'copying'}
    >
      {getButtonText()}
    </button>
  );
};
