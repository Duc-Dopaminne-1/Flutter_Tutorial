import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import {TransactionServiceType} from '../../api/graphql/generated/graphql';
import {NOT_ANS, PAYMENT_UNITS, TransactionServices} from '../../assets/constants';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import NumberUtils from '../../utils/NumberUtils';
import {getTextDateFromTimeStamp, getTransactionDateTimeString} from '../../utils/TimerCommon';
import ManagePaymentFilterUtil from './ManagePaymentFilterUtil';

const styles = StyleSheet.create({
  container: {
    ...METRICS.padding,
    borderRadius: 4,
    marginTop: normal,
    flex: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  paymentService: {
    backgroundColor: COLORS.GREY_E4,
  },
  amount: {
    ...METRICS.smallVerticalMargin,
    ...FONTS.semiBold,
    fontSize: 21,
    color: COLORS.BLACK_26,
  },
  name: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_26,
  },
  projectName: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
  },
  date: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
  },
  paymentMethod: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_26,
  },
  groupInfoMethod: {
    borderBottomColor: COLORS.GREY_E4,
    borderBottomWidth: 1,
  },
});

export const ItemHeight = () => {
  return 188 + normal;
};

const PaymentItem = ({paymentItem, onPress}) => {
  const {
    transactionPaymentStatus,
    transactionServiceType,
    paidDatetime,
    paymentTransferNumber,
    expectedAmount,
    productName,
    paymentUnit,
  } = paymentItem;
  const colorAndNameStatus =
    ManagePaymentFilterUtil.getColorAndNameByStatus(transactionPaymentStatus);
  const paymentUnitObj = PAYMENT_UNITS[paymentUnit];
  let formatPaidDatetime = NOT_ANS;
  if (paidDatetime) {
    if (transactionServiceType === TransactionServiceType.Refundtype) {
      formatPaidDatetime = getTextDateFromTimeStamp(paidDatetime);
    } else {
      formatPaidDatetime = getTransactionDateTimeString(paidDatetime);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, {height: paymentItem.height - normal}]}
      onPress={onPress}>
      <View style={HELPERS.rowSpaceBetweenCenter}>
        <View style={HELPERS.row}>
          {!!transactionServiceType && (
            <View
              style={[commonStyles.statusContainer, styles.paymentService, METRICS.smallMarginEnd]}>
              <Text style={[commonStyles.statusText, {color: COLORS.BLACK_33}]}>
                {TransactionServices[transactionServiceType]?.name}
              </Text>
            </View>
          )}
          <View
            style={[commonStyles.statusContainer, {backgroundColor: colorAndNameStatus?.color}]}>
            <Text style={commonStyles.statusText}>{colorAndNameStatus?.name ?? ''}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.amount}>
        {`${NumberUtils.formatNumberToCurrencyNumber(expectedAmount, 0)} VND`}
      </Text>
      <TouchableOpacity disabled={true} style={HELPERS.rowSpaceBetweenCenter}>
        <Text style={styles.projectName}>{productName}</Text>
        <Entypo
          name={'chevron-thin-right'}
          size={16}
          style={styles.icon}
          color={COLORS.PRIMARY_A100}
        />
      </TouchableOpacity>
      <View
        style={[
          HELPERS.rowSpaceBetweenCenter,
          METRICS.smallVerticalPadding,
          styles.groupInfoMethod,
        ]}>
        <Text style={styles.name}>{paymentTransferNumber}</Text>
        <Text style={styles.paymentMethod}>{paymentUnitObj?.name}</Text>
      </View>
      <View style={commonStyles.separatorRow8} />
      <Text style={styles.date}>{formatPaidDatetime}</Text>
    </TouchableOpacity>
  );
};

export default PaymentItem;
