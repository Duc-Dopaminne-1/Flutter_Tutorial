import { ic_invoice_dollar } from '../../../../assets/images';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { formatNumber } from '../../../../helpers/formatNumber';
import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import OrderStatus from '../../../../screens/application/insurance/tab_detail/order_status';
import { INSURANCE_TRANSACTION_HISTORY_STATUS } from '../../../../global/order_status';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';
import { ICDollar } from '../../../../assets/icons';

const Item = ({ amount, orderCode, dayTrading, type, tabIndex }) => {
  const theme = useContext(themeContext);
  const statusProgress = useMemo(() => {
    switch (type) {
      case 9:
        return INSURANCE_TRANSACTION_HISTORY_STATUS.Payment;
      case 17:
        return INSURANCE_TRANSACTION_HISTORY_STATUS.CancelContract;
      case 18:
        return INSURANCE_TRANSACTION_HISTORY_STATUS.StopContract;
      default:
        break;
    }
  }, [type]);
  const displayMoney = formatNumber(amount);

  const StatusComponent = useCallback(() => {
    if (type !== 6 && type !== 7) return null;

    let name = type === 6 ? 'Đặt cọc' : type === 7 ? 'Hoàn cọc' : '';
    let styleBackground =
      type === 6
        ? { backgroundColor: theme?.app?.primaryColor1 }
        : type === 7
        ? { backgroundColor: theme?.app?.primaryColor2 }
        : {};
    return (
      <View style={styles.contentRight}>
        <View style={[styles.statusContiner, styleBackground]}>
          <AppText semiBold style={styles.statusText}>
            {name}
          </AppText>
        </View>
      </View>
    );
  }, [theme, styles, type]);

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.contentWrapper}>
        <View style={styles.icon}>
          <ICDollar
            width={scale(46)}
            height={scale(46)}
            color2={theme?.icon?.color1}
            color1={theme?.icon?.color2}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.rowContainer}>
            <AppText
              translate
              semiBold
              style={[styles.title, { color: theme?.app?.primaryColor1 }]}>
              {displayMoney}
              {'common.currency'}
            </AppText>
            {tabIndex === 1 ? <OrderStatus status={statusProgress} /> : null}
            <StatusComponent />
          </View>
          {orderCode ? (
            tabIndex === 3 ? (
              <AppText translate medium style={styles.contentText}>
                {'transaction_history.source'}
                {orderCode}
              </AppText>
            ) : (
              <AppText translate medium style={styles.contentText}>
                {'transaction_history.order_code'}
                {orderCode}
              </AppText>
            )
          ) : null}
        </View>
      </View>
      <View style={styles.footer}>
        <AppText translate style={[styles.date, { color: theme?.text?.secondary }]}>
          {'transaction_history.day_trading'}
          {dayTrading}
        </AppText>
      </View>
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
  itemWrapper: {
    paddingVertical: SPACING.Medium
  },
  contentWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footer: {
    width: '100%',
    paddingTop: SPACING.Normal
  },
  content: {
    height: '100%',
    flex: 1
  },
  icon: {
    width: scale(58),
    height: '100%',
    alignItems: 'center',
    marginRight: SPACING.XNormal
  },

  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    paddingBottom: scale(2)
  },
  contentText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  contentLeft: {
    flexDirection: 'row'
  },
  contentRight: {},
  statusContiner: {
    borderRadius: BORDER_RADIUS,
    paddingVertical: scale(7),
    paddingHorizontal: SPACING.Normal,
    minWidth: scale(50)
  },
  statusText: {
    fontSize: FONT_SIZE.Small,
    lineHeight: FONT_SIZE.Small,
    color: TEXT_COLOR.White
  },
  date: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  statusContiner2: {
    borderRadius: BORDER_RADIUS,
    paddingVertical: scale(5),
    paddingHorizontal: SPACING.Normal
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
