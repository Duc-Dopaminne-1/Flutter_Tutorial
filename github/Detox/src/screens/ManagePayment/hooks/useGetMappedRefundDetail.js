import {useState} from 'react';

import {
  useGetRefundPaymentTransferInfoByTransIdLazyQuery,
  useGetUserTransactionDetailLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetMappedRefundDetail = ({onSuccess, onSuccessTransfer}) => {
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [refundInfo, setRefundInfo] = useState(null);

  const {startApi: getRefundDetailQuery, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetRefundPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'refundPaymentTransferInfoByTransId',
    onSuccess: res => {
      onSuccessTransfer && onSuccessTransfer({refundInfo: res?.refundPaymentTransferInfoDto});
      setRefundInfo({refundInfo: res?.refundPaymentTransferInfoDto});
    },
  });

  const {startApi: getUserTransactionDetailQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserTransactionDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userTransactionById',
    onSuccess: res => {
      onSuccess && onSuccess({transactionInfo: res?.userTransactionDto});
      setTransactionInfo({transactionInfo: res?.userTransactionDto});
    },
  });

  const getRefundDetail = ({transactionId, userTransactionId, transactionType, propertyPostId}) => {
    getUserTransactionDetailQuery({
      variables: {
        input: {
          transactionType,
          userTransactionId,
          propertyPostId,
        },
      },
    });
    getRefundDetailQuery({variables: {transactionId}});
  };

  return {
    getRefundDetail,
    loading,
    transactionInfo,
    refundInfo,
  };
};

export default useGetMappedRefundDetail;
