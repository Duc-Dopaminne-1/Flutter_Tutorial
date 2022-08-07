import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import {NOT_ANS} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, METRICS, tiny} from '../../assets/theme/metric';
import {getTransactionDateTimeString} from '../../utils/TimerCommon';
import {getUserFullName} from '../../utils/UserAgentUtil';
import TransactionUtil from './TransactionUtil';

const styles = StyleSheet.create({
  container: {
    ...METRICS.padding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 4,
  },
  name: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.BLACK_33,
  },
  projectName: {
    ...FONTS.semiBold,
    fontSize: 14,
    color: COLORS.BLACK_33,
    marginEnd: medium,
    marginTop: tiny,
  },
  date: {
    ...FONTS.regular,
    marginEnd: medium,
    fontSize: SIZES.FONT_12,
    color: COLORS.GREY_82,
    marginTop: tiny,
  },
  codeSeparator: {
    color: COLORS.GREY_82,
  },
  icon: {
    position: 'absolute',
    end: 24,
    top: 38,
  },
  transactionStatus: {
    ...FONTS.regular,
    ...METRICS.horizontalMargin,
    fontSize: 10,
    color: COLORS.BLACK_4F,
    textAlign: 'center',
  },
  transactionStatusContainer: {
    ...HELPERS.center,
    minWidth: 130,
    height: 25,
    position: 'absolute',
    end: 0,
    bottom: 0,
    alignItems: 'center',
    borderColor: COLORS.DISABLE_BUTTON,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 4,
  },
});

const extractTransactionCode = transaction => {
  return `${translate(STRINGS.TRANSACTION)} ${transaction.bookingCode || transaction.depositeCode}`;
};

const extractCreateDateTime = transaction => {
  const textTime = transaction?.transactionDatetime
    ? getTransactionDateTimeString(transaction.transactionDatetime)
    : NOT_ANS;

  return `${translate(STRINGS.TRANSACTION_DATE)}: ${textTime}`;
};

const extractPaidDateTime = transaction => {
  const textTime = transaction?.paymentDatetime
    ? getTransactionDateTimeString(transaction.paymentDatetime)
    : NOT_ANS;

  return `${translate('payment.paymentDate')}: ${textTime}`;
};

const TransactionItem = ({transaction, onPress}) => {
  const statusStyle = TransactionUtil.statusToStyle(transaction.transactionStatusName);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {transaction.saleAgentInfo && (
        <Text style={styles.name}>{getUserFullName(transaction.saleAgentInfo)}</Text>
      )}
      <Text style={styles.projectName}>
        {`${transaction.propertyCode}`}
        <Text style={styles.codeSeparator}> | </Text>
        {`${transaction.projectName}`}
      </Text>
      <Text style={styles.date}>{extractTransactionCode(transaction)}</Text>
      <Text style={styles.date}>{extractCreateDateTime(transaction)}</Text>
      <Text style={styles.date}>{extractPaidDateTime(transaction)}</Text>
      <Entypo
        name={'chevron-thin-right'}
        size={16}
        style={styles.icon}
        color={COLORS.TEXT_DARK_40}
      />
      <View style={[styles.transactionStatusContainer, statusStyle.container]}>
        <Text style={[styles.transactionStatus, statusStyle.text]}>
          {transaction?.transactionStatusDescription}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TransactionItem, () => {
  return true;
});
