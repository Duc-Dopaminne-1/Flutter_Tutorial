import {useAnalytics} from '@segment/analytics-react-native';
import I18n from 'i18n-js';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {PaymentMethod, PaymentUnit, TransactionType} from '../../../api/graphql/generated/graphql';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUser} from '../../../appData/user/selectors';
import {ERROR_CODE_TRANSACTION, PAGE_CHILD_TYPE, TRANSACTION_MODE} from '../../../assets/constants';
import {getLanguageInfo, translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import {useAgreePolicy} from '../../../hooks/useAgreePolicy';
import ArrayUtils from '../../../utils/ArrayUtils';
import {useMount} from '../../commonHooks';
import {useCheckBooking} from '../../ProjectDetail/hooks/useCheckBooking';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';
import {Price} from '../ConfirmProperty/ConfirmPropertyComponents';
import {useGetTransactionPaymentConfigs} from '../Payment/useGetTransactionPaymentConfigs';
import {BookingContext} from '../useBooking';
import {useCheckLockPropertyPost} from '../useCheckLockPropertyPost';
import PaymentMethodModalContainer from './Components/PaymentMethodModalContainer';
import PaymentOption from './Components/PaymentOption';
import {customListTopenLandOffices, mapAvailablePaymentMethods} from './PaymentModels';
import {
  usePayByFastAndGetTransactionInfo,
  usePayByTransferAndGetTransactionInfo,
  useVnpayPayBookingTransaction,
  useVnpayPayDepositTransaction,
} from './useConfirmTransactionAction';

const styles = StyleSheet.create({
  message: {
    ...HELPERS.selfCenter,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
  },
  buttonNext: {
    ...commonStyles.disabledButtonNext,
    backgroundColor: COLORS.PRIMARY_A100,
  },
});

const navigateByErrorType = (navigation, errorMessageCode) => {
  if (errorMessageCode === ERROR_CODE_TRANSACTION.BOOKING_OUT_TIME) {
    navigation.navigate(ScreenIds.ProjectDetail, {shouldRefresh: true});
  } else if (
    errorMessageCode === ERROR_CODE_TRANSACTION.ALREADY_SALE_1 ||
    errorMessageCode === ERROR_CODE_TRANSACTION.ALREADY_SALE_2
  ) {
    navigation.navigate(ScreenIds.Home);
  }
};

const SelectPaymentMethodScreen = ({navigation}) => {
  const modalRef = useRef(null);
  const {track} = useAnalytics();
  const {showErrorAlert, showAppModal, getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const {state: moduleState, setState: setParentState} = useContext(BookingContext);
  const {projectStatus, projectStatusDescription, projectName} = moduleState.project;
  const {propertyPost} = moduleState;
  const saleSeasonId = moduleState.saleSeasonId;
  const {propertyPostId, contextType} = propertyPost;
  const userInfo = useSelector(getUser);
  const agreePolicy = useAgreePolicy(PAGE_CHILD_TYPE.TERMS_OF_USE);

  const [state, setState] = useState({
    paymentMethods: [],
    paymentMethod: null,
    topenLandOffices: [],
    cities: masterData?.cities?.edges ?? [],
  });

  const onSuccessTransaction = payTransactionResponse => {
    if (!isEmpty(payTransactionResponse)) {
      navigation.navigate(ScreenIds.PaymentWebview, {payTransactionResponse});
    }
  };
  const onSuccessPayByTransfer = transactionInfoResponse => {
    if (!isEmpty(transactionInfoResponse)) {
      const paymentInfo = {
        ...transactionInfoResponse?.bankPaymentTransferInfoDto,
        transactionId: transactionInfoResponse?.transactionId,
        paymentUnit: PaymentUnit.Bidv,
      };
      navigation.navigate(ScreenIds.PaymentInfo, {
        paymentInfo,
      });
    }
  };
  const onSuccessPayByFast = response => {
    const paymentInfo = {
      ...response?.fastPaymentTransferInfoDto,
      transactionId: response?.transactionId,
      paymentUnit: PaymentUnit.Fast,
    };
    if (!isEmpty(response)) {
      navigation.navigate(ScreenIds.PaymentInfo, {
        paymentInfo,
      });
    }
  };
  const onPressOkErrorDialog = ({errorMessageCode}) => {
    navigateByErrorType(navigation, errorMessageCode);
  };
  const onSuccessGetConfigs = result => {
    const availablePaymentMethods = mapAvailablePaymentMethods(result);
    const findFundAccounts =
      availablePaymentMethods.find(e => e?.paymentMethod === PaymentMethod.Cash)
        ?.transactionPaymentUnitDtos ?? [];
    let defaultSelectedPaymentMethod = null;
    if (ArrayUtils.hasArrayData(availablePaymentMethods)) {
      defaultSelectedPaymentMethod = availablePaymentMethods[0]?.id;
    }
    setState({
      ...state,
      paymentMethods: availablePaymentMethods,
      paymentMethod: defaultSelectedPaymentMethod,
      topenLandOffices: customListTopenLandOffices(findFundAccounts, 'cityId'),
    });
  };

  const {getPaymentConfigsByTransaction, loading} = useGetTransactionPaymentConfigs({
    onSuccess: onSuccessGetConfigs,
  });

  const onErrorTransaction = ({errorMessage, errorMessageCode}) => {
    showAppModal({
      isVisible: true,
      title: translate(STRINGS.DEFAULT_MODAL_TITLE),
      message: errorMessage,
      onOkHandler: () => onPressOkErrorDialog({errorMessageCode}),
    });
  };
  const {vnpayPayBookingTransaction} = useVnpayPayBookingTransaction({
    state: moduleState,
    onSuccess: onSuccessTransaction,
    onError: onErrorTransaction,
  });
  const {vnpayPayDepositTransaction} = useVnpayPayDepositTransaction({
    state: moduleState,
    onSuccess: onSuccessTransaction,
    onError: onErrorTransaction,
  });
  const {bidvPayDepositTransactionAndGetInfo, bidvPayBookingTransactionAndGetInfo} =
    usePayByTransferAndGetTransactionInfo({
      state: moduleState,
      onSuccess: onSuccessPayByTransfer,
      onError: onErrorTransaction,
    });

  const {fastDepositTransactionAndGetInfo, fastBookingTransactionAndGetInfo} =
    usePayByFastAndGetTransactionInfo({
      state: moduleState,
      onSuccess: onSuccessPayByFast,
      onError: onErrorTransaction,
    });

  const onSuccessCheckBookingStatus = () => {
    const paymentInfo = {...moduleState, userInfo};
    switch (state?.paymentMethod) {
      case PaymentMethod.Banktransfer:
        bidvPayBookingTransactionAndGetInfo(paymentInfo);
        return;
      case PaymentMethod.Cash:
        fastBookingTransactionAndGetInfo(paymentInfo);
        return;
      case PaymentMethod.Ewallet:
        vnpayPayBookingTransaction(paymentInfo);
        return;
    }
  };
  const {checkBooking} = useCheckBooking({
    onSuccess: onSuccessCheckBookingStatus,
    onError: errorMessage => {
      showAppModal({
        isVisible: true,
        title: translate('ERROR'),
        message: errorMessage,
        onOkHandler: () => {
          navigation.navigate(ScreenIds.ProjectDetail);
        },
      });
    },
  });

  const onCheckLock = response => {
    if (response?.errorCode !== 0) {
      return;
    }

    const {isLocked} = response;
    if (isLocked) {
      showErrorAlert(
        translate(STRINGS.LOCK_PROPERTY, {
          propertyTypeDescription: propertyPost?.propertyTypeDescription,
        }),
      );
      return;
    }

    const paymentInfo = {...moduleState, userInfo};

    switch (state?.paymentMethod) {
      case PaymentMethod.Banktransfer:
        bidvPayDepositTransactionAndGetInfo(paymentInfo);
        return;
      case PaymentMethod.Cash:
        fastDepositTransactionAndGetInfo(paymentInfo);
        return;
      case PaymentMethod.Ewallet:
        vnpayPayDepositTransaction(paymentInfo);
        return;
    }
  };
  const {checkLockPropertyPost} = useCheckLockPropertyPost({
    propertyPostId,
    onSuccess: onCheckLock,
  });

  const onPressPayment = () => {
    const paymentMethod = state?.paymentMethod;
    setParentState({...moduleState, paymentMethod: paymentMethod});

    track(TrackingActions.projectOrderPaymentConfirmed, {
      project_name: projectName,
      project_status: projectStatusDescription,
      language: getLanguageInfo(I18n.locale).code,
    });

    if (projectStatus === TRANSACTION_MODE.BOOKING) {
      checkBooking({saleSeasonId, propertyPost});
    } else if (projectStatus === TRANSACTION_MODE.DEPOSIT) {
      checkLockPropertyPost();
    }
  };

  const hidePopup = () => {
    modalRef?.current?.close();
  };
  const showPopup = () => {
    modalRef?.current?.open();
    Keyboard.dismiss();
  };

  const onChosenPaymentMethod = newList => {
    const chosenItem = newList?.find(e => e.checked);

    if (chosenItem?.id !== PaymentMethod.Cash) {
      track(TrackingActions.projectOrderPaymentChose, {
        payment_method: chosenItem?.title ?? '',
        topenland_office: '',
      });
    }

    setParentState({...moduleState, paymentMethod: chosenItem?.id});
    setState({...state, paymentMethods: newList, paymentMethod: chosenItem?.id});
  };

  const onChosenTopenLandOffice = (newList: Array) => {
    const chosenTopenlandOffice = newList.find(e => e.checked)?.branchName;

    track(TrackingActions.projectOrderPaymentChose, {
      payment_method: state.paymentMethods.find(e => e?.id === state.paymentMethod)?.title ?? '',
      topenland_office: chosenTopenlandOffice ?? '',
    });

    const selectedItem = newList.find(e => e.checked === true);
    setParentState({...moduleState, fundAccountId: selectedItem?.fundAccountId});
    setState({...state, topenLandOffices: newList});
    hidePopup();
  };

  const onCheckAgreement = () => {
    navigation.navigate(ScreenIds.PageDetail, {
      title: '',
      isShowDate: false,
      pageDetail: {body: agreePolicy.html},
    });
  };

  useMount(() => {
    getPaymentConfigsByTransaction({
      transactionType:
        projectStatus === TRANSACTION_MODE.BOOKING
          ? TransactionType.Booking
          : TransactionType.Deposit,
    });
  });

  const modals = (
    <ModalWithModalize getModalRef={modalRef}>
      <PaymentMethodModalContainer
        title={translate('transaction.pleaseChoosePaymentAddress')}
        state={state}
        onChosenTopenLandOffice={onChosenTopenLandOffice}
      />
    </ModalWithModalize>
  );

  return (
    <BaseScreen
      title={translate(STRINGS.PAYMENT_METHOD)}
      testID={ScreenIds.SelectPaymentMethod}
      modals={modals}>
      {loading && (
        <View style={HELPERS.fillCenter}>
          <Text style={styles.message}>{translate(STRINGS.LOADING)}</Text>
        </View>
      )}
      {!loading && (
        <SelectPaymentMethodContainer
          state={state}
          contextType={contextType}
          price={moduleState?.propertyPost?.bookingFee}
          onCheckAgreement={onCheckAgreement}
          projectStatus={projectStatus}
          agreePolicy={agreePolicy}
          onPressPayment={onPressPayment}
          onChosenPaymentMethod={onChosenPaymentMethod}
          showPopup={showPopup}
        />
      )}
    </BaseScreen>
  );
};

export const SelectPaymentMethodContainer = ({
  state,
  onPressPayment,
  price,
  contextType,
  onCheckAgreement,
  projectStatus,
  agreePolicy = {isAgree: false},
  onChosenPaymentMethod = () => {},
  showPopup = () => {},
}) => {
  const userHasntChosenTopenLandOffice =
    ArrayUtils.hasArrayData(state?.topenLandOffices) &&
    state?.topenLandOffices?.filter(e => e.checked)?.length === 0;

  const userChoseToPayCash = state?.paymentMethods?.find(
    e => e?.paymentMethod === PaymentMethod.Cash,
  )?.checked;

  const shouldDisablePayButton =
    !agreePolicy.isAgree || (userChoseToPayCash && userHasntChosenTopenLandOffice);
  return (
    <>
      <PaymentOption
        state={state}
        projectStatus={projectStatus}
        isAgree={agreePolicy.isAgree}
        checkValue={agreePolicy.setAgree}
        onCheckAgreement={onCheckAgreement}
        onChosenPaymentMethod={onChosenPaymentMethod}
        showPopup={showPopup}
      />
      <View
        style={[
          METRICS.horizontalPadding,
          {
            backgroundColor: COLORS.NEUTRAL_WHITE,
            paddingTop: normal,
            paddingBottom: normal,
          },
        ]}>
        <Price type={contextType} price={price} />
        <CustomButton
          disabled={shouldDisablePayButton}
          style={
            shouldDisablePayButton
              ? [commonStyles.disabledButtonNext]
              : [styles.buttonNext, {marginTop: small}]
          }
          title={translate(STRINGS.PAY)}
          onPress={onPressPayment}
        />
      </View>
    </>
  );
};

export default SelectPaymentMethodScreen;
