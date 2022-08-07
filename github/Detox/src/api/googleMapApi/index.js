import Configs from '../../configs';
import {parseResponseError} from '../restful/parseResponseError';
import restfulApi from '../restful/restfulApi';
import {parseData} from './parseData';

const endPoint = {
  geoCoding: '/geocode/json',
};

const restfulApiInstance = restfulApi({
  baseURL: Configs.googleMap.API_URL,
});

async function getCoordinatesFromAddress(address) {
  try {
    const params = {
      address: address,
      key: Configs.googleMap.API_KEY_GEOCODING,
    };
    const result = await restfulApiInstance.get(endPoint.geoCoding, {params});
    return parseData(result);
  } catch (error) {
    return parseResponseError(error);
  }
}

export {getCoordinatesFromAddress};
