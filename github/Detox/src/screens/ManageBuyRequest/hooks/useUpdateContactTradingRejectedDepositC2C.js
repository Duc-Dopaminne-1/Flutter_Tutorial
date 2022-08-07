import {useUpdateC2CContactTradingRejectedDepositMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useUpdateContactTradingRejectedDepositC2C = ({onSuccess}) => {
  const {startApi: rejectedDepositContactTradingC2CMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CContactTradingRejectedDepositMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CContactTradingRejectedDeposit',
    onSuccess,
    showSpinner: true,
  });

  const rejectDepositContactTradingC2C = ({
    contactTradingId,
    recordVersion,
    depositRejectReason,
    depositRejectReasonId,
  }) => {
    const query = {
      variables: {
        input: {
          contactTradingId,
          recordVersion,
          depositRejectReason,
          depositRejectReasonId,
        },
      },
    };
    rejectedDepositContactTradingC2CMutation(query);
  };

  return [rejectDepositContactTradingC2C];
};

export default useUpdateContactTradingRejectedDepositC2C;
