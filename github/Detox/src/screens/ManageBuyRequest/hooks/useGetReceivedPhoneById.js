import {useC2CContactTradingRequesterPhoneInfoLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetReceivedPhoneById = ({onSuccessResponse = () => {}}) => {
  const {startApi: getReceivedPhoneById} = useGraphqlApiLazy({
    graphqlApiLazy: useC2CContactTradingRequesterPhoneInfoLazyQuery,
    dataField: 'c2cContactTradingRequesterPhoneInfo',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessResponse,
    showSpinner: true,
  });
  const startGetReceivedPhoneById = contactTradingId => {
    getReceivedPhoneById({variables: {id: contactTradingId}});
  };

  return {startGetReceivedPhoneById};
};

export default useGetReceivedPhoneById;
