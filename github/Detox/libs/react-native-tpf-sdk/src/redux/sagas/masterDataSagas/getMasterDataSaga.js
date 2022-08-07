import { getMasterDataSuccess, getMasterDataFailure } from '../../actions/masterData';
import { call, put } from 'redux-saga/effects';
import { apiGetAllMasterData } from '../../../services/api/masterDataApi';

const masterList = [
  {
    name: 'bank',
    categoryCode: 'Bank'
  },

  {
    name: 'region',
    categoryCode: 'Region'
  }
];

export function* getMasterDataSaga(payload) {
  try {
    const requests = masterList.map(item => {
      return {
        status: 1,
        categoryCode: item.categoryCode,
        maxResultCount: 50000,
        sorting: 'DisplayName asc'
      };
    });

    const responses = yield call(apiGetAllMasterData, requests);
    const result = {};

    responses.map((response, index) => {
      if (response.status === 200) {
        result[masterList[index].name] = response.data.result.items;
      }
    });

    yield put(getMasterDataSuccess(result));
  } catch (error) {
    yield put(getMasterDataFailure(error));
  }
}
