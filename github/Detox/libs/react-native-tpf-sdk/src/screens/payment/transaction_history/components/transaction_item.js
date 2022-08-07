import { ICNextGreen02 } from '../../../../assets/icons';
import { ic_invoice_dollar } from '../../../../assets/images';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import SCREENS_NAME from '../../../../constants/screens';
import { ICON_SIZE, MULTIE_BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { formatNumber } from '../../../../helpers/formatNumber';
import { isNumber } from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { TRANSACTION_TYPE } from '../../../../global/transaction_history';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';
import { ICDollar } from '../../../../assets/icons';

const Item = props => {
  const {
    type,
    amount,
    orderCode,
    dayTrading,
    actualAmount,
    vat,
    fee,
    tabIndex,
    isAdvance,
    expectedPaymentTime,
    navigation,
    transactionId
  } = props;

  const theme = useContext(themeContext);

  const StatusComponent = useCallback(() => {
    if (tabIndex === 0) {
      if (type !== TRANSACTION_TYPE.Cashout) {
        return (
          <AppText translate style={styles.textStatus}>
            {'transaction_history.money_in'}
          </AppText>
        );
      }

      return (
        <AppText translate style={styles.textStatus}>
          {'transaction_history.money_out'}
        </AppText>
      );
    }
    // tabIndex != 0
    if (type === TRANSACTION_TYPE.AdvanceMoney) {
      return (
        <AppText translate style={styles.textStatus}>
          {'transaction_history.money_in'}
        </AppText>
      );
    }

    if (isAdvance) {
      return (
        <AppText translate style={styles.textStatus}>
          {'transaction_history.advance_money'}
        </AppText>
      );
    }

    return null;
  }, [tabIndex, type, isAdvance]);

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.contentWrapper}>
        <View style={styles.contentLeft}>
          <View style={styles.icon}>
            <ICDollar
              width={scale(46)}
              height={scale(46)}
              color2={theme?.icon?.color1}
              color1={theme?.icon?.color2}
            />
          </View>
          <View style={styles.content}>
            <View style={styles.row}>
              <AppText
                translate
                semiBold
                style={[
                  styles.title,
                  { color: theme?.app?.primaryColor1 },
                  type === TRANSACTION_TYPE.Cashout && { color: theme?.app?.primaryColor2 }
                ]}>
                {(tabIndex === 0
                  ? type === TRANSACTION_TYPE.Cashout
                    ? '-'
                    : type === 23
                    ? ''
                    : '+'
                  : '') +
                  formatNumber(
                    type === TRANSACTION_TYPE.AdvanceMoney ? actualAmount : amount
                  ).toLocaleString('en')}
                {'common.currency'}
              </AppText>
              <View
                style={[
                  styles.status,

                  [TRANSACTION_TYPE.Commission, TRANSACTION_TYPE.AdvanceMoney].includes(type)
                    ? { backgroundColor: theme?.app?.primaryColor2 }
                    : type === TRANSACTION_TYPE.Cashout
                    ? { backgroundColor: theme?.app?.primaryColor1 }
                    : null
                ]}>
                <StatusComponent />
              </View>
            </View>

            {tabIndex === 0 ? (
              type === TRANSACTION_TYPE.Commission ? (
                <AppText translate medium style={styles.contentText}>
                  {'transaction_history.order_code'} {orderCode}
                </AppText>
              ) : type === TRANSACTION_TYPE.AdvanceMoney ? (
                <>
                  {isNumber(amount) && (
                    <AppText translate medium style={styles.contentText}>
                      {'transaction_history.advance'}
                      {formatNumber(amount).toLocaleString('en')} {'common.currency'}
                    </AppText>
                  )}
                  {isNumber(fee) && (
                    <AppText translate medium style={styles.contentText}>
                      {'transaction_history.advance_fee'}
                      {formatNumber(fee).toLocaleString('en')} {'common.currency'}
                    </AppText>
                  )}
                </>
              ) : type === TRANSACTION_TYPE.Cashout ? (
                <>
                  {isNumber(vat) ? (
                    <AppText translate style={styles.contentText}>
                      {'account_balance.tax'}
                      {`(${vat.toLocaleString('en')}%):`} {formatNumber(fee).toLocaleString('en')}{' '}
                      {'common.currency'}
                    </AppText>
                  ) : null}
                  {isNumber(actualAmount) ? (
                    <AppText translate style={styles.contentText}>
                      {'transaction_history.actually_received'}{' '}
                      {formatNumber(actualAmount).toLocaleString('en')} {'common.currency'}
                    </AppText>
                  ) : null}
                </>
              ) : type === 23 ? (
                <>
                  <AppText translate style={styles.contentText}>
                    {'transaction_history.order_code'} {orderCode}
                  </AppText>
                </>
              ) : null
            ) : (
              <AppText translate style={styles.contentText}>
                {'transaction_history.order_code'} {orderCode}
              </AppText>
            )}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <AppText translate style={[styles.date, { color: theme?.text?.secondary }]}>
          {tabIndex === 1 && !isAdvance
            ? 'transaction_history.expected_date'
            : 'transaction_history.day_trading'}
          {tabIndex === 1 && !isAdvance ? expectedPaymentTime : dayTrading}
        </AppText>
        {type === TRANSACTION_TYPE.AdvanceMoney && tabIndex === 0 ? (
          <TouchableOpacity
            style={styles.showListApplication}
            onPress={() =>
              navigation.navigate(SCREENS_NAME.LIST_APPLICATION_SCREEN, {
                amount,
                fee,
                actualAmount,
                dayTrading,
                transactionId
              })
            }>
            <AppText semiBold style={styles.application} translate>
              {'transaction_history.list_application'}
            </AppText>
            <ICNextGreen02 height={ICON_SIZE.TINY} width={ICON_SIZE.TINY} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default Item;

Item.propTypes = {
  tax: PropTypes.number,
  advance: PropTypes.number,
  statusCode: PropTypes.number,
  profileNumber: PropTypes.string,
  price: PropTypes.number.isRequired,
  actuallyReceived: PropTypes.number,
  dayTrading: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  itemWrapper: {
    paddingVertical: SPACING.Medium
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footer: {
    width: '100%',
    paddingTop: SPACING.Normal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentLeft: {
    flexDirection: 'row',
    flex: 1
  },
  content: {
    flex: 1
  },
  status: {
    borderRadius: 5
  },

  textStatus: {
    color: TEXT_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small,
    fontWeight: '600',
    paddingHorizontal: scale(8),
    paddingVertical: scale(5)
  },
  icon: {
    width: scale(58),
    height: '100%',
    alignItems: 'center',
    marginRight: SPACING.XNormal
  },
  imageInvoice: {
    height: scale(46),
    width: scale(46)
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
  statusWrapper: {
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    top: scale(16, false),
    backgroundColor: 'red',
    height: scale(26, false),
    justifyContent: 'center',
    paddingHorizontal: SPACING.XSmall,
    borderRadius: MULTIE_BORDER_RADIUS.SMALL
  },
  statusText: {
    color: TEXT_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  date: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.Small
  },
  red: {
    color: TEXT_COLOR.Flamingo
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  application: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.PersianGreen,
    marginRight: SPACING.Small
  },
  showListApplication: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
