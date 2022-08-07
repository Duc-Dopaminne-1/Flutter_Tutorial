import isEmpty from 'lodash/isEmpty';
import {useState} from 'react';

import {
  PaymentUnit,
  TransactionPaymentStatus,
  TransactionServiceType,
  useGetBankTransferDetailsByTransactionIdLazyQuery,
  useGetFastPaymentTransferInfoByTransIdLazyQuery,
  useGetUserTransactionDetailLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetMappedPaymentDetail = ({
  serviceType,
  onSuccess,
  onSuccessTransfer,
  onSuccessDetails,
}) => {
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [fundAccount, setFundAccount] = useState(null);
  const [histories, setHistories] = useState(null);

  const onSuccessGetHistoryTransactionInfo = res => {
    onSuccessDetails && onSuccessDetails({histories: res?.edges ?? []});
    setHistories(res?.edges ?? []);
  };
  const {startApi: getHistoryTransactionInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useGetBankTransferDetailsByTransactionIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'bankTransferDetailsByTransactionId',
    onSuccess: onSuccessGetHistoryTransactionInfo,
  });

  const fastInfoApi = useMutationGraphql({
    graphqlApiLazy: useGetFastPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'fastPaymentTransferInfoByTransId',
    showSpinner: false,
  });

  const onSuccessResponse = result => {
    const transactionId = result?.userTransactionDto?.transactionId ?? '';

    onSuccess && onSuccess(result?.userTransactionDto);
    setTransactionInfo(result?.userTransactionDto);

    if (
      serviceType === TransactionServiceType.B2Ctype ||
      serviceType === TransactionServiceType.C2Ctype
    ) {
      const paymentUnit = result?.userTransactionDto?.paymentUnit ?? '';
      const transactionPaymentStatus = result?.userTransactionDto?.transactionPaymentStatus ?? '';
      if (
        !isEmpty(transactionId) &&
        paymentUnit !== PaymentUnit.Vnpay &&
        transactionPaymentStatus !== TransactionPaymentStatus.Awaitingpayment
      ) {
        // NOTE: 2 phương thức dùng chung để get danh sách chi tiết thanh toán
        getHistoryTransactionInfo({variables: {transactionId}});
      }
      if (!isEmpty(paymentUnit) && paymentUnit === PaymentUnit.Fast) {
        fastInfoApi.startApi({variables: {input: transactionId}}, res => {
          onSuccessTransfer &&
            onSuccessTransfer(res?.fastPaymentTransferInfoDto?.fundAccount ?? {});

          setFundAccount(res?.fastPaymentTransferInfoDto?.fundAccount ?? {});
        });
      }
    }
  };

  const {startApi: getUserTransactionDetailQuery, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserTransactionDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userTransactionById',
    onSuccess: onSuccessResponse,
  });

  const getUserTransactionDetail = ({transactionType, userTransactionId, propertyPostId}) => {
    getUserTransactionDetailQuery({
      variables: {
        input: {
          transactionType,
          userTransactionId,
          propertyPostId,
        },
      },
    });
  };

  return {
    getUserTransactionDetail,
    loading,
    transactionInfo,
    fundAccount,
    histories,
  };
};

export default useGetMappedPaymentDetail;
