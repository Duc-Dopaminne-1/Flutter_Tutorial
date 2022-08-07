import uuid from 'react-native-uuid';

import {parseResponseError} from '../../../api/restful/parseResponseError';
import restfulApi from '../../../api/restful/restfulApi';
import Configs from '../../../configs';

const restfulApiInstance = restfulApi({});

async function callApiGetToken(id) {
  try {
    const path = `${Configs.valuationGettokenUrl}/api/v1/generate-tpl-token/${id || uuid.v4()}`;
    const result = await restfulApiInstance.get(path, {});
    return result;
  } catch (error) {
    return parseResponseError(error);
  }
}

export {callApiGetToken};
