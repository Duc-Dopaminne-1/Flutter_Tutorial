import {useContext} from 'react';

import {useCheckPropertyPostUpdateC2CContactTradingStatusLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';

const useCheckPropertyPostUpdateContactTradingStatus = ({onSuccess, onError}) => {
  const {showMessageAlert} = useContext(AppContext);
  const onSuccessRes = data => {
    let canEdit = false;
    if (data) {
      if (data?.errorCode !== 0) {
        showMessageAlert(translate(STRINGS.INFO), data.errorMessage ?? '');
      }
      canEdit = true;
    }
    onSuccess && onSuccess(data, canEdit);
  };

  const {startApi: checkPropertyUpdateContactTradingStatus} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckPropertyPostUpdateC2CContactTradingStatusLazyQuery,
    dataField: 'checkPropertyPostUpdateC2CContactTradingStatus',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessRes,
    onError: onError,
    showSpinner: true,
  });
  const checkPropertyUpdateContactStatusC2C = propertyPostId => {
    checkPropertyUpdateContactTradingStatus({variables: {propertyPostId}});
  };

  return [checkPropertyUpdateContactStatusC2C];
};

export default useCheckPropertyPostUpdateContactTradingStatus;
