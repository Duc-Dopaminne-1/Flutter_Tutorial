import {
  UpdateContactTradingNegotiationStatusInput,
  useUpdateC2CContactTradingNegotiationStatusMutation,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useUpdateContactTradingNegotiateC2C = ({onSuccess}) => {
  const {startApi: negotiateContactTradingC2CMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CContactTradingNegotiationStatusMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CContactTradingNegotiationStatus',
    onSuccess,
    showSpinner: true,
  });

  const negotiateContactTradingC2C = (input: UpdateContactTradingNegotiationStatusInput) => {
    const query = {
      variables: {input},
    };
    negotiateContactTradingC2CMutation(query);
  };

  return [negotiateContactTradingC2C];
};

export default useUpdateContactTradingNegotiateC2C;
