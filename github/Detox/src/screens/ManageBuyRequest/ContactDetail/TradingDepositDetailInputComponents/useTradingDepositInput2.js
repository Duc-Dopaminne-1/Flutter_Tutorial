import React, {useEffect} from 'react';
import {LayoutAnimation} from 'react-native';

import {DAY_TO_MILISECOND} from '../../../../assets/constants';
import Configs from '../../../../configs';
import {useGetSecuredFileUrl} from '../../../../hooks/useGetSecuredFileUrl';
import logService from '../../../../service/logService';
import {downloadFileAzure} from '../../../../utils/fileHandler';
import NumberUtils from '../../../../utils/NumberUtils';
import {dateToTimestamp} from '../../../../utils/TimerCommon';
import {DEPOSIT_INPUTS2} from '../../DetailRequestConstant';
import {validatePaymentAmount, validatePaymentDatetime} from '../../ManageBuyRequestUtils';
import {ProgressDetail} from '../../type';
import {TradingDepositAction} from '../TradingDepositDetailScreen';

const checkIsLastPayment = (lastDepositDay, lastProgressPaymentTime) => {
  if (!lastDepositDay || !lastProgressPaymentTime) {
    return false;
  }

  return lastDepositDay - lastProgressPaymentTime < DAY_TO_MILISECOND;
};

const useTradingDepositInput2 = ({state, dispatch}) => {
  const {deposit: editingDepositInfo = {}} = state ?? {};

  const getFileUrl = useGetSecuredFileUrl();

  const remainingDepositAmount =
    editingDepositInfo?.closingPrice -
    editingDepositInfo?.paymentProgressDtos
      ?.map(e => NumberUtils.parseIntValue(e?.amount) ?? 0)
      .reduce((a, b) => a + b, 0);

  const showAddPaymentProgressBtn = remainingDepositAmount > 0;

  const invalidPaymentDatetime =
    !editingDepositInfo?.depositPaymentTermTo || !editingDepositInfo?.depositPaymentTermFrom;

  const handleOnSelectedImages = selectedImages => {
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [DEPOSIT_INPUTS2.attachment]: selectedImages,
      },
    });
  };

  const onChangePaymentDatetime = () => {
    const updatedProgresses = validatePaymentDatetime(
      editingDepositInfo?.paymentProgressDtos,
      editingDepositInfo?.depositPaymentTermFrom,
      editingDepositInfo?.depositPaymentTermTo,
    );
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        paymentProgressDtos: updatedProgresses,
      },
    });
  };
  useEffect(onChangePaymentDatetime, [
    editingDepositInfo.depositPaymentTermFrom,
    editingDepositInfo.depositPaymentTermTo,
  ]);

  const onChangeDepositAmount = () => {
    const updatedProgresses = validatePaymentAmount(
      editingDepositInfo?.paymentProgressDtos,
      editingDepositInfo?.closingPrice,
    );
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        paymentProgressDtos: updatedProgresses,
      },
    });
  };
  useEffect(onChangeDepositAmount, [editingDepositInfo.closingPrice]);

  const onChangeItemProgressContent = (item, itemChangedIndex) => {
    const itemKey = Object.keys(item).pop();
    const progressesTemp = editingDepositInfo?.paymentProgressDtos.map(e => ({...e}));

    progressesTemp[itemChangedIndex][itemKey] = item[itemKey];

    let validatedProgresses = progressesTemp;

    if (itemKey === 'amount') {
      validatedProgresses = validatePaymentAmount(progressesTemp, editingDepositInfo?.closingPrice);
    } else if (itemKey === 'paymentDatetime') {
      validatedProgresses = validatePaymentDatetime(
        progressesTemp,
        editingDepositInfo?.depositPaymentTermFrom,
        editingDepositInfo?.depositPaymentTermTo,
      );
    }
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        paymentProgressDtos: validatedProgresses,
      },
    });
  };

  const onChangeItemPaymentDatetime = (timestamp, itemIndex) =>
    onChangeItemProgressContent({paymentDatetime: timestamp}, itemIndex);

  const onChangeItemDepositAmount = (formattedAmount, itemIndex) =>
    onChangeItemProgressContent({amount: formattedAmount}, itemIndex);

  const onChangeItemPaymentTerms = (terms, itemIndex) =>
    onChangeItemProgressContent({paymentTerms: terms}, itemIndex);

  const onPressNewProgress = () => {
    const currentProgresses = [...editingDepositInfo?.paymentProgressDtos];
    const today = new Date().getTime();
    const lastMinDate =
      editingDepositInfo?.paymentProgressDtos[editingDepositInfo?.paymentProgressDtos?.length - 1]
        ?.paymentDatetime || today;

    const minDate =
      editingDepositInfo?.paymentProgressDtos?.length > 0
        ? new Date(lastMinDate + DAY_TO_MILISECOND)
        : new Date(editingDepositInfo?.depositPaymentTermFrom || today);

    const newProgress: ProgressDetail = {
      paymentTerms: '',
      remainingPayAmount: remainingDepositAmount,
      paymentDatetime: minDate?.getTime(),
      amount: '',
      minDate,
    };

    LayoutAnimation.configureNext(LayoutAnimation.create(200, 'linear', 'opacity'));
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        paymentProgressDtos: [...currentProgresses, newProgress],
      },
    });
  };

  const onPressEraseProgress = progressIndex => {
    const today = new Date().getTime();

    const updatedProgress = editingDepositInfo?.paymentProgressDtos?.filter(
      (e, index) => index !== progressIndex,
    );

    let lastMinDate = editingDepositInfo?.depositPaymentTermFrom || today;
    let totalRemaining = editingDepositInfo?.closingPrice;
    updatedProgress?.forEach((e, index) => {
      const depositAmount = NumberUtils.parseIntValue(e.amount);
      const remainingAmount = totalRemaining - depositAmount;
      const maxDate = editingDepositInfo?.depositPaymentTermTo?.depositPaymentTermTo;

      totalRemaining = remainingAmount;

      e.remainingPayAmount = remainingAmount;
      e.minDate = lastMinDate;

      if (index === 0) {
        e.maxDate = new Date(maxDate);
      }

      lastMinDate = Math.min(
        e.paymentDatetime + DAY_TO_MILISECOND,
        editingDepositInfo?.depositPaymentTermTo,
      );
    });

    LayoutAnimation.configureNext(LayoutAnimation.create(200, 'linear', 'opacity'));
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        paymentProgressDtos: updatedProgress,
      },
    });
  };

  const onPickNotarizeDate = date => {
    const timestamp = dateToTimestamp(date);
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [DEPOSIT_INPUTS2.notarizationDatetime]: timestamp,
      },
    });
  };

  const onChangeNotaryOffice = text => {
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [DEPOSIT_INPUTS2.notaryOffice]: text,
      },
    });
  };

  const onPressDownloadContract = async () => {
    getFileUrl(Configs.depositContactTradingTemplate)
      .then(async fileUrl => {
        await downloadFileAzure(fileUrl, 'HopDongDatCoc_Kytay.docx');
      })
      .catch(err => {
        logService.log('Download file error: ', err);
      });
  };

  const onChangeNote = text =>
    dispatch({
      type: TradingDepositAction.UPDATE_DEPOSIT_INFO,
      payload: {
        [DEPOSIT_INPUTS2.depositNote]: text,
      },
    });

  return {
    showAddPaymentProgressBtn,
    invalidPaymentDatetime,
    handleOnSelectedImages,
    onChangeItemPaymentDatetime,
    onChangeItemDepositAmount,
    onChangeItemPaymentTerms,
    onPressNewProgress,
    onPressEraseProgress,
    onPickNotarizeDate,
    onChangeNotaryOffice,
    onPressDownloadContract,
    onChangeNote,
  };
};

export {useTradingDepositInput2};
