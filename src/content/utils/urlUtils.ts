export const isLecturePage = (url: string): boolean => {
  return url.includes('/learn/') && url.includes('/lecture/');
};

export const shouldInitialize = (url: string): boolean => {
  return isLecturePage(url);
};
