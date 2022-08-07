import { DynamicInputForm, DynamicViewForm, ExpandView, TextView } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { SPACING } from '../../../../constants/size';
import { formatNumber } from '../../../../helpers/formatNumber';
import { formatDate, formatDateFromUtc } from '../../../../helpers/formatTime';
import React, { useCallback, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../../redux/selectors/partner';
import { INSURANCE_ORDER_STATUS } from '../../../../global/order_status';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { TEXT_COLOR } from '../../../../constants/colors';
import themeContext from '../../../../constants/theme/themeContext';

const InfoTab = ({ itemDetail, onUpdateInfo, onAddGroup, onRemoveGroup, onCopy, toggleCopy }) => {
  const { fonts } = useContext(themeContext) || {};

  const onChangeInfo = useCallback(
    components => {
      const newData = {
        ...itemDetail,
        contact: {
          ...itemDetail.contact,
          listComponent: components
        }
      };
      onUpdateInfo(newData);
    },
    [itemDetail, onUpdateInfo]
  );
  const onChangeProductForm = useCallback(
    components => {
      const newData = {
        ...itemDetail,
        productForm: {
          ...itemDetail.productForm,
          listComponent: components
        }
      };
      onUpdateInfo(newData);
    },
    [itemDetail, onUpdateInfo]
  );

  const canEdit = [INSURANCE_ORDER_STATUS.Draft, INSURANCE_ORDER_STATUS.WaitingForUpdate].includes(
    itemDetail?.status
  );

  const partner = useSelector(state => partnerItemSelector(state, itemDetail?.partnerId));

  // if (itemDetail != null) {
  //   itemDetail.expiredPaymentDate = '2021-07-20T03:10:51.017495';
  //   itemDetail.status = INSURANCE_ORDER_STATUS.WaitingForPayment;
  // }

  return (
    <>
      {itemDetail?.ordersItem?.name ? (
        <ExpandView
          translateTitle
          title={'insurance_screen.profile_information'}
          style={styles.infoContainer}>
          <TextView
            translate
            title={'insurance_screen.products_name'}
            value={itemDetail?.ordersItem?.name}
          />
          <TextView translate title={'insurance_screen.supplier'} value={partner?.name} />
          <TextView
            translate
            title={'insurance_screen.package'}
            value={itemDetail?.ordersItem?.productPackage}
          />
          <TextView
            translate
            title={'insurance_screen.effect_from'}
            value={formatDateFromUtc(itemDetail?.lastModificationTime)}
          />

          <TextView
            translate
            title={'insurance_screen.total_premium'}
            value={
              <AppText translate>
                {formatNumber(itemDetail?.ordersItem?.price || '') + ''}
                {'common.currency'}
              </AppText>
            }
          />
          <TextView
            translate
            title={'insurance_screen.amount_to_be_paid'}
            value={
              <AppText translate>
                {formatNumber(itemDetail?.ordersItem?.price || '') + ''}
                {'common.currency'}
              </AppText>
            }
            bold
          />
          <TextView
            translate
            title={'info_tab.create_time'}
            value={
              itemDetail?.ordersItem?.creationTime
                ? formatDate(itemDetail?.ordersItem?.creationTime)
                : ''
            }
          />
          <TextView
            translate
            title={'info_tab.last_modification_time'}
            value={
              itemDetail?.ordersItem?.lastModificationTime
                ? formatDate(itemDetail?.ordersItem?.lastModificationTime)
                : ''
            }
          />
        </ExpandView>
      ) : null}
      {canEdit ? (
        <>
          <DynamicInputForm
            listComponent={itemDetail?.contact?.listComponent}
            onChange={onChangeInfo}
          />
          <DynamicInputForm
            listComponent={itemDetail?.productForm?.listComponent}
            onChange={onChangeProductForm}
            onAddGroup={onAddGroup}
            onRemoveGroup={onRemoveGroup}
            onCopy={onCopy}
            toggleCopy={toggleCopy}
          />
        </>
      ) : (
        <>
          <DynamicViewForm listComponent={itemDetail?.contact?.listComponent} />
          <DynamicViewForm listComponent={itemDetail?.productForm?.listComponent} />
        </>
      )}
      {[INSURANCE_ORDER_STATUS.WaitingForPayment].includes(itemDetail?.status) &&
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
    </>
  );
};

export default InfoTab;

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: SPACING.Medium
  },
  expiredConainter: {
    paddingHorizontal: SPACING.Medium,
    paddingVertical: SPACING.Normal
  },
  quoteText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText
  },
  expiredDate: {}
});
