import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {FONTS} from '../../../../assets/theme/fonts';
import {commonStyles} from '../../../../assets/theme/styles';
import TextView from '../../../../components/TextView';

const styles = StyleSheet.create({
  textHeader1: {
    ...FONTS.bold,
    ...FONTS.fontSize18,
  },
});

const RequestBuyerInfoView = ({state}) => {
  const {
    buyerFullName = '',
    buyerPhoneNumber = '',
    buyerEmail = '',
  } = state.contactTradingInfo ?? {};
  const SYMBOL_COLON = ':';
  return (
    <>
      <Text style={styles.textHeader1}>{translate(STRINGS.REQUEST_BUYER_INFO)}</Text>
      <View style={commonStyles.separatorRow16} />
      <TextView title={translate(STRINGS.FULLNAME) + SYMBOL_COLON} value={buyerFullName} />
      <View style={commonStyles.separatorRow16} />
      <TextView title={translate(STRINGS.PHONE_NUMBER) + SYMBOL_COLON} value={buyerPhoneNumber} />
      <View style={commonStyles.separatorRow16} />
      <TextView title={translate(STRINGS.EMAIL) + SYMBOL_COLON} value={buyerEmail} />
    </>
  );
};

export default RequestBuyerInfoView;
