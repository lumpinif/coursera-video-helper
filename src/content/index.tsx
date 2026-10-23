import { createRoot, type Root } from 'react-dom/client';
import { AutoSeekToTranscript } from './components/AutoSeekToTranscript';
import { CopyTranscriptButton } from './components/CopyTranscriptButton';
import { startZenModeCleanup } from './utils/domUtils';
import { getTranscriptContainer } from './utils/transcript';
import { isLecturePage } from './utils/urlUtils';
import './styles.css';

type MountedControl = { container: HTMLElement; root: Root };
let copyControl: MountedControl | undefined;
let seekControl: MountedControl | undefined;
let lectureUrl = '';

const unmount = (control: MountedControl | undefined) => {
  control?.root.unmount();
  control?.container.remove();
};

const createControl = (id: string): MountedControl => {
  const container = document.createElement('div');
  container.id = id;
  container.className = 'cvh-control';
  return { container, root: createRoot(container) };
};

const syncControls = () => {
  // Coursera replaces panel contents without a document navigation.
  if (lectureUrl !== location.href) {
    unmount(copyControl);
    unmount(seekControl);
    copyControl = seekControl = undefined;
    lectureUrl = location.href;
  }
  if (!isLecturePage(lectureUrl)) return;

  const title = document.querySelector(
    '[data-testid="video-item-title-and-attribution"]'
  );
  if (seekControl && seekControl.container.parentElement !== title) {
    unmount(seekControl);
    seekControl = undefined;
  }
  if (title && !seekControl) {
    seekControl = createControl('auto-seek-button-container');
    title.appendChild(seekControl.container);
    seekControl.root.render(<AutoSeekToTranscript />);
  }

  const transcript = getTranscriptContainer();
  const panel = transcript?.closest(
    '[data-testid="item-tool-panel-layout-tool-content-panel-content"]'
  );
  // Do not move Coursera's controls. Older players use an inline transcript.
  const heading = panel?.querySelector('h2');
  const copyHost =
    heading?.parentElement?.parentElement ?? transcript?.parentElement;
  if (
    copyControl &&
    (!copyControl.container.isConnected ||
      copyControl.container.parentElement !== copyHost)
  ) {
    unmount(copyControl);
    copyControl = undefined;
  }
  if (copyHost && !copyControl) {
    copyControl = createControl('transcript-copy-button-container');
    if (heading) {
      copyHost.appendChild(copyControl.container);
    } else {
      copyHost.insertBefore(copyControl.container, transcript ?? null);
    }
    copyControl.root.render(<CopyTranscriptButton />);
  }
};

const init = () => {
  startZenModeCleanup();
  syncControls();
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      syncControls();
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-selected', 'aria-pressed', 'aria-hidden', 'hidden'],
  });
  window.addEventListener('popstate', syncControls);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
