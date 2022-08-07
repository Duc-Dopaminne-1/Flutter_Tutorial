import {useContext} from 'react';

import {useGetC2CPropertyPostByIdPublicLastVersionFoLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {ContactTradingContext} from '../useContactTrading';

const useGetPropertyPostById = (onSuccess, onSuccessOverride, shouldShowSpinner = false) => {
  const {setPropertyPostInfo} = useContext(ContactTradingContext);
  const onSuccessGetPropertyPostInfo = response => {
    const data = response.propertyPostDto ?? {};

    if (onSuccessOverride) {
      onSuccessOverride(data);
      return;
    }
    setPropertyPostInfo && setPropertyPostInfo(data);
    onSuccess && onSuccess(data);
  };
  const {startApi: getPropertyPostById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetC2CPropertyPostByIdPublicLastVersionFoLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getC2CPropertyPostByIdPublicLastVersionFO',
    onSuccess: onSuccessGetPropertyPostInfo,
    showSpinner: shouldShowSpinner,
  });

  const startGetPropertyPostInfoById = postId => {
    getPropertyPostById({variables: {propertyPostId: postId}});
  };
  return [startGetPropertyPostInfoById];
};

export default useGetPropertyPostById;
