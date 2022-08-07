import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import moment from 'moment';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {SUBSCRIPTION_PACKAGE_ID, SUBSCRIPTION_STATUS_ID} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import TextView from '../../../components/TextView';
import {FORMAT_DATE} from '../../../utils/TimerCommon';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';

const styles = StyleSheet.create({
  shadowContainer: {
    ...commonStyles.shadowBoxSubscription,
    shadowColor: COLORS.SUBSCRIPTION_CARD_SHADOW_COLOR,
  },
  cardContainer: {
    // minHeight: 343,
    paddingBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
    overflow: 'hidden',
  },
  headerContainer: {
    ...METRICS.horizontalPadding,
    justifyContent: 'center',
    paddingVertical: 22,
  },
  infoContainer: {
    ...HELPERS.fill,
    ...METRICS.horizontalPadding,
  },
  descroptionText: {
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
    alignSelf: 'flex-start',
  },
  separatorRow40: {
    height: 40,
  },
  payText: {
    ...FONTS.bold,
    ...FONTS.fontSize18,
  },
  expiredDateNotify: {
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
    color: COLORS.PRIMARY_A100,
  },
  validDaysText: {
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
  },
  headerText: {
    fontSize: 22,
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
  },
  separatorRow18: {
    height: 18,
  },
  extendSubscriptionButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    borderWidth: SIZES.BORDER_WIDTH_1,
  },
  extendSubscriptionText: {
    ...commonStyles.txtFontSize14,
    ...FONTS.bold,
  },
  expiredDate: {
    color: COLORS.STATE_ERROR,
  },
});

const checkHeaderBackground = ({
  isPackageExpired,
  isPackageUnlimited,
  isPackagePremium,
  isPackageTrial,
  isPackageExpiringSoon,
  isPackageStillValid,
}) => {
  switch (true) {
    case isPackageUnlimited:
      return {backgroundColor: COLORS.BLUE_D8};
    case isPackageExpiringSoon:
      return {backgroundColor: COLORS.GOLD_ED};
    case isPackageExpired:
      return {backgroundColor: COLORS.GRAY_97};
    case isPackageTrial && isPackageStillValid:
      return {backgroundColor: COLORS.GREEN_6FCF97};
    case isPackagePremium && isPackageStillValid:
      return {backgroundColor: COLORS.PRIMARY_A100};
    default:
      return {backgroundColor: COLORS.GRAY_97};
  }
};

const getSubscriptionExpirationDescription = ({isPackageExpired, isPackageStillValid}) => {
  if (isPackageExpired || !isPackageStillValid) {
    return translate('subscription.expired');
  }
  return translate('subscription.expireDate');
};

const getSubscriptionTitle = ({isPackageUnlimited, isPackagePremium, isPackageTrial}) => {
  switch (true) {
    case isPackageTrial:
      return translate('subscription.packageTitle.trial');
    case isPackageUnlimited:
      return translate('subscription.packageTitle.unlimited');
    case isPackagePremium:
      return translate('subscription.packageTitle.official');
    default:
      return translate(STRINGS.TOPENER_CAP);
  }
};

const getSubscriptionDescription = isPackageUnlimited => {
  return isPackageUnlimited
    ? translate('subscription.packageDescription.youAreTopenerEmployee')
    : translate(STRINGS.SUBSCRIPTION_STATUS_DESCRIPTION);
};

const getSubscriptionExpirationTextStyle = isPackageExpired => {
  return isPackageExpired ? styles.expiredDate : {};
};

const SubscriptionCardView = ({state}) => {
  const {track} = useAnalytics();
  const navigation = useNavigation();

  const {
    currentPackageId = '',
    validDaysLeft: currentValidDaysLeft = 0,
    currentPackageEndTime = 0,
    agentSubscriptionPackageId: currentAgentSubscriptionPackageId = null,
    agentSubscriptionPackageStatus = '',
  } = state.currentSubscriptionPackageStatus ?? {};

  const {packageName: currentPackageName} = state.currentSubscriptionPackageDetail ?? {};

  const {agentSubscriptionPackageId: lastAgentSubscriptionPackageId = null} =
    state.lastSubscriptionPackageStatus ?? {};

  const userHasExtendedSubscription =
    !!lastAgentSubscriptionPackageId &&
    currentAgentSubscriptionPackageId !== lastAgentSubscriptionPackageId;

  const isPackageUnlimited = currentPackageId === SUBSCRIPTION_PACKAGE_ID.UNLIMITED;

  const isPackagePremium = currentPackageId === SUBSCRIPTION_PACKAGE_ID.PREMIUM;

  const isPackageTrial = currentPackageId === SUBSCRIPTION_PACKAGE_ID.TRIAL;

  const isPackageExpiringSoon =
    agentSubscriptionPackageStatus === SUBSCRIPTION_STATUS_ID.EXPIRING_SOON;

  const isPackageExpired = agentSubscriptionPackageStatus === SUBSCRIPTION_STATUS_ID.EXPIRED;

  const isPackageStillValid =
    agentSubscriptionPackageStatus === SUBSCRIPTION_STATUS_ID.NOT_EXPRIED_YET ||
    agentSubscriptionPackageStatus === SUBSCRIPTION_STATUS_ID.EXPIRING_SOON;

  const expiredDate = isPackageUnlimited
    ? '-'
    : moment(currentPackageEndTime).format(FORMAT_DATE.SHORT_DDMMYYYY);

  const subscriptionName = getSubscriptionTitle({
    isPackageUnlimited,
    isPackagePremium,
    isPackageTrial,
    packageName: currentPackageName,
  });

  const subscriptionDescription = getSubscriptionDescription(isPackageUnlimited);

  const subscriptionValidDaysLeftText = isPackageUnlimited
    ? translate('subscription.packageDuration.unlimited')
    : translate(STRINGS.VALID_FOR, {validDaysLeft: currentValidDaysLeft});

  const subscriptionExpirationDescription = getSubscriptionExpirationDescription({
    isPackageExpired,
    isPackageStillValid,
  });

  const expirationDateTextStyle = getSubscriptionExpirationTextStyle(isPackageExpired);

  // <style>
  const headerBackground = checkHeaderBackground({
    isPackageExpired,
    isPackagePremium,
    isPackageTrial,
    isPackageUnlimited,
    isPackageExpiringSoon,
    isPackageStillValid,
  });

  const extendSubscriptionButtonBorderColor = userHasExtendedSubscription
    ? {borderColor: COLORS.BRAND_GREY}
    : {borderColor: COLORS.PRIMARY_A100};

  const extendSubscriptionButtonTitleColor = userHasExtendedSubscription
    ? {color: COLORS.BRAND_GREY}
    : {color: COLORS.PRIMARY_A100};
  // </style>

  const onPressExtendSubscription = () => {
    track(TrackingActions.topenerUpgradeClicked, {
      status: subscriptionName,
      valid_time: `${currentValidDaysLeft} Ngày`,
      expire_date: expiredDate,
    });

    navigation.navigate(ScreenIds.SubscriptionStack);
  };

  return (
    <View style={Platform.OS === 'ios' ? styles.shadowContainer : {}}>
      <View style={[styles.cardContainer, Platform.OS === 'android' ? styles.shadowContainer : {}]}>
        <View style={[styles.headerContainer, headerBackground]}>
          <Text style={styles.headerText}>{subscriptionName}</Text>
        </View>
        <View style={commonStyles.separatorRow8} />
        <View style={METRICS.horizontalPadding}>
          <Text style={styles.descroptionText}>{subscriptionDescription}</Text>
        </View>
        <View style={[styles.infoContainer, isPackageUnlimited && HELPERS.mainCenter]}>
          {isPackageUnlimited || (
            <>
              <View style={styles.separatorRow40} />
            </>
          )}
          <View>
            <Text style={styles.payText}>{translate(STRINGS.PAY)}</Text>
            <View style={commonStyles.separatorRow8} />
            <View style={HELPERS.row}>
              <Text style={styles.validDaysText}>{subscriptionValidDaysLeftText}</Text>
            </View>
          </View>
          {isPackageUnlimited || (
            <>
              <View style={commonStyles.separatorRow16} />
              <TextView
                title={subscriptionExpirationDescription + ':'}
                value={expiredDate}
                titleStyle={{...styles.expiredDateNotify, ...expirationDateTextStyle}}
                valueStyle={{...styles.expiredDateNotify, ...expirationDateTextStyle}}
                separatorWidth={4}
              />
              <View style={styles.separatorRow18} />
            </>
          )}
        </View>
        {isPackageUnlimited || (
          <CustomButton
            style={{...styles.extendSubscriptionButton, ...extendSubscriptionButtonBorderColor}}
            title={
              isPackageTrial
                ? translate('subscription.packageTitle.activateTopener')
                : translate(STRINGS.EXTEND_TOPENER_SUBSCRIPTION)
            }
            titleStyle={{...styles.extendSubscriptionText, ...extendSubscriptionButtonTitleColor}}
            titleColor={COLORS.PRIMARY_A100}
            onPress={onPressExtendSubscription}
            disabled={userHasExtendedSubscription}
          />
        )}
      </View>
    </View>
  );
};

export default SubscriptionCardView;
