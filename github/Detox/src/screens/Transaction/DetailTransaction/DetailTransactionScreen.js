/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/core';
import React, {useContext, useEffect, useState} from 'react';

import {translate} from '../../../assets/localize';
import BaseScreen from '../../../components/BaseScreen';
import useDepositCountdown from '../../../components/UseDepositCountdown';
import {BookingContext} from '../../BookingDeposit/useBooking';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {DepositType} from './Components/DetailTransactionConstant';
import DetailTransactionContainer from './Components/DetailTransactionContainer';
import useCallApiTransactionDetail from './Components/useCallApiTransactionDetail';

const DetailTransactionScreen = ({route}) => {
  const {transactionId, transactionType, propertyPostId, shouldUpdate} = route?.params ?? {};
  const [data, setData] = useState({});
  const [paymentInfo, setPaymentInfo] = useState(null);
  const {registerNewTransactionNotify, removeNewTransactionNotify} = useContext(BookingContext);
  const navigation = useNavigation();
  const {
    data: dataAPI,
    countDownState,
    paymentInfoData,
    getTransactionDetailAPI: getTransactionDetail,
    loadingTransactionDetail,
    disCountInfo,
  } = useCallApiTransactionDetail({transactionType, propertyPostId, transactionId});

  useEffect(() => {
    setPaymentInfo(paymentInfoData);
  }, [paymentInfoData]);

  useEffect(() => {
    setData({...dataAPI, disCountInfo: disCountInfo});
  }, [dataAPI, disCountInfo]);

  useMount(() => {
    getTransactionDetail();
  });

  useEffect(() => {
    if (shouldUpdate) {
      getTransactionDetail();
    }
  }, [shouldUpdate]);

  const onTimeCountDownStart = canDepositStart => {
    if (canDepositStart) {
      setData({...data, depositType: DepositType.OpeningDeposit});
    } else {
      setData({...data, depositType: DepositType.DepositEnded});
    }
  };

  const onTimeCountDownEnd = () => {
    setData({...data, depositType: DepositType.DepositEnded});
  };

  const {startDepositCount, cancelCountTime} = useDepositCountdown({
    bookingTransactionId: countDownState.bookingTransactionId,
    dateStart: countDownState.dateStart,
    dateEnd: countDownState.dateEnd,
    shouldCheckStart: countDownState.shouldCheckStart,
    shouldCheckEnd: false,
    onTimeStart: onTimeCountDownStart,
    onTimeEnd: onTimeCountDownEnd,
  });

  useEffect(() => {
    if (countDownState.bookingTransactionId) {
      startDepositCount();
    }
  }, [countDownState]);

  const onRefresh = () => {
    cancelCountTime();
    getTransactionDetail();
  };

  useEffect(() => {
    registerNewTransactionNotify({id: ScreenIds.DetailTransaction, handler: onRefresh});
    return () => {
      removeNewTransactionNotify({id: ScreenIds.DetailTransaction});
    };
  }, []);

  return (
    <BaseScreen title={translate('transaction.title')}>
      <DetailTransactionContainer
        data={data}
        transactionId={transactionId}
        transactionType={transactionType}
        paymentInfo={paymentInfo}
        navigation={navigation}
        onRefreshGetDetail={onRefresh}
        loading={loadingTransactionDetail}
      />
    </BaseScreen>
  );
};

export default DetailTransactionScreen;
