import {useUpdateC2CContactTradingConnectedStatusMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useUpdateContactTradingConnectC2C = ({onSuccess}) => {
  const {startApi: connectContactTradingC2CMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CContactTradingConnectedStatusMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CContactTradingConnectedStatus',
    onSuccess,
    showSpinner: true,
  });

  const connectContactTradingC2C = ({contactTradingId, recordVersion}) => {
    const query = {
      variables: {
        input: {
          contactTradingId,
          recordVersion,
        },
      },
    };
    connectContactTradingC2CMutation(query);
  };

  return [connectContactTradingC2C];
};

export default useUpdateContactTradingConnectC2C;
