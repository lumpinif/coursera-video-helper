export type ZenModeAttributeSelectorRule = readonly [
  tagName: string,
  attributeExpression: string,
];

/**
 * Example target:
 * <div some-attribute-id="something"></div>
 *
 * Add more rules to remove more DOM nodes.
 * Set to `[]` to disable attribute-based cleanup.
 */
export const ZEN_MODE_ATTRIBUTE_SELECTORS: readonly ZenModeAttributeSelectorRule[] =
  [
    ['div', 'data-testid="acknowledgment-checkpoint"'],
    ['div', 'data-ai-instructions="true"'],
  ];

/**
 * Example target:
 * <div>something not visible and not important</div>
 *
 * Set to an empty string to disable text-based cleanup.
 */
const ZEN_MODE_MESSAGE = `something not visible and not important` as const;

export const ZEN_MODE_TEXT_MATCH = ZEN_MODE_MESSAGE;
