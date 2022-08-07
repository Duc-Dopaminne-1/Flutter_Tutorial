import {useContext} from 'react';

import {useGetContactTradingB2CDetailByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {ContactTradingContext} from '../useContactTrading';

const useGetDetailContactTradingB2C = () => {
  const {setContactTradingInfoB2C} = useContext(ContactTradingContext);
  const onSuccessGetContactTradingB2C = response => {
    const contactTradingInfo = response?.contactTradingB2CDto;
    setContactTradingInfoB2C(contactTradingInfo);
  };

  const {startApi: getContactTradingB2C, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetContactTradingB2CDetailByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getContactTradingB2CDetailById',
    onSuccess: onSuccessGetContactTradingB2C,
    showSpinner: false,
  });

  return {getContactTradingB2C, loading};
};

export default useGetDetailContactTradingB2C;
