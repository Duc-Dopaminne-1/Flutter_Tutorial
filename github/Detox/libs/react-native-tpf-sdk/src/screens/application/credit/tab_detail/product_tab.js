import AppText from '../../../../components/app_text';
import DynamicViewForm from '../../../../components/dynamic_view_form';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { formatNumber } from '../../../../helpers/formatNumber';
import { formatDate } from '../../../../helpers/formatTime';
import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../../redux/selectors/partner';
import { CREDIT_ORDER_STATUS } from '../../../../global/order_status';
import { translate } from '../../../../i18n';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';

const ProductTab = props => {
  const { itemDetail } = props;

  const { fonts } = useContext(themeContext) || {};
  const partner = useSelector(state => partnerItemSelector(state, itemDetail?.partnerId));
  const orderInfo = useMemo(() => {
    return [
      {
        type: 'Group',
        name: itemDetail?.ordersItem?.name,
        eavAttribute: [
          {
            name: 'product_tab.group_product',
            type: 'textinput',
            value: itemDetail?.ordersItem?.categoryName
          },
          {
            name: 'product_tab.supplier_credit',
            type: 'textinput',
            value: partner?.name
          }
        ]
      }
    ];
  }, [itemDetail, partner?.name]);

  // if (itemDetail != null) {
  //   itemDetail.expiredPaymentDate = '2021-07-20T03:10:51.017495';
  //   itemDetail.status = CREDIT_ORDER_STATUS.WaitingForPayment;
  // }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.wrapper}
      showsVerticalScrollIndicator={false}>
      <DynamicViewForm listComponent={orderInfo} cannotExpand={true} translateTitle />
      {[CREDIT_ORDER_STATUS.WaitingForPayment].includes(itemDetail?.status) &&
      itemDetail?.expiredPaymentDate ? (
        <View style={styles.expiredConainter}>
          <Text style={[styles.quoteText, { fontFamily: fonts?.ITALIC }]}>
            <AppText translate>{'application.payment_before'}</AppText>
            <Text style={styles.expiredDate}>
              {formatDate(itemDetail?.expiredPaymentDate, 'HH:mm')}
            </Text>
            <AppText translate>{'application.day'}</AppText>
            <Text style={styles.expiredDate}>{formatDate(itemDetail?.expiredPaymentDate)}</Text>
            <AppText translate>{'application.to_process_application'}</AppText>
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ProductTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  wrapper: {
    paddingBottom: SPACING.HasBottomButton,
    paddingTop: SPACING.XMedium,
    paddingHorizontal: SPACING.Medium
  },
  emptyListContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTitle: {
    marginTop: scale(20),
    fontSize: FONT_SIZE.SubHead
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
