import {useState} from 'react';

import {useGetDiscountInfoForFoByDepositLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {BOOKING_STATUS, ERROR_DEPOSIT} from '../../../../assets/constants';
import {INITIAL_COUNTDOWN_STATE} from '../../../../components/UseDepositCountdown';
import useCheckBookingDepositAPI from '../../../BookingDeposit/useCheckBookingDepositAPI';
import {DepositType, TransactionType} from './DetailTransactionConstant';
import {mapTransactionDetailToData, useTransactionDetail} from './useTransactionDetail';

const useCallApiTransactionDetail = ({transactionType, propertyPostId, transactionId}) => {
  const [data, setData] = useState({});
  const [disCountInfo, setDiscountInfo] = useState(false);
  const [countDownState, setCountDownState] = useState(INITIAL_COUNTDOWN_STATE);
  const [paymentInfoData, setPaymentInfo] = useState({});

  const onGetValidateTransfer = isValid => {
    setData({...data, canTransferProperty: isValid});
  };

  const onErrorGetDepositeDuration = () => {
    //ignore error
  };

  const onErrorValidateDeposite = ({errorMessage, errorMessageCode}) => {
    if (errorMessageCode === ERROR_DEPOSIT.OUT_NUMBER_TRANSFER) {
      setData({
        ...data,
        canShowButtonTransfer: true,
        errorButtonTransfer: errorMessage,
      });
    }
  };

  const {getValidDepositTransfer, loadingValidateDepositeTransaction} = useCheckBookingDepositAPI({
    depositeTransactionId:
      transactionType === TransactionType.Deposit ? transactionId : data?.depositeTransactionId,
    showSpinner: false,
    onSuccessValidateDepositeTransaction: onGetValidateTransfer,
    onErrorValidateDeposite,
    onErrorGetDepositeDuration,
  });

  const {startApi: getDiscountInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useGetDiscountInfoForFoByDepositLazyQuery,
    showSpinner: false,
    dataField: 'getDiscountInfoForFoByDeposit',
    onSuccess: response => {
      setDiscountInfo(response?.discountDetailDto);
    },
  });

  const onSuccessGetDetail = result => {
    if (!result) {
      return;
    }
    const mapped = mapTransactionDetailToData(result);
    setData(mapped);
    const beginDepositeDatetime = mapped.beginDepositeDatetime;
    const endDepositeDatetime = mapped.endDepositeDatetime;
    if (
      (mapped.depositType === DepositType.Waiting ||
        mapped.depositType === DepositType.OpeningDeposit) &&
      beginDepositeDatetime &&
      endDepositeDatetime
    ) {
      setCountDownState({
        bookingTransactionId: transactionId,
        dateStart: beginDepositeDatetime,
        dateEnd: endDepositeDatetime,
        shouldCheckStart: mapped.depositType === DepositType.Waiting,
      });
    }
    if (mapped.transactionStatus === BOOKING_STATUS.DEPOSITED) {
      getDiscountInfo({
        variables: {
          b2CDepositTransactionId: mapped.depositeTransactionId,
        },
      });
      getValidDepositTransfer(mapped.depositeTransactionId);
      // Get discount info when booking status is deposited
    }
  };

  const {getTransactionDetail, loading: loadingTransactionDetail} = useTransactionDetail({
    transactionType,
    transactionId,
    propertyPostId,
    onSuccess: onSuccessGetDetail,
    onSuccessHandler: res => {
      setPaymentInfo(res);
    },
  });

  const getTransactionDetailAPI = () => {
    setCountDownState(INITIAL_COUNTDOWN_STATE);
    getTransactionDetail();
  };

  return {
    data,
    countDownState,
    paymentInfoData,
    disCountInfo,
    getTransactionDetailAPI,
    loadingTransactionDetail,
    loadingValidateDepositeTransaction,
  };
};

export default useCallApiTransactionDetail;
