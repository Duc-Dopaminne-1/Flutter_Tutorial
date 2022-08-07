import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {HOTLINE_NUMBER_FORMAT, SUBSCRIPTION_RESULT_TYPE} from '../../../../assets/constants';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomDialog from '../../../../components/CustomDialog';
import ScreenIds from '../../../ScreenIds';

const styles = StyleSheet.create({
  text: {
    ...commonStyles.blackText14,
    textAlign: 'center',
  },
  hotline: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.PRIMARY_A100,
  },
  successfulTitle: {
    ...FONTS.bold,
    fontSize: 21,
    color: COLORS.GREEN_6FCF97,
    textAlign: 'center',
  },
  failedTitle: {
    ...FONTS.bold,
    fontSize: 21,
    color: COLORS.STATE_ERROR,
    textAlign: 'center',
  },
  image: {
    height: 48,
    width: 48,
  },
});
const ResultView = ({type}) => {
  switch (type) {
    case SUBSCRIPTION_RESULT_TYPE.SUCCESSFUL:
      return (
        <View style={HELPERS.fillColCenter}>
          <Image
            source={IMAGES.IC_SUCCESS_FILL}
            style={[styles.image, {tintColor: COLORS.GREEN_6FCF97}, METRICS.smallMarginBottom]}
            resizeMode="contain"
          />
          <Text style={styles.successfulTitle}>
            {translate('subscription.transaction.success')}
          </Text>
          <Text style={[styles.text, METRICS.normalMediumMarginTop]}>
            {translate('contactTrading.alert.already.message')}
            <Text style={styles.hotline}>{HOTLINE_NUMBER_FORMAT}</Text>
          </Text>
        </View>
      );
    case SUBSCRIPTION_RESULT_TYPE.FAILED:
      return (
        <View style={HELPERS.fillColCenter}>
          <Image
            source={IMAGES.IC_CIRCLE_ALERT}
            style={[styles.image, METRICS.smallMarginBottom]}
            resizeMode="contain"
          />
          <Text style={styles.failedTitle}>{translate('subscription.transaction.failed')}</Text>
          <Text style={[styles.text, METRICS.normalMediumMarginTop]}>
            {translate('contactTrading.alert.already.message')}
            <Text style={styles.hotline}>{HOTLINE_NUMBER_FORMAT}</Text>
          </Text>
        </View>
      );
    default:
      return (
        <View style={HELPERS.fillColCenter}>
          <Image
            source={IMAGES.IC_CIRCLE_ALERT}
            style={[styles.image, METRICS.smallMarginBottom]}
            resizeMode="contain"
          />
          <Text style={styles.failedTitle}>{translate('subscription.transaction.failed')}</Text>
          <Text style={[styles.text, METRICS.normalMediumMarginTop]}>
            {translate('subscription.transaction.timeoutFirst')}
            <Text style={styles.hotline}>{` ${HOTLINE_NUMBER_FORMAT} `}</Text>
            {translate('subscription.transaction.timeoutSecond')}
          </Text>
        </View>
      );
  }
};

const SubscriptionResultDialog = ({data, onPressButton, navigation, type, isTesting = false}) => {
  const titleOK = data?.isSuccess
    ? translate('payment.viewManagePayment')
    : translate(STRINGS.RETURN_HOME);
  return (
    <CustomDialog
      isVisible={data?.showPopup}
      okText={titleOK}
      onOkHandler={() => {
        if (!isTesting) {
          onPressButton && onPressButton();
          navigation?.navigate(ScreenIds.Home);
          if (data?.isSuccess) {
            navigation?.navigate(ScreenIds.ManagePayment);
          }
        }
      }}
      children={<ResultView type={type} />}
    />
  );
};

export default SubscriptionResultDialog;
