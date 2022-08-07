import React from 'react';
import {Image, StyleSheet, Text, TextStyle, View} from 'react-native';

import {PaymentUnit} from '../../../api/graphql/generated/graphql';
import {APP_CURRENCY, NOT_ANS} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, micro, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CopyIcon from '../../../components/Button/CopyIcon';
import NumberUtils from '../../../utils/NumberUtils';
import PaymentNotice from '../../BookingDeposit/Confirm/Components/PaymentNotice';

type TextViewProps = {
  title: string,
  des: string,
  titleStyle: TextStyle,
  desStyle: TextStyle,
  canBeCopy: Boolean,
};

const styles = StyleSheet.create({
  blockTitle: {
    ...METRICS.tinyMarginTop,
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.TEXT_DARK_10,
    textAlign: 'center',
  },
  title: {
    color: COLORS.BLACK_33,
    fontSize: 14,
  },
  description: {
    width: '90%',
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_26,
    textAlign: 'justify',
  },
  viewTextInfo: {
    marginTop: normal,
  },
  notice: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.BLACK_26,
    fontWeight: '300',
    fontStyle: 'italic',
    marginTop: micro,
  },
  iconBidv: {
    width: 73,
    height: 28,
    alignSelf: 'center',
  },
  viewContain: {
    backgroundColor: COLORS.GREEN_80,
    borderColor: COLORS.GREEN_80,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 12,
    padding: normal,
    overflow: 'hidden',
  },
  headerContain: {
    ...METRICS.smallVerticalPadding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderColor: COLORS.GREEN_80,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: SIZES.BORDER_RADIUS_8,
    overflow: 'hidden',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashTransactionTitle: {
    ...FONTS.bold,
    ...FONTS.fontSize16,
    color: COLORS.BLACK_26,
  },
});

const TextTitleView = ({title, des, titleStyle, desStyle, canBeCopy = false}: TextViewProps) => {
  return (
    <View style={styles.viewTextInfo}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={HELPERS.rowSpaceBetweenCenter}>
        <Text style={[styles.description, desStyle]}>{des}</Text>
        {canBeCopy && <CopyIcon content={des} />}
      </View>
    </View>
  );
};

const TransactionDetail = ({info, paymentUnit}) => {
  switch (paymentUnit) {
    case PaymentUnit.Bidv:
      return (
        <View>
          <TextTitleView
            title={`${translate('common.accountName')}:`}
            des={info?.bankAccountName || NOT_ANS}
          />
          <TextTitleView
            title={`${translate('common.accountNumber')}:`}
            des={info?.bankAccountNumber || NOT_ANS}
            canBeCopy
          />
          <TextTitleView
            title={`${translate('common.transactionRemark')}:`}
            des={info?.bankTransferContents || NOT_ANS}
            canBeCopy
          />
          <TextTitleView
            title={`${translate('common.amount')}:`}
            des={
              info?.expectedAmount
                ? `${NumberUtils.formatNumberToCurrencyNumber(
                    info?.expectedAmount,
                    0,
                  )} ${APP_CURRENCY}`
                : NOT_ANS
            }
          />
          <Text style={styles.notice}>({translate('payment.noticeTransfer')})</Text>
        </View>
      );
    case PaymentUnit.Fast:
      return (
        <View>
          <Text style={styles.cashTransactionTitle}>
            {`${translate('common.companyTitle')}\n ${info?.branchName}`}
          </Text>
          <TextTitleView
            title={`${translate(STRINGS.ADDRESS)}:`}
            des={info?.branchAddress || NOT_ANS}
          />
          <TextTitleView
            title={`${translate('common.phone')}:`}
            des={info?.phoneNumber || NOT_ANS}
          />
          <TextTitleView title={`${translate('common.fax')}:`} des={info?.faxNumber || NOT_ANS} />
          <TextTitleView title={`${translate('common.email')}:`} des={info?.fundEmail || NOT_ANS} />
        </View>
      );
    default:
      return null;
  }
};

const getTransactionDetail = ({paymentUnit, bankTransferDetail, cashTransferDetail}) => {
  switch (paymentUnit) {
    case PaymentUnit.Bidv:
      return bankTransferDetail;
    case PaymentUnit.Fast:
      return cashTransferDetail;
    default:
      return cashTransferDetail;
  }
};

const TransactionPaymentView = ({
  paymentUnit,
  bankTransferDetail,
  cashTransferDetail,
  navigation,
}) => {
  const transactionDetail = getTransactionDetail({
    paymentUnit,
    bankTransferDetail,
    cashTransferDetail,
  });
  return (
    <>
      <View style={styles.viewContain}>
        {paymentUnit === PaymentUnit.Bidv && (
          <View style={styles.headerContain}>
            <Image source={IMAGES.LOGO_BIDV} style={styles.iconBidv} resizeMode="contain" />
            <Text style={styles.blockTitle}>{translate('payment.bidvBankingTitle')}</Text>
          </View>
        )}
        <TransactionDetail paymentUnit={paymentUnit} info={transactionDetail} />
      </View>
      <View style={commonStyles.separatorRow24} />
      <PaymentNotice navigation={navigation} paymentUnit={paymentUnit} />
    </>
  );
};

export default TransactionPaymentView;
