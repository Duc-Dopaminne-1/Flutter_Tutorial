import moment from 'moment';
import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {
  APP_CURRENCY,
  DAY_TO_MILISECOND,
  HOTLINE_NUMBER_FORMAT,
  PAYMENT_METHODS,
  SUBSCRIPTION_ACTION,
  SUBSCRIPTION_PACKAGE_ID,
} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import InputSection from '../../../../components/InputSection';
import RadioSelectionsView from '../../../../components/RadioSelectionsView';
import {formatNumberToCurrencyNumber} from '../../../../utils/NumberUtils';
import {FORMAT_DATE} from '../../../../utils/TimerCommon';
import {getSubscriptionNextTStartDate, SubscriptionPaymentOptions} from '../Selectors';

const styles = StyleSheet.create({
  inputHeaderText: {
    ...commonStyles.txtFontSize14,
    ...FONTS.bold,
    color: COLORS.BRAND_GREY,
  },
  untilText: {
    ...METRICS.horizontalMargin,
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
    color: COLORS.GRAY_69,
  },
  noticeText: {
    color: COLORS.GREEN_8E,
    ...FONTS.bold,
    ...commonStyles.txtFontSize14,
  },
  noticeContentText: {
    color: COLORS.GREEN_8E,
    ...FONTS.regular,
    ...commonStyles.txtFontSize14,
    ...HELPERS.fill,
  },
  noticeContainer: {
    ...HELPERS.row,
  },
  separatorLine: {
    height: 1,
    backgroundColor: COLORS.BLUE_D5,
  },
  paymentOfflineInstructionText: {
    ...HELPERS.fill,
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
  },
  agentNumber: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
  inputContainer: {
    backgroundColor: COLORS.GRAY_EF,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    color: COLORS.HINT_TEXT,
  },
  paymentMethodHeaderText: {
    ...FONTS.bold,
    fontSize: 22,
    color: COLORS.BLACK_33,
  },
  exclamationIconContainer: {
    marginTop: 2, // add margin to make the view feels center aligned compared to Text view
    width: 16,
    height: 16,
    borderRadius: SIZES.BORDER_RADIUS_50,
    backgroundColor: COLORS.PRIMARY_A100,
    paddingVertical: 2,
  },
  exclamtionIcon: {
    width: '100%',
    height: '100%',
  },
  agreementText: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
  },
  policy: {
    color: COLORS.PRIMARY_A100,
    textDecorationLine: 'underline',
  },
});

const SubscriptionInfoContainer = ({state, dispatch}) => {
  const {
    nextSubscriptionPackageDetail = {},
    lastSubscriptionPackageStatus: {lastPackageValidDays = 0, lastPackageEndTime = 0},
    currentSubscriptionPackageStatus: {currentPackageId = '', currentPackageEndTime = 0},
    paymentMethodId = null,
    nextPackageStartDate,
    nextPackageEndDate,
    nextPackagePrice,
  } = state;
  const {
    packageName = '',
    packageValidDays: nextPackageValidDays = 0,
    packagePrice = 0,
  } = nextSubscriptionPackageDetail;

  const isCurrentSubscriptionPackageTrial = currentPackageId === SUBSCRIPTION_PACKAGE_ID.TRIAL;

  const setUserConfirmedAgreements = isConfirmed => {
    dispatch({type: SUBSCRIPTION_ACTION.SET_AGREEMENTS_CONFIRMATION_STATE, payload: isConfirmed});
  };

  const updateSubscriptionPackageStatus = status => {
    dispatch({
      type: SUBSCRIPTION_ACTION.UPDATE_SUBSCRIPTION_STATUS,
      payload: status,
    });
  };

  const onChangeSubscriptionStatus = () => {
    const isCurrentSubscriptionPackagePremium =
      currentPackageId === SUBSCRIPTION_PACKAGE_ID.PREMIUM;
    const nextPackageStartDateToMiliseconds = getSubscriptionNextTStartDate({
      isCurrentSubscriptionPackagePremium,
      lastPackageEndTime,
      currentPackageEndTime,
    });
    const nextPackageEndDateToMiliseconds =
      nextPackageStartDateToMiliseconds + nextPackageValidDays * DAY_TO_MILISECOND;
    const startDate = moment(nextPackageStartDateToMiliseconds).format(FORMAT_DATE.SHORT_DDMMYYYY);
    const endDate = moment(nextPackageEndDateToMiliseconds).format(FORMAT_DATE.SHORT_DDMMYYYY);
    const price = formatNumberToCurrencyNumber(packagePrice, 0);

    dispatch({
      type: SUBSCRIPTION_ACTION.UPDATE_SUBSCRIPTION_STATUS,
      payload: {
        nextPackageStartDate: startDate,
        nextPackageEndDate: endDate,
        nextPackagePrice: price,
      },
    });
  };
  useEffect(onChangeSubscriptionStatus, [
    state.lastSubscriptionPackageStatus,
    state.currentSubscriptionPackageStatus,
    state.nextSubscriptionPackageDetail,
  ]);

  const onChoosePaymentMethod = item => {
    updateSubscriptionPackageStatus({paymentMethodId: item.id});
  };

  const isPayOffline = paymentMethodId === PAYMENT_METHODS.cash.id;

  const onCheckConfirmAgreements = isChecked => {
    setUserConfirmedAgreements(isChecked);
  };

  const onPressPaymentPolicy = () => {};

  return (
    <ScrollView>
      <View style={[METRICS.horizontalPadding, METRICS.mediumMarginBottom]}>
        <InputSection
          headerTitle={translate(STRINGS.PACKAGE_NAME)}
          headerStyles={styles.inputHeaderText}
          inputStyle={{...commonStyles.input, ...styles.inputContainer}}
          value={packageName}
          editable={false}
        />
        <InputSection
          headerTitle={translate(STRINGS.DURATION)}
          headerStyles={styles.inputHeaderText}
          inputStyle={{...commonStyles.input, ...styles.inputContainer}}
          value={nextPackageValidDays + ' Ngày'}
          editable={false}
        />
        <Text style={[styles.inputHeaderText, METRICS.smallMarginTop]}>
          {translate(STRINGS.VALID_UNTIL)}
        </Text>
        <View style={[HELPERS.rowStartCenter]}>
          <InputSection
            customStyle={HELPERS.fill}
            inputStyle={{...commonStyles.input, ...styles.inputContainer, ...METRICS.tinyMarginTop}}
            value={nextPackageStartDate}
            editable={false}
          />
          <Text style={styles.untilText}>{translate(STRINGS.TO_CAP)}</Text>
          <InputSection
            customStyle={HELPERS.fill}
            inputStyle={{...commonStyles.input, ...styles.inputContainer, ...METRICS.tinyMarginTop}}
            value={nextPackageEndDate}
            editable={false}
          />
        </View>
        <InputSection
          headerTitle={translate(STRINGS.PACKAGE_PRICE)}
          headerStyles={styles.inputHeaderText}
          inputStyle={{...commonStyles.input, ...styles.inputContainer}}
          value={nextPackagePrice + ' ' + APP_CURRENCY}
          editable={false}
        />
        <InputSection
          headerTitle={translate(STRINGS.VALID_DAYS_LEFT_OF_CURRENT_PACKAGE)}
          headerStyles={styles.inputHeaderText}
          inputStyle={{...commonStyles.input, ...styles.inputContainer}}
          value={lastPackageValidDays + ' Ngày'}
          editable={false}
        />
        <View style={commonStyles.separatorRow8} />
        {!isCurrentSubscriptionPackageTrial && (
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeText}>{translate(STRINGS.NOTED)} : </Text>
            <Text style={styles.noticeContentText}>{translate(STRINGS.SUBSCRIPTION_NOTICE)}</Text>
          </View>
        )}
        <RadioSelectionsView
          headerTitle={translate(STRINGS.PAYMENT_METHOD)}
          headerStyle={styles.paymentMethodHeaderText}
          data={SubscriptionPaymentOptions}
          onChosen={onChoosePaymentMethod}
        />
        <View style={commonStyles.separatorRow16} />
        <View style={styles.separatorLine} />
        {isPayOffline && (
          <>
            <View style={commonStyles.separatorRow8} />
            <View style={[HELPERS.fillRow]}>
              <View style={styles.exclamationIconContainer}>
                <Image
                  source={IMAGES.IC_EXCLAMATION}
                  style={styles.exclamtionIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={commonStyles.separatorColumn8} />
              <Text style={styles.paymentOfflineInstructionText}>
                {translate(STRINGS.PAYMENT_OFFLINE_INSTRUCTION)}{' '}
                <Text style={styles.agentNumber}>{HOTLINE_NUMBER_FORMAT}</Text>
              </Text>
            </View>
          </>
        )}
        <View style={commonStyles.separatorRow24} />
        <CustomCheckbox
          titleView={
            <Text style={styles.agreementText}>
              {translate('subscription.agreeToTopenlandPaymentPolicy')}{' '}
              <Text style={styles.policy} onPress={onPressPaymentPolicy}>
                {translate('subscription.agreeToTopenlandPaymentPolicy2')}
              </Text>{' '}
              {translate('subscription.agreeToTopenlandPaymentPolicy3')}
            </Text>
          }
          onChange={onCheckConfirmAgreements}
          isTitleInsideButton={false}
          disabled={isPayOffline}
          shouldGetValueOutSide={isPayOffline}
          parentCheckedValue={false}
        />
      </View>
    </ScrollView>
  );
};

export default SubscriptionInfoContainer;
