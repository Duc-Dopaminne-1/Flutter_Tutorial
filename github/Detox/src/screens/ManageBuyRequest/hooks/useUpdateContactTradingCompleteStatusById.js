import moment from 'moment';

import {useCompleteC2CContactTradingMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import NumberUtils from '../../../utils/NumberUtils';

const mapInput = (id, info) => {
  const {
    attachment = '[]',
    buyerComissionAmount = 0,
    consultantComissionAmount = 0,
    organizerComissionAmount = 0,
    salerComissionAmount = 0,
    totalComission = 0,
    contractPrice = 0,
    rentPeriod = 0,
    totalComissionUnit,
    rentPeriodUnit,
    contractNote,
    moveInDate,
  } = info?.contract ?? {};
  const signedDate = moment().valueOf();
  return {
    variables: {
      input: {
        contactTradingId: id,
        recordVersion: info?.recordVersion,
        propertyPostId: info?.propertyPostId,
        contactType: info?.contactType,
        contract: {
          totalComissionUnit,
          rentPeriodUnit,
          moveInDate,
          rentPeriod: NumberUtils.parseIntValue(rentPeriod),
          attachment: JSON.stringify({images: attachment}),
          buyerComissionAmount: NumberUtils.parseFloatValue(buyerComissionAmount),
          consultantComissionAmount: NumberUtils.parseFloatValue(consultantComissionAmount),
          organizerComissionAmount: NumberUtils.parseFloatValue(organizerComissionAmount),
          salerComissionAmount: NumberUtils.parseFloatValue(salerComissionAmount),
          signedDate,
          totalComission: NumberUtils.parseFloatValue(totalComission),
          contractPrice: NumberUtils.parseFloatValue(contractPrice),
          contractNote,
        },
      },
    },
  };
};

const useUpdateContactTradingCompleteStatusById = onSuccess => {
  const onSuccessUpdateContactTradingCompleteStatusById = data => {
    onSuccess && onSuccess(data);
  };
  const {startApi: updateContactTradingCompleteStatusById} = useGraphqlApiLazy({
    graphqlApiLazy: useCompleteC2CContactTradingMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'completeC2CContactTrading',
    onSuccess: onSuccessUpdateContactTradingCompleteStatusById,
    showSpinner: true,
  });
  const startUpdateContactTradingCompleteStatusById = (id, info) => {
    const query = mapInput(id, info);
    updateContactTradingCompleteStatusById(query);
  };

  return [startUpdateContactTradingCompleteStatusById];
};

export default useUpdateContactTradingCompleteStatusById;
