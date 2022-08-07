import {useUpdateC2CContactTradingRejectedStatusMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useUpdateContactTradingRejectC2C = ({onSuccess}) => {
  const {startApi: rejectContactTradingC2CMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CContactTradingRejectedStatusMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CContactTradingRejectedStatus',
    onSuccess,
    showSpinner: true,
  });

  const rejectContactTradingC2C = ({
    contactTradingId,
    recordVersion,
    rejectReason,
    rejectReasonId,
  }) => {
    const query = {
      variables: {
        input: {
          contactTradingId,
          recordVersion,
          rejectReason,
          rejectReasonId,
        },
      },
    };
    rejectContactTradingC2CMutation(query);
  };

  return [rejectContactTradingC2C];
};

export default useUpdateContactTradingRejectC2C;
