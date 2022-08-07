import {parseResponseError} from '../restful/parseResponseError';
import restfulApi from '../restful/restfulApi';

const restfulApiInstance = restfulApi({});

async function sendVnPayIpnRequest(ipnUrl) {
  try {
    const result = await restfulApiInstance.get(ipnUrl, {});
    return result;
  } catch (error) {
    return parseResponseError(error);
  }
}

export {sendVnPayIpnRequest};
