import {useCreateC2CContactTradingFoMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useCreateContactTrading = ({onSuccessResponse}) => {
  const {startApi: createContactTrading} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateC2CContactTradingFoMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    showSpinner: true,
    dataField: 'createC2CContactTradingFO',
    onSuccess: onSuccessResponse,
  });
  const startCreateContactTrading = input => {
    createContactTrading({variables: {input}});
  };
  return [startCreateContactTrading];
};

export default useCreateContactTrading;
