import React, {useContext, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, View} from 'react-native';

import {PaymentMethod, TransactionType} from '../../api/graphql/generated/graphql';
import {AppContext} from '../../appData/appContext/useAppContext';
import {PAGE_CHILD_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import CustomButton from '../../components/Button/CustomButton';
import ModalWithModalize from '../../components/Modal/ModalWithModalize';
import {useAgreePolicy} from '../../hooks/useAgreePolicy';
import ArrayUtils from '../../utils/ArrayUtils';
import {useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';
import PaymentMethodModalContainer from './components/PaymentMethodModalContainer';
import PaymentOptionView from './components/PaymentOptionView';
import {useGetTransactionPaymentConfigs} from './hooks/useGetTransactionPaymentConfigs';
import {customListTopenLandOffices, mapAvailablePaymentMethods} from './utils';

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
  titlePrice: {...FONTS.regular, fontSize: 18, color: COLORS.TEXT_DARK_10},
  price: {...FONTS.bold, fontSize: 18, color: COLORS.RED_5B},
});

const Price = ({price}) => {
  return (
    <View style={[HELPERS.row, HELPERS.selfCenter]}>
      <Text style={styles.titlePrice}>{`${translate(STRINGS.PRICE)}: `}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
};

const SelectPaymentMethodContainer = ({
  topenLandOffices,
  paymentMethods,
  onPressPayment,
  price,
  onChosenPaymentMethod = newMethodList => {},
  showPopup = () => {},
  onPressHyperLink,
  agreePolicy = {isAgree: false, setAgree: () => {}},
  transactionType,
}) => {
  const userHasntChosenTopenLandOffice =
    ArrayUtils.hasArrayData(topenLandOffices) &&
    topenLandOffices.filter(e => e.checked)?.length === 0;

  const userChoseToPayCash = paymentMethods?.find(
    e => e?.paymentMethod === PaymentMethod.Cash,
  )?.checked;

  const shouldDisablePayButton =
    !agreePolicy.isAgree || (userChoseToPayCash && userHasntChosenTopenLandOffice);

  return (
    <>
      <PaymentOptionView
        transactionType={transactionType}
        topenLandOffices={topenLandOffices}
        paymentMethods={paymentMethods}
        onChosenPaymentMethod={onChosenPaymentMethod}
        showPopup={showPopup}
        isAgree={agreePolicy.isAgree}
        checkValue={agreePolicy.setAgree}
        onPressHyperLink={onPressHyperLink}
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
        <Price price={price} />
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

const getLayoutProps = transactionType => {
  const props = {
    screenTitle: '',
  };

  switch (transactionType) {
    case TransactionType.Supportservice:
      props.screenTitle = translate('payment.supportService.selectMethod.header');
      break;
    case TransactionType.Booking:
    case TransactionType.Deposit:
    default:
      props.screenTitle = translate(STRINGS.PAYMENT_METHOD);
      break;
  }

  return props;
};

const CommonSelectPaymentMethodScreen = ({navigation, route}) => {
  const {
    transactionType,
    price,
    onPayByTransfer,
    onPayByCash,
    onPayByEWallet,
  }: {
    transactionType: TransactionType,
    price: String,
    onPayByCash: Function,
    onPayByEWallet: Function,
    onPayByTransfer: Function,
  } = route?.params;

  const layoutProps = getLayoutProps(transactionType);

  const modalRef = useRef(null);
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();

  const [state, setState] = useState({
    paymentMethods: [],
    paymentMethod: null,
    topenLandOffices: [],
    fundAccountId: '',
    cities: masterData?.cities?.edges ?? [],
  });

  const agreePolicy = useAgreePolicy(PAGE_CHILD_TYPE.TERMS_OF_USE);

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

  const onPressPayment = () => {
    const paymentMethod = state?.paymentMethod;
    switch (paymentMethod) {
      case PaymentMethod.Banktransfer:
        onPayByTransfer && onPayByTransfer();
        return;
      case PaymentMethod.Cash:
        onPayByCash && onPayByCash();
        return;
      case PaymentMethod.Ewallet:
        onPayByEWallet && onPayByEWallet();
        return;
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
    setState({...state, paymentMethods: newList, paymentMethod: chosenItem?.id});
  };

  const onChosenTopenLandOffice = (newList: Array) => {
    const selectedItem = newList.find(e => e.checked === true);
    setState({...state, topenLandOffices: newList, fundAccountId: selectedItem?.fundAccountId});
    hidePopup();
  };

  const onPressHyperLink = () => {
    navigation.navigate(ScreenIds.PageDetail, {
      title: '',
      isShowDate: false,
      pageDetail: {body: agreePolicy.html},
    });
  };

  useMount(() => {
    getPaymentConfigsByTransaction({
      transactionType,
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
      title={layoutProps.screenTitle}
      testID={ScreenIds.SelectPaymentMethod}
      modals={modals}>
      {loading && (
        <View style={HELPERS.fillCenter}>
          <Text style={styles.message}>{translate(STRINGS.LOADING)}</Text>
        </View>
      )}
      {!loading && (
        <SelectPaymentMethodContainer
          topenLandOffices={state.topenLandOffices}
          paymentMethods={state.paymentMethods}
          price={price}
          onPressHyperLink={onPressHyperLink}
          agreePolicy={agreePolicy}
          onPressPayment={onPressPayment}
          onChosenPaymentMethod={onChosenPaymentMethod}
          showPopup={showPopup}
          transactionType={transactionType}
        />
      )}
    </BaseScreen>
  );
};

export default CommonSelectPaymentMethodScreen;
