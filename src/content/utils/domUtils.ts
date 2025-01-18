export const waitForElement = (
  selector: string,
  timeout = 5000
): Promise<Element | null> => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Timeout
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
};

export const findElement = async (
  selectors: string[]
): Promise<Element | null> => {
  for (const selector of selectors) {
    const element = await waitForElement(selector);
    if (element) {
      console.log('[Coursera Copilot] Found element using the selector');
      return element;
    }
  }
  console.log(
    '[Coursera Copilot] No matching element found for selectors:',
    selectors
  );
  return null;
};
