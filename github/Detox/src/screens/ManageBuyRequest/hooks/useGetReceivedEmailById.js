import {useC2CContactTradingRequesterEmailInfoLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetReceivedEmailById = ({onSuccessResponse = () => {}}) => {
  const {startApi: getReceivedEmailById} = useGraphqlApiLazy({
    graphqlApiLazy: useC2CContactTradingRequesterEmailInfoLazyQuery,
    dataField: 'c2cContactTradingRequesterEmailInfo',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessResponse,
    showSpinner: true,
  });
  const startGetReceivedEmailById = contactTradingId => {
    getReceivedEmailById({variables: {id: contactTradingId}});
  };

  return {startGetReceivedEmailById};
};

export default useGetReceivedEmailById;
