import {useContext} from 'react';

import {useGetMasterDataLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../assets/constants';

const useGetMasterData = ({onSuccess, onError}) => {
  const {setMasterData} = useContext(AppContext);

  const onSuccessGetData = masterData => {
    setMasterData(masterData);
    onSuccess(masterData);
  };

  const {startApi: startGetMasterDataApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetMasterDataLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: null,
    onSuccess: onSuccessGetData,
    onError: onError,
    showSpinner: false,
  });

  const startGetMasterData = () => {
    startGetMasterDataApi();
  };

  return {startGetMasterData};
};

export {useGetMasterData};
