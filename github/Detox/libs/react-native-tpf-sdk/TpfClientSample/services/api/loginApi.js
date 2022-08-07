export const apiLogin = async body => {
  try {
    let formBody = [];
    for (var key in body) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(body[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    let response = await fetch('https://id-sandbox-citus.topenland.com/connect/token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: 'Basic VkRCd1pXNUpSREl3TWpJaElRPT06VDBwM25MQG5kISE='
      },
      body: formBody
    });
    let result = await response.json();
    return {
      status: response.status,
      message: response.statusText,
      data: result
    };
  } catch (error) {
    return error;
  }
};
