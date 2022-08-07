import URL from 'url';

export const encodeVNPayUrl = vnpayUrl => {
  const httpsUrl = vnpayUrl?.replace('http://', 'https://');
  const obj = URL.parse(httpsUrl, true);

  const queryPath = [];
  for (const queryKey in obj.query) {
    const encodeValue = encodeURI(obj.query[queryKey]);
    queryPath.push(`${queryKey}=${encodeValue}`);
  }

  const output = ''.concat(
    obj.protocol, //https
    '//',
    obj.hostname,
    obj.pathname,
    '?',
    queryPath.join('&'),
  );
  return output;
};
