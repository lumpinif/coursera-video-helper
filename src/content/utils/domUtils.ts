import {
  ZEN_MODE_ATTRIBUTE_SELECTORS,
  ZEN_MODE_TEXT_MATCH,
  type ZenModeAttributeSelectorRule,
} from '../config/zenMode';

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

let zenModeObserver: MutationObserver | null = null;
let isZenModeCleanupScheduled = false;

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const hasZenModeRules = (): boolean =>
  Boolean(
    ZEN_MODE_ATTRIBUTE_SELECTORS.length > 0 || normalizeText(ZEN_MODE_TEXT_MATCH)
  );

const formatAttributeSelector = (attributeExpression: string): string => {
  const trimmedExpression = attributeExpression.trim();

  if (!trimmedExpression) {
    return '';
  }

  if (
    trimmedExpression.startsWith('[') &&
    trimmedExpression.endsWith(']')
  ) {
    return trimmedExpression;
  }

  const [attributeName, ...attributeValueParts] =
    trimmedExpression.split('=');
  const normalizedAttributeName = attributeName?.trim();

  if (!normalizedAttributeName) {
    return '';
  }

  if (attributeValueParts.length === 0) {
    return `[${normalizedAttributeName}]`;
  }

  const rawAttributeValue = attributeValueParts.join('=').trim();
  const isQuotedAttributeValue = /^["'].+["']$/.test(rawAttributeValue);
  const normalizedAttributeValue = isQuotedAttributeValue
    ? rawAttributeValue
    : `"${rawAttributeValue}"`;

  return `[${normalizedAttributeName}=${normalizedAttributeValue}]`;
};

const buildZenModeSelector = (
  selectorParts: ZenModeAttributeSelectorRule
): string | null => {
  const [tagName, attributeExpression] = selectorParts;
  const normalizedTagName = tagName.trim();
  const normalizedAttributeSelector =
    formatAttributeSelector(attributeExpression);

  if (!normalizedTagName || !normalizedAttributeSelector) {
    return null;
  }

  return `${normalizedTagName}${normalizedAttributeSelector}`;
};

const findElementsByText = (
  textToMatch: string,
  preferredTagName?: string
): Element[] => {
  const selector = preferredTagName?.trim() || 'body *';
  const candidates = Array.from(document.querySelectorAll(selector)).filter(
    element => normalizeText(element.textContent || '') === textToMatch
  );

  return candidates.filter(
    element =>
      !candidates.some(otherElement => {
        return otherElement !== element && element.contains(otherElement);
      })
  );
};

const applyZenModeCleanup = (): void => {
  if (!hasZenModeRules()) {
    return;
  }

  const elementsToRemove = new Set<Element>();

  ZEN_MODE_ATTRIBUTE_SELECTORS.map(buildZenModeSelector)
    .filter((selector): selector is string => Boolean(selector))
    .forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        elementsToRemove.add(element);
      });
    });

  const normalizedTextToMatch = normalizeText(ZEN_MODE_TEXT_MATCH);
  if (normalizedTextToMatch) {
    const preferredTagName = ZEN_MODE_ATTRIBUTE_SELECTORS[0]?.[0];

    findElementsByText(normalizedTextToMatch, preferredTagName).forEach(
      element => {
        elementsToRemove.add(element);
      }
    );
  }

  elementsToRemove.forEach(element => {
    element.remove();
  });

  if (elementsToRemove.size > 0) {
    console.log(
      `[Coursera Copilot] Zen mode removed ${elementsToRemove.size} element(s)`
    );
  }
};

export const startZenModeCleanup = (): void => {
  if (!document.body || !hasZenModeRules()) {
    return;
  }

  applyZenModeCleanup();

  if (zenModeObserver) {
    return;
  }

  zenModeObserver = new MutationObserver(() => {
    if (isZenModeCleanupScheduled) {
      return;
    }

    isZenModeCleanupScheduled = true;
    requestAnimationFrame(() => {
      isZenModeCleanupScheduled = false;
      applyZenModeCleanup();
    });
  });

  zenModeObserver.observe(document.body, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
};
