export const convertHTML = content => {
  if (content) {
    while (content.indexOf('style="') > 0) {
      const startIndex = content.indexOf('style="');
      const endIndex = content.indexOf('"', content.indexOf('style="') + 'style="'.length) + 1;

      const childString = content.slice(startIndex, endIndex);
      content = content.replace(childString, '');
    }

    while (content.indexOf('href="') > 0) {
      const startIndex = content.indexOf('href="');
      const endIndex = content.indexOf('"', content.indexOf('href="') + 'href="'.length) + 1;

      const childString = content.slice(startIndex, endIndex);
      content = content.replace(childString, '');
    }
  }

  return content;
};
