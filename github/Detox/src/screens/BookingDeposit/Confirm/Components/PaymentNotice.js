import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {PaymentUnit} from '../../../../api/graphql/generated/graphql';
import {HOTLINE_NUMBER, PAGE_CHILD_TYPE, PAGE_TYPE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {commonStyles} from '../../../../assets/theme/styles';
import ScreenIds from '../../../ScreenIds';

const PAYMENT_GUIDE_URL_INFO = {
  title: translate('common.paymentInstruction'),
  pageType: PAGE_CHILD_TYPE.PAYMENT_GUIED,
  objectType: PAGE_TYPE.GUIDE,
};

const styles = StyleSheet.create({
  infoText: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.BLACK_33,
    textAlign: 'justify',
  },
  textRed: {
    color: COLORS.STATE_ERROR,
  },
  textPressHere: {
    textDecorationLine: 'underline',
    color: COLORS.PRIMARY_A100,
  },
});

const NoticeBankTransfer = () => {
  return (
    <View>
      <Text style={styles.textRed}>{translate('transaction.paymentNotice1')}</Text>
      <View style={commonStyles.separatorRow8} />
      <Text style={styles.infoText}>{translate('transaction.paymentNotice2')}</Text>
      <View style={commonStyles.separatorRow24} />
    </View>
  );
};

const PaymentNotice = ({navigation, paymentUnit = PaymentUnit.Fast}) => {
  const onPressShowPaymentGuide = item => {
    navigation?.navigate(ScreenIds.PageDetailQuery, {
      query: {
        pageType: item.pageType,
        objectType: item.objectType,
      },
      title: item.title,
    });
  };
  return (
    <View style={styles.infoContainer}>
      {paymentUnit === PaymentUnit.Bidv && <NoticeBankTransfer />}
      <Text style={styles.infoText}>
        {translate('transaction.paymentNotice3')}
        <Text style={FONTS.bold}>{HOTLINE_NUMBER}</Text> {translate('common.or')}{' '}
        <Text
          style={styles.textPressHere}
          onPress={() => onPressShowPaymentGuide(PAYMENT_GUIDE_URL_INFO)}>
          {translate('transaction.paymentNotice4')}
        </Text>
        {translate('transaction.paymentNotice5')}
      </Text>
    </View>
  );
};

export default PaymentNotice;
