import {useContactTradingB2CAssigneeByCurrentUserLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetReceivedRequests = ({onSuccess, onError, showSpinner}) => {
  const {startApi: getReceivedRequestsB2C, loading: loadingGetContactRequests} = useGraphqlApiLazy({
    graphqlApiLazy: useContactTradingB2CAssigneeByCurrentUserLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'contactTradingB2CAssigneeByCurrentUser',
    onSuccess,
    onError,
    showSpinner,
  });

  return [getReceivedRequestsB2C, loadingGetContactRequests];
};

export default useGetReceivedRequests;
