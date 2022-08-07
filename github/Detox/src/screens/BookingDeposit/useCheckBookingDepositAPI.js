import {useState} from 'react';

import {
  useGetDepositeDurationByBookingTransactionIdLazyQuery,
  useGetValidateDepositeTransactionLazyQuery,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../assets/constants';

/*
  Field Data:

  depositeDuration {
    ableConfirmDeposite
    beginDepositeDatetime
    endDepositeDatetime
  }

  validDepositTransfer {
    isValid
  }

*/

const useCheckBookingDepositAPI = ({
  bookingTransactionId,
  depositeTransactionId,
  showSpinner = true,
  onErrorValidateDeposite,
  onErrorGetDepositeDuration,
  onSuccessDepositeDuration = () => {},
  onSuccessValidateDepositeTransaction = () => {},
}) => {
  const [depositeDuration, setDepositeDuration] = useState(null);
  const [validDepositTransfer, setValidDepositTransfer] = useState(null);

  //Check can deposit
  const onSuccessGetDepositeDuration = result => {
    setDepositeDuration(result);
    onSuccessDepositeDuration && onSuccessDepositeDuration(result);
  };

  const {startApi: fetchDepositeDuration} = useGraphqlApiLazy({
    graphqlApiLazy: useGetDepositeDurationByBookingTransactionIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'depositeDurationByBookingTransactionId',
    onSuccess: onSuccessGetDepositeDuration,
    onError: onErrorGetDepositeDuration,
    showSpinner: showSpinner,
  });

  const getDepositeDuration = newTransactionId => {
    const input = newTransactionId ?? bookingTransactionId;
    fetchDepositeDuration({variables: {bookingTransactionId: input}});
  };

  //Check can transfer deposit
  const onSuccessGetValidateDepositeTransaction = result => {
    setValidDepositTransfer(result.isValid);
    onSuccessValidateDepositeTransaction && onSuccessValidateDepositeTransaction(result.isValid);
  };

  const {startApi: fetchValidateDepositeTransaction, loading: loadingValidateDepositeTransaction} =
    useGraphqlApiLazy({
      graphqlApiLazy: useGetValidateDepositeTransactionLazyQuery,
      queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
      dataField: 'validateDepositeTransaction',
      onSuccess: onSuccessGetValidateDepositeTransaction,
      showSpinner: showSpinner,
      onError: onErrorValidateDeposite,
    });

  const getValidDepositTransfer = newTransactionId => {
    const input = newTransactionId ?? depositeTransactionId;
    fetchValidateDepositeTransaction({variables: {depositeTransactionId: input}});
  };

  return {
    getDepositeDuration,
    depositeDuration,
    getValidDepositTransfer,
    validDepositTransfer,
    loadingValidateDepositeTransaction,
  };
};

export default useCheckBookingDepositAPI;
