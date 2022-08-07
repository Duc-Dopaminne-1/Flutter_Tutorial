import isEmpty from 'lodash/isEmpty';
import {useEffect, useState} from 'react';

import {useMount} from '../../commonHooks';
import {getDataToConfirmDeposit} from '../../Transaction/DetailTransaction/Components/DetailTransactionContainer';
import useCallApiTransactionDetail from '../../Transaction/DetailTransaction/Components/useCallApiTransactionDetail';

const useGetTransactionDetail = ({
  transactionData,
  transactionId,
  isFromPropertyConfirm,
  transactionType,
  propertyPostId,
}) => {
  const [transactionDetail, setTransactionDetail] = useState({});
  const {data: dataAPI, getTransactionDetailAPI: getTransactionDetail} =
    useCallApiTransactionDetail({transactionType, propertyPostId, transactionId});

  useEffect(() => {
    if (!isEmpty(dataAPI)) {
      const transactionInfo = getDataToConfirmDeposit(dataAPI);
      setTransactionDetail(transactionInfo);
    }
  }, [dataAPI]);

  useMount(() => {
    if (isFromPropertyConfirm) {
      getTransactionDetail();
    } else {
      setTransactionDetail(transactionData);
    }
  });

  return {transactionDetail, getTransactionDetail};
};

export default useGetTransactionDetail;
