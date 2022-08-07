import {useGetCurrentTopenerLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../assets/constants';

const useGetCurrentTopenerInfo = ({onSuccess}) => {
  const onSuccessResponse = topenerInfo => {
    onSuccess && onSuccess(topenerInfo);
  };

  const {startApi: getCurrentTopenerInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useGetCurrentTopenerLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessResponse,
    dataField: 'getCurrentTopener.topenerInfo',
    showSpinner: true,
  });

  const getCurrentTopener = () => {
    getCurrentTopenerInfo();
  };

  return {getCurrentTopener};
};

export {useGetCurrentTopenerInfo};
