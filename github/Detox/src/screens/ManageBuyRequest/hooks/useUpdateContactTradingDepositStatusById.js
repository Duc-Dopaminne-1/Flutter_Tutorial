import {
  ContactTradingDepositInput,
  UpdateContactTradingDepositStatusInput,
  useUpdateC2CContactTradingDepositStatusMutation,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import NumberUtils from '../../../utils/NumberUtils';

const mapInput = (id, updatedInfo, defaultDepositInfo) => {
  const {
    closingPrice = 0,
    commission,
    commissionTpl,
    commissionUnitId,
    depositedAmount = 0,
    depositTerm,
    attachment = '[]',
    paymentProgressDtos,
    bankName,
    notaryOffice,
    notarizationDatetime,
    depositPaymentTermFrom,
    depositPaymentTermTo,
    paymentMethodId,
    depositNote,
    depositedDate = new Date().getTime(),
  }: ContactTradingDepositInput = updatedInfo ?? {};

  const {paymentProgressDtos: defaultProgresses} = defaultDepositInfo ?? {};

  const paymentProgress =
    paymentProgressDtos?.map((e, index) => ({
      amount: NumberUtils.parseFloatValue(e?.amount),
      paymentDatetime: NumberUtils.parseFloatValue(e?.paymentDatetime),
      paymentTerms: e?.paymentTerms,
      paymentProgressId:
        defaultProgresses?.length > 0 && index < defaultProgresses?.length
          ? defaultProgresses[index]?.paymentProgressId
          : null,
    })) || [];

  const depositDetails: ContactTradingDepositInput = {
    commission,
    commissionTpl,
    commissionUnitId,
    bankName,
    notaryOffice,
    notarizationDatetime,
    depositPaymentTermFrom,
    depositPaymentTermTo,
    paymentMethodId,
    depositNote,
    depositedDate,
    paymentProgressDtoJson: JSON.stringify(paymentProgress),
    attachment: JSON.stringify(attachment),
    closingPrice: NumberUtils.parseFloatValue(closingPrice),
    depositedAmount: NumberUtils.parseFloatValue(depositedAmount),
    depositTerm: NumberUtils.parseIntValue(depositTerm),
  };

  const input: UpdateContactTradingDepositStatusInput = {
    contactTradingId: id,
    deposit: depositDetails,
    recordVersion: updatedInfo?.recordVersion,
    contactType: updatedInfo?.contactType,
  };

  return {
    variables: {
      input,
    },
  };
};

const useUpdateContactTradingDepositStatusById = onSuccess => {
  const onSuccessUpdateContactTradingDepositStatusById = data => {
    onSuccess && onSuccess(data);
  };
  const {startApi: updateContactTradingDepositStatusById} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CContactTradingDepositStatusMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CContactTradingDepositStatus',
    onSuccess: onSuccessUpdateContactTradingDepositStatusById,
    showSpinner: true,
  });
  const startUpdateContactTradingDepositStatusById = (id, updatedInfo, defaultDepositInfo) => {
    const query = mapInput(id, updatedInfo, defaultDepositInfo);
    updateContactTradingDepositStatusById(query);
  };

  return [startUpdateContactTradingDepositStatusById];
};

export default useUpdateContactTradingDepositStatusById;
