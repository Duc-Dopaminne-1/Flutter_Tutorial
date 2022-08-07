import {useUpdateC2CContactTradingAcceptedDepositMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useUpdateContactTradingAcceptedDepositC2C = ({onSuccess}) => {
  const {startApi: acceptedDepositContactTradingC2CMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CContactTradingAcceptedDepositMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CContactTradingAcceptedDeposit',
    onSuccess,
    showSpinner: true,
  });

  const acceptedDepositContactTradingC2C = ({contactTradingId, recordVersion}) => {
    const query = {
      variables: {
        input: {
          contactTradingId,
          recordVersion,
        },
      },
    };
    acceptedDepositContactTradingC2CMutation(query);
  };

  return [acceptedDepositContactTradingC2C];
};

export default useUpdateContactTradingAcceptedDepositC2C;
