import UrlUtils from './UrlUtils';

const onShouldStartLoadWithRequest = event => {
  const url = event?.url;
  if (!url) {
    return false;
  }

  const isValidUrl = url.includes('://');
  if (isValidUrl) {
    UrlUtils.openUrl(url);
    return false;
  }
  return true;
};

export {onShouldStartLoadWithRequest};
