import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {medium, METRICS, normal, small} from '../../../../assets/theme/metric';
import {ContentRefund} from './DepositInfo';
import {RowText} from './DetailTransactionComponents';
import {
  CommonDetailTransactionStyles as commonStyles,
  DepositType,
} from './DetailTransactionConstant';

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: small,
    height: 180,
  },
  viewBookingComplete: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 4,
    paddingVertical: normal,
    paddingHorizontal: medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.BORDER_WIDTH_1,
    flexDirection: 'row',
    borderColor: COLORS.GREY_E4,
  },
});

const ContentTransactionPriority = ({data}) => {
  if (
    isEmpty(data?.transactionId) ||
    data?.depositType === DepositType.WaitingPayment ||
    data?.depositType === DepositType.Cancelled ||
    data?.depositType === DepositType.WaitingPaymentDeposit ||
    data?.depositType === DepositType.CancelledDeposit ||
    data?.isCancelled
  ) {
    return null;
  }
  if (!isEmpty(data?.transactionId) && !isEmpty(data?.transactionIndex?.toString())) {
    return (
      <>
        <Text
          style={[
            commonStyles.timeText,
            {marginBottom: normal},
          ]}>{`${data.startTransactionDateTime}`}</Text>
        <View style={styles.viewBookingComplete}>
          <View style={HELPERS.crossEnd}>
            <RowText text={`${translate(STRINGS.PRIORITY)}: `} />
            <RowText text={`${translate(STRINGS.BOOKING_FEE)}: `} />
          </View>
          <View>
            <RowText customStyle={{...FONTS.bold}} text={`${data.transactionIndex}`} />
            <RowText customStyle={{...FONTS.bold}} text={`${data.transactionAmount}`} />
          </View>
        </View>
      </>
    );
  } else {
    return null;
  }
};

const ContentBooking = ({data, onPressRefund}) => {
  let title = translate(STRINGS.BOOKING_SUCCESS);
  switch (data.depositType) {
    case DepositType.WaitingPayment:
      title = translate('payment.status.waitingForPay');
      break;
    case DepositType.Cancelled:
      title = translate('payment.status.expired');
      break;
    case DepositType.RefundRequest:
    case DepositType.Refunded:
      if (data?.isCancelled) {
        title = translate('payment.status.expired');
      }
      break;
    default:
      break;
  }
  return (
    <>
      <Text style={{...FONTS.bold}}>{`${title}`}</Text>
      <ContentTransactionPriority data={data} />
      {data.depositType === DepositType.Cancelled && (
        <ContentRefund style={METRICS.mediumMarginTop} data={data} onPressRefund={onPressRefund} />
      )}
    </>
  );
};

const BookingInfo = ({data, onPressRefund}) => {
  return (
    <View style={styles.contentContainer}>
      <ContentBooking data={data} onPressRefund={onPressRefund} />
    </View>
  );
};

export default BookingInfo;
