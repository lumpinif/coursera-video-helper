import { useState } from 'react';
import { playFromFirstCaption } from '../utils/transcript';

export const AutoSeekToTranscript = () => {
  const [status, setStatus] = useState<'idle' | 'seeking' | 'error'>('idle');

  const handleSeek = async () => {
    setStatus('seeking');
    try {
      await playFromFirstCaption();
      setStatus('idle');
    } catch (error) {
      console.error('[Coursera Video Helper] Could not start lecture:', error);
      setStatus('error');
    }
  };

  return (
    <button
      className="cvh-button"
      data-status={status}
      onClick={handleSeek}
      disabled={status === 'seeking'}
      type="button"
    >
      <span aria-live="polite">
        {status === 'idle' && 'Play from first caption'}
        {status === 'seeking' && 'Opening transcript…'}
        {status === 'error' && 'Retry first caption'}
      </span>
    </button>
  );
};
