import { useEffect, useRef, useState } from 'react';
import { getTranscriptWithTimestamps } from '../utils/transcript';

export const CopyTranscriptButton = () => {
  const [status, setStatus] = useState<
    'idle' | 'copying' | 'success' | 'error'
  >('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    clearTimeout(timer.current);
    setStatus('copying');
    try {
      const transcript = getTranscriptWithTimestamps();
      if (!transcript) throw new Error('Transcript not available');
      await navigator.clipboard.writeText(transcript);
      setStatus('success');
      timer.current = setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error(
        '[Coursera Video Helper] Could not copy transcript:',
        error
      );
      setStatus('error');
    }
  };

  return (
    <button
      id="coursera-copilot-button"
      className="cvh-button"
      data-status={status}
      onClick={handleCopy}
      disabled={status === 'copying'}
      type="button"
    >
      <span aria-live="polite">
        {status === 'idle' && 'Copy transcript'}
        {status === 'copying' && 'Copying…'}
        {status === 'success' && 'Copied'}
        {status === 'error' && 'Retry copy'}
      </span>
    </button>
  );
};
