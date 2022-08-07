import { Heading } from '../../../../components/';
import TextView from '../../../../components/text_view';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { EXTRA_SERVICE_ORDER_STATUS } from '../../../../global/order_status';
import { EmptyContent } from '../../../../components/';
import { empty_quote } from '../../../../assets/images';
import { formatDateFromUtc, formatDate } from '../../../../helpers/formatTime';
import { formatNumber } from '../../../../helpers/formatNumber';
import AppText from '../../../../components/app_text';
import { useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../../redux/selectors/partner';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import themeContext from '../../../../constants/theme/themeContext';

const Quote = ({ orderDetail, style, isExpand = false }) => {
  const status = orderDetail?.status;
  const { fonts } = useContext(themeContext) || {};
  // const status = EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment;
  const partner = useSelector(state => partnerItemSelector(state, orderDetail?.partnerId));

  const finish = [
    EXTRA_SERVICE_ORDER_STATUS.Completed,
    EXTRA_SERVICE_ORDER_STATUS.Canceled
  ].includes(status);

  let title = !isExpand
    ? finish
      ? 'profile_info.order_details'
      : 'profile_info.quote_information'
    : '';
  let personalInfo = [
    {
      title: 'product_tab.product',
      value: orderDetail?.ordersItem?.name || ''
    },
    {
      title: 'product_tab.supplier',
      value: partner?.name
    },
    {
      title: 'application.service_costs',
      value: `${formatNumber(
        orderDetail?.ordersItem?.serviceFee || orderDetail?.ordersItem?.price
      )}`,
      isPrice: true,
      bold: finish
    }
  ];
  if (status === EXTRA_SERVICE_ORDER_STATUS.Completed && orderDetail?.paymentOption === 2) {
    //order finish & payment option order is offline
    personalInfo.push({
      title: 'application.offline_payment',
      value: orderDetail?.offlinePayment ? `${formatNumber(orderDetail?.offlinePayment)}` : '',
      isPrice: true,
      bold: true
    });
    personalInfo.push({
      title: 'application.offline_payment_date',
      value: orderDetail?.offlinePaymentDate
        ? formatDateFromUtc(orderDetail?.offlinePaymentDate)
        : ''
    });
  }
  if (
    status === EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment &&
    orderDetail?.paymentOption !== 2
  ) {
    personalInfo = [
      ...personalInfo,
      {
        title: 'application.prepayment',
        value: `${formatNumber(orderDetail?.ordersItem?.prepayment)}`,
        isPrice: true,
        bold: true
      }
    ];
  }

  const emptyQuote =
    !status ||
    [EXTRA_SERVICE_ORDER_STATUS.New, EXTRA_SERVICE_ORDER_STATUS.PartnerInvestigating].includes(
      status
    );
  if (!emptyQuote) {
    if ([EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment].includes(status)) {
      personalInfo.push({
        title: 'application.prepayment',
        value: `${formatNumber(orderDetail?.ordersItem?.prepayment)}`,
        isPrice: true,
        bold: true
      });
    } else if ([EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment].includes(status)) {
      personalInfo.push(
        {
          title: 'application.prepayment',
          value: `${formatNumber(orderDetail?.ordersItem?.prepayment)}`,
          isPrice: true
        },
        {
          title: 'application.rest',
          value: `${formatNumber(orderDetail?.ordersItem?.remainingFee)}`,
          isPrice: true,
          bold: true
        }
      );
    } else if ([EXTRA_SERVICE_ORDER_STATUS.Canceled].includes(status)) {
      personalInfo.push({
        title: 'application.cancellation_date',
        value: formatDateFromUtc(orderDetail?.lastModificationTime)
      });
    } else if ([EXTRA_SERVICE_ORDER_STATUS.Completed].includes(status)) {
      personalInfo.push({
        title: 'application.finish_day',
        value: formatDateFromUtc(orderDetail?.lastModificationTime)
      });
    } else if ([EXTRA_SERVICE_ORDER_STATUS.CompleteRemainingPayment].includes(status)) {
      personalInfo.push({
        title: 'application.pre_payment',
        value: `${formatNumber(orderDetail?.ordersItem?.prepayment)}`,
        isPrice: true,
        bold: true
      });
    }
  }

  // if (orderDetail != null) {
  //   orderDetail.expiredPaymentDate = '2021-07-20T03:10:51.017495';
  //   orderDetail.status = EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment;
  // }

  const containerStyle = useMemo(() => {
    return [isExpand ? {} : styles.infoContainer];
  }, [isExpand]);
  return emptyQuote ? (
    <EmptyContent translate title={'application.empty_quote'} image={empty_quote} />
  ) : (
    <>
      <View style={containerStyle}>
        <Heading translate style={styles.title}>
          {title}
        </Heading>
        {personalInfo.map((item, index) => (
          <TextView
            translate
            key={index + ''}
            title={item.title}
            value={
              item?.isPrice ? (
                <AppText translate bold={item?.bold || false}>
                  {(item?.value || '') + ''}
                  {'common.currency'}
                </AppText>
              ) : (
                item.value
              )
            }
            multiline={true}
            bold={item?.bold || false}
          />
        ))}
      </View>
      {[
        EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment,
        EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment
      ].includes(status) && orderDetail?.expiredPaymentDate ? (
        <View style={styles.expiredConainter}>
          <Text style={[styles.quoteText, { fontFamily: fonts?.ITALIC }]}>
            <AppText translate>{'application.payment_before'}</AppText>
            <Text style={styles.expiredDate}>
              {formatDate(orderDetail?.expiredPaymentDate, 'HH:mm')}
            </Text>
            <AppText translate>{'application.day'}</AppText>
            <Text style={styles.expiredDate}>{formatDate(orderDetail?.expiredPaymentDate)}</Text>
            <AppText translate>{'application.to_process_application'}</AppText>
          </Text>
        </View>
      ) : null}
    </>
  );
};

export default Quote;
export const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  itemTab: {
    alignItems: 'center'
  },
  infoContainer: {
    ...Shadow,
    paddingVertical: SPACING.Medium,
    paddingHorizontal: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.Medium
  },
  title: {},
  switchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  expiredConainter: {
    paddingHorizontal: SPACING.Medium,
    paddingVertical: SPACING.Normal
  },
  quoteText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText,
    color: TEXT_COLOR.GreenBold
  },
  expiredDate: {
    color: TEXT_COLOR.GreenLight
  }
});
