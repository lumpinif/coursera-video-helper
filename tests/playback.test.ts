import { afterEach, beforeEach, expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import { playFromFirstCaption } from '../src/content/utils/transcript';

let window: Window;
const globals = ['document', 'location', 'MutationObserver'] as const;
const original = new Map(
  globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)])
);

beforeEach(() => {
  window = new Window({
    url: 'https://www.coursera.org/learn/example/lecture/one',
  });
  for (const key of globals) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: window[key],
    });
  }
});

afterEach(async () => {
  await window.happyDOM.close();
  for (const key of globals) {
    const descriptor = original.get(key);
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

test('waits for captions when the transcript panel is already open but still loading', async () => {
  window.document.body.innerHTML =
    '<video></video><div class="rc-Transcript"></div>';
  let clicks = 0;
  const playback = playFromFirstCaption();
  const paragraph = window.document.createElement('div');
  paragraph.className = 'rc-Paragraph';
  paragraph.innerHTML = '<button class="timestamp">0:10</button>';
  paragraph.querySelector('button')!.addEventListener('click', () => clicks++);
  window.document.querySelector('.rc-Transcript')!.appendChild(paragraph);
  await playback;
  expect(clicks).toBe(1);
});

test('opens a closed transcript and uses the native first-caption action', async () => {
  window.document.body.innerHTML =
    '<video></video><button data-testid="item-tool-panel-button-transcript" aria-pressed="false">Transcript</button>';
  const trigger = window.document.querySelector('button')!;
  let clicks = 0;
  trigger.addEventListener('click', () => {
    trigger.setAttribute('aria-pressed', 'true');
    window.document.body.insertAdjacentHTML(
      'beforeend',
      '<div class="rc-Transcript"><div class="rc-Paragraph"><button class="timestamp">0:10</button></div></div>'
    );
    window.document
      .querySelector('.timestamp')!
      .addEventListener('click', () => clicks++);
  });
  await playFromFirstCaption();
  expect(trigger.getAttribute('aria-pressed')).toBe('true');
  expect(clicks).toBe(1);
});

test('does not start another lecture when navigation occurs during caption loading', async () => {
  window.document.body.innerHTML =
    '<video></video><div class="rc-Transcript"></div>';
  let clicks = 0;
  const playback = playFromFirstCaption();
  window.history.pushState({}, '', '/learn/example/lecture/two');
  window.document.body.innerHTML =
    '<video></video><div class="rc-Transcript"><div class="rc-Paragraph"><button class="timestamp">0:05</button></div></div>';
  window.document
    .querySelector('.timestamp')!
    .addEventListener('click', () => clicks++);
  await playback;
  expect(clicks).toBe(0);
});

test('reports an unavailable transcript instead of reporting playback success', async () => {
  window.document.body.innerHTML = '<video></video>';
  await expect(playFromFirstCaption()).rejects.toThrow(
    'Transcript control not found'
  );
});
