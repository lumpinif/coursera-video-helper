import { afterEach, expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import { getTranscriptWithTimestamps } from '../src/content/utils/transcript';
import { isLecturePage } from '../src/content/utils/urlUtils';

const windows: Window[] = [];
const readTranscript = (html: string) => {
  const window = new Window();
  windows.push(window);
  window.document.body.innerHTML = html;
  return getTranscriptWithTimestamps(window.document as unknown as Document);
};
afterEach(async () => {
  await Promise.all(windows.splice(0).map(window => window.happyDOM.close()));
});

// Structural fixture from the October 2026 player, with synthetic lesson text.
const transcript = `
  <div data-track-component="interactive_transcript" class="rc-Transcript">
    <div class="rc-Paragraph">
      <button class="timestamp"><span class="sr-only">Play video starting at ::10 and follow transcript</span>0:10</button>
      <div class="phrases">
        <span class="rc-Phrase" role="button"><span aria-hidden="true">\u200BFirst <em>example</em>.&nbsp;</span></span>
        <span class="rc-Phrase" role="button"><span aria-hidden="true">\u200BCompare two algorithms.&nbsp;</span></span>
      </div>
    </div>
    <div class="rc-Paragraph">
      <button class="timestamp"><span class="sr-only">Play video starting at :2:4 and follow transcript</span>2:04</button>
      <span class="rc-Phrase"><span aria-hidden="true">A second example.</span></span>
    </div>
  </div>`;

test('copies the title, every paragraph, and visible timestamps exactly once', () => {
  expect(
    readTranscript(`<h1 class="video-name">Example lesson</h1>${transcript}`)
  ).toBe(
    '# Example lesson\n\n[video playing at time 0:10]: First example. Compare two algorithms.' +
      '\n\n[video playing at time 2:04]: A second example.'
  );
});

test('does not report an empty or still-loading transcript as a successful copy', () => {
  expect(
    readTranscript(
      '<h1 class="video-name">Example</h1><div class="rc-Transcript"></div>'
    )
  ).toBeNull();
  expect(readTranscript('<h1 class="video-name">Example</h1>')).toBeNull();
});

test('ignores hidden panels and uses the currently visible transcript', () => {
  expect(
    readTranscript(
      `<div hidden>${transcript}</div><div class="rc-Transcript"><div class="rc-Paragraph"><span class="rc-Phrase">Current language.</span></div></div>`
    )
  ).toBe('Current language.');
  expect(
    readTranscript(`<div aria-hidden="true">${transcript}</div>`)
  ).toBeNull();
});

test('keeps content when a title or timestamp is unavailable', () => {
  expect(
    readTranscript(
      '<div class="rc-Transcript"><div class="rc-Paragraph"><span class="rc-Phrase">Content without a timestamp.</span></div></div>'
    )
  ).toBe('Content without a timestamp.');
});

test('reads new language and lesson content on each copy', () => {
  const window = new Window();
  windows.push(window);
  window.document.body.innerHTML = `<h1 class="video-name">First lesson</h1>${transcript}`;
  const document = window.document as unknown as Document;
  expect(getTranscriptWithTimestamps(document)).toStartWith('# First lesson');
  window.document.body.innerHTML =
    '<h1 class="video-name">第二课</h1><div class="rc-Transcript"><div class="rc-Paragraph"><button class="timestamp">1:02:03</button><span class="rc-Phrase">比较算法。</span></div></div>';
  expect(getTranscriptWithTimestamps(document)).toBe(
    '# 第二课\n\n[video playing at time 1:02:03]: 比较算法。'
  );
});

test('only enables lecture controls on lecture paths, not reading or assignment URLs', () => {
  expect(
    isLecturePage('https://www.coursera.org/learn/example/lecture/abc/lesson')
  ).toBe(true);
  expect(
    isLecturePage(
      'https://www.coursera.org/learn/example/supplement/abc?next=/lecture/abc'
    )
  ).toBe(false);
  expect(
    isLecturePage(
      'https://www.coursera.org/learn/example/assignment-submission/abc'
    )
  ).toBe(false);
});
