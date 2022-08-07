import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';

import {
  CheckCurrentUserIsSaleAgentQueryVariables,
  useCheckCurrentUserIsSaleAgentLazyQuery,
  useGetDepositeDurationByBookingTransactionIdLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {isAgent} from '../../../appData/user/selectors';
import {FETCH_POLICY, TRANSACTION_MODE} from '../../../assets/constants';
import {INITIAL_COUNTDOWN_STATE} from '../../../components/UseDepositCountdown';
import {useLogin} from '../../Auth/useLogin';
import {INITIAL_CONFIRM_PROPERTY_DATA, TransactionContextType} from './ConfirmPropertyConstants';
import {
  mapPropertyByIdForTransactionToData,
  useGetApiForConfirmProperty,
} from './useApiForConfirmProperty';

const getShouldStartCountdonwn = processedData => {
  const bookingTransactionId = processedData.bookingTransactionInfo?.bookingTransactionId;
  const beginDepositeDatetime = processedData.bookingTransactionInfo?.beginDepositeDatetime;
  const endDepositeTimeInSecond = processedData.bookingTransactionInfo?.endDepositeTimeInSecond;
  const endDepositeDatetime = processedData.bookingTransactionInfo?.endDepositeDatetime;
  const isCannotDepositButBeforeBeginTime =
    processedData.contextType === TransactionContextType.CannotDeposit &&
    moment().isBefore(moment(beginDepositeDatetime));
  const isTypeBookedDeposit = processedData.contextType === TransactionContextType.BookedDeposit;
  let countDownObject = null;
  // Nếu căn này chưa được đặt cọc (!processedData.isDeposited)
  // Hoặc người này đã đặt chỗ trước đó, nhưng chưa tới giờ đặt cọc (CannotDeposit và có depositeDateTime) (sẽ count đến start time)
  // Hoặc đang trong trạng thái xác nhận cọc (BookedDeposit) (bỏ qua start time)
  // Thì bắt đầu countdown
  if (
    !processedData.isDeposited &&
    bookingTransactionId &&
    endDepositeDatetime &&
    beginDepositeDatetime &&
    (isCannotDepositButBeforeBeginTime || isTypeBookedDeposit)
  ) {
    countDownObject = {
      bookingTransactionId,
      dateStart: beginDepositeDatetime,
      endDepositeTime: endDepositeTimeInSecond,
      dateEnd: endDepositeDatetime,
      shouldCheckStart: processedData.contextType === TransactionContextType.CannotDeposit,
    };
  }
  return countDownObject;
};

const useHandleDataConfirmProperty = ({
  propertyPostId,
  saleSeasonId,
  transactionMode,
  setIsLoggedInUserSaleAgent,
}) => {
  const [data, setData] = useState(INITIAL_CONFIRM_PROPERTY_DATA);
  const [countDownState, setCountDownState] = useState(INITIAL_COUNTDOWN_STATE);
  const isAgentUser = useSelector(isAgent);
  const {notLoggedIn} = useLogin();
  const checkIsSaleAgentApi = useMutationGraphql({
    showSpinner: false,
    graphqlApiLazy: useCheckCurrentUserIsSaleAgentLazyQuery,
    dataField: 'checkCurrentUserIsSaleAgent',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
  });

  const {startApi: fetchDepositeDuration} = useGraphqlApiLazy({
    graphqlApiLazy: useGetDepositeDurationByBookingTransactionIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'depositeDurationByBookingTransactionId',
    onSuccess: data => fetchDepositeDurationSuccess(data),
    onError: () => {},
    showSpinner: false,
  });

  const fetchDepositeDurationSuccess = depositeDuration => {
    if (depositeDuration) {
      setData({...data, depositeDuration: depositeDuration});
    }
  };

  const handleResult = ({result, needCheckAgent}) => {
    const propertyDetail = result?.propertyPostByIdForTransaction;
    if (!propertyDetail) {
      return;
    }

    const processedData = mapPropertyByIdForTransactionToData(
      propertyDetail,
      transactionMode,
      isAgentUser,
    );
    if (needCheckAgent && isAgentUser && !notLoggedIn) {
      const variables: CheckCurrentUserIsSaleAgentQueryVariables = {
        input: {saleSeasonId, propertyPostId},
      };
      checkIsSaleAgentApi.startApi({variables}, saleAgentData => {
        const isSaleAgent = saleAgentData?.isSaleAgent ?? false;
        setData({...saleAgentData, ...processedData, isSaleAgent, timeUpdate: moment()});
        setIsLoggedInUserSaleAgent(isSaleAgent);
      });
    } else {
      setData({...data, ...processedData, timeUpdate: moment()});
    }
    if (transactionMode === TRANSACTION_MODE.DEPOSIT) {
      fetchDepositeDuration({
        variables: {
          transactionId: processedData?.bookingTransactionInfo?.bookingTransactionId,
        },
      });
    }
    const countDownObject = getShouldStartCountdonwn(processedData);
    countDownObject && setCountDownState({...countDownObject});
  };

  const onSuccessDetailAndIsSaleAgent = result => {
    handleResult({result, needCheckAgent: true});
  };

  const onSuccessDetail = result => {
    const resultObject = {propertyPostByIdForTransaction: result};
    handleResult({result: resultObject, needCheckAgent: false});
  };

  const {
    getGetDetailPropertyAndIsSaleAgent,
    getPropertyForTransaction,
    loadingDetailProperty,
    loadingDetailPropertyAndAgent,
    loadingIsSaleAgent,
  } = useGetApiForConfirmProperty({
    propertyPostId,
    saleSeasonId,
    onSuccessDetailAndIsSaleAgent,
    onSuccessDetail,
  });

  return {
    data,
    countDownState,
    getGetDetailPropertyAndIsSaleAgent,
    getPropertyForTransaction,
    loadingDetailProperty,
    loadingDetailPropertyAndAgent,
    loadingIsSaleAgent,
  };
};

export default useHandleDataConfirmProperty;
