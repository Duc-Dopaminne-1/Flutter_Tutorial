import { ICRefund } from '../../../../assets/icons';
import AppText from '../../../../components/app_text';
import React, { useContext } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { formatNumber } from '../../../../helpers/formatNumber';
import { SPACING } from '../../../../constants/size';
import { formatDate } from '../../../../helpers/formatTime';
import OrderStatus from '../../../../screens/application/insurance/tab_detail/order_status.js';
import { useMemo } from 'react';
import { INSURANCE_REFUND_REQUEST_STATUS } from '../../../../global/order_status';
import themeContext from '../../../../constants/theme/themeContext';

const RefundRequestItem = ({ item, tabIndex, refundRequestInsuarance }) => {
  const { amount, orderCode, creationTime, expectedPaymentTime, paymentTime } = item || {};
  const theme = useContext(themeContext);

  const statusProgress = useMemo(() => {
    switch (item?.type) {
      case 17:
        return INSURANCE_REFUND_REQUEST_STATUS.CancelContract;
      case 18:
        return INSURANCE_REFUND_REQUEST_STATUS.StopContract;
      default:
        break;
    }
  }, [item?.type]);

  const stylePrimaryText = {
    color: theme?.app?.primaryColor1
  };

  const styleSecondaryText = {
    color: theme?.text?.secondary
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ICRefund style={styles.icon} color2={theme?.icon?.color1} color1={theme?.icon?.color2} />
        <View style={styles.content}>
          <View style={styles.statusContainer}>
            <AppText translate semiBold style={[styles.currency, stylePrimaryText]}>
              {formatNumber(amount)} {'common.currency'}
            </AppText>
            {refundRequestInsuarance ? <OrderStatus status={statusProgress} /> : null}
          </View>
          <AppText translate style={styles.itemName}>
            {'refund_request.file_id'}
            {`#${orderCode}`}
          </AppText>
        </View>
      </View>
      <AppText translate style={[styles.date, styleSecondaryText, { marginBottom: SPACING.Small }]}>
        {'refund_request.request_time'}
        {creationTime ? formatDate(creationTime) : ''}
      </AppText>
      {tabIndex === 0 ? (
        <AppText
          translate
          style={[styles.date, styleSecondaryText, { marginBottom: SPACING.Small }]}>
          {'refund_request.expected_time'}
          {expectedPaymentTime ? formatDate(expectedPaymentTime) : ''}
        </AppText>
      ) : (
        <AppText
          translate
          style={[styles.date, styleSecondaryText, { marginBottom: SPACING.Small }]}>
          {'refund_request.payment_time'}
          {paymentTime ? formatDate(paymentTime) : ''}
        </AppText>
      )}
    </View>
  );
};

export default React.memo(RefundRequestItem);
