import {useUpdateC2CContactTradingPendingStatusMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import NumberUtils from '../../../utils/NumberUtils';

const useUpdateContactTradingPendingStatusById = onSuccess => {
  const onSuccessUpdateContactTradingPendingStatusById = data => {
    onSuccess && onSuccess(data);
  };
  const {startApi: updateContactTradingPendingStatusById} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CContactTradingPendingStatusMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CContactTradingPendingStatus',
    onSuccess: onSuccessUpdateContactTradingPendingStatusById,
    showSpinner: true,
  });
  const startUpdateContactTradingPendingStatusById = (id, info) => {
    const query = {
      variables: {
        input: {
          contactTradingId: id,
          pendingNote: info?.pendingNote ?? '',
          pendingReason: info?.pendingReason ?? '',
          pendingStatus: info?.pendingStatus ?? false,
          pendingCompensationAmount: Number.parseFloat(info?.pendingCompensationAmount) ?? 0,
          recordVersion: NumberUtils.parseIntValue(info.recordVersion) ?? 0,
        },
      },
    };
    updateContactTradingPendingStatusById(query);
  };

  return [startUpdateContactTradingPendingStatusById];
};

export default useUpdateContactTradingPendingStatusById;
