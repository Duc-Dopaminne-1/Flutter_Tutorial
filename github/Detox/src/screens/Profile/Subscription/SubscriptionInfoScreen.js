import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, {useReducer, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

import {usePayAgentSubscriptionTransctionMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {getAppLanguage} from '../../../appData/appSettings/selectors';
import {
  CONSTANTS,
  FETCH_POLICY,
  PAYMENT_METHODS,
  SUBSCRIPTION_ACTION,
  SUBSCRIPTION_PACKAGE_ID,
  SUBSCRIPTION_RESULT_TYPE,
} from '../../../assets/constants';
import {getLocale, translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import {FORMAT_DATE} from '../../../utils/TimerCommon';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';
import SubscriptionInfoContainer from './components/SubscriptionInfoContainer';
import SubscriptionResultDialog from './components/SubscriptionResultDialog';
import useGetAgentCurrentSubscriptionPackage from './hooks/useGetAgentCurrentSubscriptionPackage';
import useGetAgentLastSubscriptionPackage from './hooks/useGetAgentLastSubscriptionPackage';
import {getSubscriptionNextTStartDate} from './Selectors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
  },
  buttonPay: {
    ...commonStyles.buttonConfirm,
    height: CONSTANTS.INPUT_HEIGHT,
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonPayTitle: {
    ...commonStyles.txtFontSize14,
    ...FONTS.bold,
  },
});

function reducer(state, action) {
  const newState = {...state};
  switch (action.type) {
    case SUBSCRIPTION_ACTION.SET_AGREEMENTS_CONFIRMATION_STATE:
      return {...newState, userConfirmedAgreements: action.payload};
    case SUBSCRIPTION_ACTION.UPDATE_SUBSCRIPTION_STATUS:
      return {...newState, ...action.payload};
    default:
      return newState;
  }
}

const mapStateToPayAgentSubscriptionTransactionInput = (state, languageCode) => {
  const {
    nextSubscriptionPackageDetail: {packageId: nextPackageId = ''},
    currentSubscriptionPackageDetail: {packageId: currentPackageId = ''},
    lastSubscriptionPackageStatus: {lastPackageEndTime},
    currentSubscriptionPackageStatus: {currentPackageEndTime},
  } = state ?? {};
  const purchaseDate = moment().utcOffset(0).startOf('day').valueOf(); // in miliseconds
  const isCurrentSubscriptionPackagePremium = currentPackageId === SUBSCRIPTION_PACKAGE_ID.PREMIUM;
  const startDate = getSubscriptionNextTStartDate({
    isCurrentSubscriptionPackagePremium,
    currentPackageEndTime,
    lastPackageEndTime,
  });
  const subscriptionPackageId = nextPackageId;
  const locale = languageCode;
  return {
    purchaseDate,
    startDate,
    subscriptionPackageId,
    locale,
  };
};

const initialState = {
  currentSubscriptionPackageDetail: {},
  currentSubscriptionPackageStatus: {},
  nextSubscriptionPackageDetail: {},
  lastSubscriptionPackageStatus: {},
  lastSubscriptionPackageDetail: {},
  paymentMethodId: PAYMENT_METHODS.transfer.id,
  userConfirmedAgreements: false,
};

const SubscriptionInfoScreen = ({navigation}) => {
  const {track} = useAnalytics();
  const appLanguage = useSelector(getAppLanguage);
  const languageCode = getLocale(appLanguage);
  const [state, dispatch] = useReducer(reducer, {...initialState});
  const shouldDisablePaymentButton =
    !state.userConfirmedAgreements || state.paymentMethodId === PAYMENT_METHODS.cash.id;

  const [show, setShow] = useState({showPopup: false});
  const setSubscriptionInfo = value => {
    dispatch({
      type: SUBSCRIPTION_ACTION.UPDATE_SUBSCRIPTION_STATUS,
      payload: value,
    });
  };

  const handleOnGetCurrentSubscriptionPackage = status => {
    setSubscriptionInfo({currentSubscriptionPackageStatus: status});
  };
  const handleOnGetDetailCurrentSubscriptionPackage = details => {
    setSubscriptionInfo({currentSubscriptionPackageDetail: details});
  };
  const handleOnGetLastSubscriptionPackage = status => {
    setSubscriptionInfo({lastSubscriptionPackageStatus: status});
  };
  const handleOnGetDetailLastSubscriptionPackage = details => {
    setSubscriptionInfo({lastSubscriptionPackageDetail: details});
  };
  const handleOnGetNextSubscriptionPackageDetail = details => {
    setSubscriptionInfo({nextSubscriptionPackageDetail: details});
  };
  const [startGetAgentLastSubscriptionPackageDetails] = useGetAgentLastSubscriptionPackage({
    onSuccessGetLastSubPackage: handleOnGetLastSubscriptionPackage,
    onSuccessGetLastSubPackageDetail: handleOnGetDetailLastSubscriptionPackage,
    onSuccessGetNextSubPackageDetails: handleOnGetNextSubscriptionPackageDetail,
  });
  const [startGetAgentCurrentSubscriptionPackageDetails] = useGetAgentCurrentSubscriptionPackage({
    onSuccessGetCurrentSubPackage: handleOnGetCurrentSubscriptionPackage,
    onSuccessGetCurrentSubPackageDetail: handleOnGetDetailCurrentSubscriptionPackage,
  });

  const onSuccessPayAgentSubscriptionTransaction = payTransactionResponse => {
    if (!isEmpty(payTransactionResponse)) {
      navigation.navigate(ScreenIds.SubscriptionPaymentScreen, {payTransactionResponse});
    }
  };

  const onErrorSubscriptionTransaction = () => {
    setShow({showPopup: true});
  };

  const {startApi: payAgentSubscriptionTransaction} = useGraphqlApiLazy({
    graphqlApiLazy: usePayAgentSubscriptionTransctionMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'payAgentSubscriptionTransction',
    onSuccess: onSuccessPayAgentSubscriptionTransaction,
    showSpinner: true,
    onError: onErrorSubscriptionTransaction,
  });

  useMount(() => {
    startGetAgentCurrentSubscriptionPackageDetails();
    startGetAgentLastSubscriptionPackageDetails();
  });

  const onPressPay = () => {
    track(TrackingActions.topenerUpgradePayment, {
      subscription_name: state?.nextSubscriptionPackageDetail?.packageName,
      period: `${state?.nextSubscriptionPackageDetail?.packageValidDays} Ngày`,
      expire_date: moment(state?.currentSubscriptionPackageStatus?.currentPackageEndTime).format(
        FORMAT_DATE.SHORT_DDMMYYYY,
      ),
      effective_from: state?.nextPackageStartDate,
      effective_to: state?.nextPackageEndDate,
      payment_method:
        state?.paymentMethodId === PAYMENT_METHODS.cash.id
          ? PAYMENT_METHODS.cash.description
          : PAYMENT_METHODS.transfer.description,
    });

    const input = mapStateToPayAgentSubscriptionTransactionInput(state, languageCode);
    payAgentSubscriptionTransaction({variables: {input}});
  };

  const onConfirmResultDialog = () => {
    setShow({showPopup: false});
  };

  const onGoBack = () => {
    navigation.goBack();
  };
  return (
    <BaseScreen
      title={translate(STRINGS.TOPENER_SUBSCRIPTION_FEE_INFO)}
      containerStyle={styles.container}
      onBackPress={onGoBack}>
      <SubscriptionInfoContainer state={state} dispatch={dispatch} />
      <View style={commonStyles.footerContainer}>
        <CustomButton
          title={translate(STRINGS.PAY)}
          titleColor={shouldDisablePaymentButton ? COLORS.GRAY_A3 : COLORS.NEUTRAL_WHITE}
          titleStyle={styles.buttonPayTitle}
          style={[
            styles.buttonPay,
            shouldDisablePaymentButton
              ? {backgroundColor: COLORS.GREY_ED}
              : {backgroundColor: COLORS.PRIMARY_A100},
          ]}
          disabled={shouldDisablePaymentButton}
          onPress={onPressPay}
        />
      </View>
      <View style={commonStyles.separatorRow16} />
      <SubscriptionResultDialog
        data={show}
        onPressButton={onConfirmResultDialog}
        navigation={navigation}
        type={SUBSCRIPTION_RESULT_TYPE.FAILED}
      />
    </BaseScreen>
  );
};

export default SubscriptionInfoScreen;
