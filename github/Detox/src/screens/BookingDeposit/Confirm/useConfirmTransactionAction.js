import {useState} from 'react';

import {
  useBidvPayBookingTransactionMutation,
  useBidvPayDepositTransactionMutation,
  useFastPayBookingTransactionMutation,
  useFastPayDepositTransactionMutation,
  useGetFastPaymentTransferInfoByTransIdLazyQuery,
  useGetPaymentTransferInfoByTransIdLazyQuery,
  useGetVnPayPaymentTransferInfoByTransIdLazyQuery,
  useVnpayPayBookingTransactionMutation,
  useVnpayPayDepositTransactionMutation,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {GetBookingRequest} from '../DataHandler';

const useBidvPayBookingTransaction = ({state, onSuccess, onError}) => {
  const {startApi: bidvPayBookingTransactionQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useBidvPayBookingTransactionMutation,
    queryOptions: {},
    dataField: 'bidvPayBookingTransaction',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const bidvPayBookingTransaction = curState => {
    const updateState = curState ?? state;
    bidvPayBookingTransactionQuery({
      variables: {
        payBookingTransactionInput: GetBookingRequest(updateState),
      },
    });
  };

  return {bidvPayBookingTransaction};
};

const useVnpayPayBookingTransaction = ({state, onSuccess, onError}) => {
  const {startApi: vnpayPayBookingTransactionQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useVnpayPayBookingTransactionMutation,
    queryOptions: {},
    dataField: 'vnpayPayBookingTransaction',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const vnpayPayBookingTransaction = curState => {
    const updateState = curState ?? state;
    vnpayPayBookingTransactionQuery({
      variables: {
        payBookingTransactionInput: GetBookingRequest(updateState),
      },
    });
  };

  return {vnpayPayBookingTransaction};
};

const useFastPayBookingTransaction = ({state, onSuccess, onError}) => {
  const {startApi: fastPayBookingTransactionQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useFastPayBookingTransactionMutation,
    queryOptions: {},
    dataField: 'fastPayBookingTransaction',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const fastPayBookingTransaction = curState => {
    const updateState = curState ?? state;
    fastPayBookingTransactionQuery({
      variables: {
        payBookingTransactionInput: GetBookingRequest(updateState),
      },
    });
  };

  return {fastPayBookingTransaction};
};

const useBidvPayDepositTransaction = ({state, onSuccess, onError}) => {
  const {startApi: bidvPayDepositTransactionQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useBidvPayDepositTransactionMutation,
    queryOptions: {},
    dataField: 'bidvPayDepositTransaction',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const bidvPayDepositTransaction = curState => {
    const updateState = curState ?? state;
    bidvPayDepositTransactionQuery({
      variables: {
        payDepositTransactionInput: GetBookingRequest(updateState),
      },
    });
  };

  return {bidvPayDepositTransaction};
};

const useVnpayPayDepositTransaction = ({state, onSuccess, onError}) => {
  const {startApi: vnpayPayDepositTransactionQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useVnpayPayDepositTransactionMutation,
    queryOptions: {},
    dataField: 'vnpayPayDepositTransaction',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const vnpayPayDepositTransaction = curState => {
    const updateState = curState ?? state;
    vnpayPayDepositTransactionQuery({
      variables: {
        payDepositTransactionInput: GetBookingRequest(updateState),
      },
    });
  };

  return {vnpayPayDepositTransaction};
};

const useFastPayDepositTransaction = ({state, onSuccess, onError}) => {
  const {startApi: fastPayDepositTransactionQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useFastPayDepositTransactionMutation,
    queryOptions: {},
    dataField: 'fastPayDepositTransaction',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const fastPayDepositTransaction = curState => {
    const updateState = curState ?? state;
    fastPayDepositTransactionQuery({
      variables: {
        payDepositTransactionInput: GetBookingRequest(updateState),
      },
    });
  };

  return {fastPayDepositTransaction};
};

const useGetPaymentTransferInfo = ({onSuccess, onError, showSpinner = true}) => {
  const {startApi: useGetPaymentTransferInfoQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {},
    dataField: 'bankPaymentTransferInfoByTransId',
    onSuccess,
    onError,
    showSpinner: showSpinner,
  });

  const getPaymentTransferInfo = bookingId => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetPaymentTransferInfoQuery({
      variables: {
        input: bookingId,
      },
    });
  };
  return {getPaymentTransferInfo};
};

const useGetPaymentFastInfo = ({onSuccess, onError, showSpinner = true}) => {
  const {startApi: useGetPaymentFastInfoQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useGetFastPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {},
    dataField: 'fastPaymentTransferInfoByTransId',
    onSuccess,
    onError,
    showSpinner: showSpinner,
  });

  const getPaymentFastInfo = transactionId => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetPaymentFastInfoQuery({
      variables: {
        input: transactionId,
      },
    });
  };
  return {getPaymentFastInfo};
};

const useGetPaymentVNPayInfo = ({onSuccess, onError, showSpinner = true}) => {
  const {startApi: useGetPaymentVNPayInfoQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useGetVnPayPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {},
    dataField: 'vnpayPaymentTransferInfoByTransId',
    onSuccess,
    onError,
    showSpinner: showSpinner,
  });

  const getPaymentVNPayInfo = transactionId => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetPaymentVNPayInfoQuery({
      variables: {
        input: transactionId,
      },
    });
  };
  return {getPaymentVNPayInfo};
};

const usePayByTransferAndGetTransactionInfo = ({onSuccess, onError, state}) => {
  const [transId, setTransId] = useState(null);
  const {getPaymentTransferInfo} = useGetPaymentTransferInfo({
    onSuccess: response => {
      onSuccess({...response, transactionId: transId});
    },
    onError,
  });

  const onSuccessPayment = response => {
    if (response) {
      setTransId(response?.transactionId);
      getPaymentTransferInfo(response?.transactionId);
    }
  };
  const {bidvPayBookingTransaction} = useBidvPayBookingTransaction({
    onSuccess: onSuccessPayment,
    onError,
    state,
  });
  const {bidvPayDepositTransaction} = useBidvPayDepositTransaction({
    onSuccess: onSuccessPayment,
    onError,
    state,
  });

  const bidvPayDepositTransactionAndGetInfo = curState => {
    const updateState = curState ?? state;
    bidvPayDepositTransaction(updateState);
  };
  const bidvPayBookingTransactionAndGetInfo = curState => {
    const updateState = curState ?? state;
    bidvPayBookingTransaction(updateState);
  };
  return {
    bidvPayDepositTransactionAndGetInfo,
    bidvPayBookingTransactionAndGetInfo,
  };
};

const usePayByVNPayAndGetTransactionInfo = ({onSuccess, onError, state}) => {
  const [transId, setTransId] = useState(null);
  const {getPaymentVNPayInfo} = useGetPaymentVNPayInfo({
    onSuccess: response => {
      onSuccess({...response, transactionId: transId});
    },
    onError,
  });
  const onSuccessPayment = response => {
    if (response) {
      setTransId(response?.transactionId);
      getPaymentVNPayInfo(response?.transactionId);
    }
  };

  const {vnpayPayBookingTransaction} = useVnpayPayBookingTransaction({
    onSuccess: onSuccessPayment,
    onError,
    state,
  });
  const {vnpayPayDepositTransaction} = useVnpayPayDepositTransaction({
    onSuccess: onSuccessPayment,
    onError,
    state,
  });

  const vnpayPayDepositTransactionAndGetInfo = curState => {
    const updateState = curState ?? state;
    vnpayPayDepositTransaction(updateState);
  };
  const vnpayPayBookingTransactionAndGetInfo = curState => {
    const updateState = curState ?? state;
    vnpayPayBookingTransaction(updateState);
  };

  return {
    vnpayPayDepositTransactionAndGetInfo,
    vnpayPayBookingTransactionAndGetInfo,
  };
};

const usePayByFastAndGetTransactionInfo = ({onSuccess, onError, state}) => {
  const [transId, setTransId] = useState(null);
  const {getPaymentFastInfo} = useGetPaymentFastInfo({
    onSuccess: response => {
      onSuccess({...response, transactionId: transId});
    },
    onError,
  });
  const onSuccessPayment = response => {
    if (response) {
      setTransId(response?.transactionId);
      getPaymentFastInfo(response?.transactionId);
    }
  };
  const {fastPayBookingTransaction} = useFastPayBookingTransaction({
    onSuccess: onSuccessPayment,
    onError,
    state,
  });
  const {fastPayDepositTransaction} = useFastPayDepositTransaction({
    onSuccess: onSuccessPayment,
    onError,
    state,
  });

  const fastDepositTransactionAndGetInfo = curState => {
    const updateState = curState ?? state;
    fastPayDepositTransaction(updateState);
  };
  const fastBookingTransactionAndGetInfo = curState => {
    const updateState = curState ?? state;
    fastPayBookingTransaction(updateState);
  };

  return {
    fastDepositTransactionAndGetInfo,
    fastBookingTransactionAndGetInfo,
  };
};

export {
  useBidvPayBookingTransaction,
  useBidvPayDepositTransaction,
  useFastPayBookingTransaction,
  useFastPayDepositTransaction,
  useGetPaymentFastInfo,
  useGetPaymentTransferInfo,
  useGetPaymentVNPayInfo,
  usePayByFastAndGetTransactionInfo,
  usePayByTransferAndGetTransactionInfo,
  usePayByVNPayAndGetTransactionInfo,
  useVnpayPayBookingTransaction,
  useVnpayPayDepositTransaction,
};
