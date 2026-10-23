export const isLecturePage = (url: string): boolean => {
  return /^\/learn\/[^/]+\/lecture\/[^/]+(?:\/|$)/.test(new URL(url).pathname);
};
