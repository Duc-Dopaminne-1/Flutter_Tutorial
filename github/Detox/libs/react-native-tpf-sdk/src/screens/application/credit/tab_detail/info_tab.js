import { DynamicViewForm } from '../../../../components/';
import { BACKGROUND_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextView } from '../../../../components/';
import { ExpandView } from '../../../../components/';
import { DynamicInputForm } from '../../../../components/';
import { useCallback } from 'react';
import { CREDIT_ORDER_STATUS } from '../../../../global/order_status';
import { formatNumber } from '../../../../helpers/formatNumber';
import { translate } from '../../../../i18n';
import { CustomInput } from '../../../../components/';
import { formatDate } from '../../../../helpers/formatTime';

const InfoTab = ({ itemDetail, onUpdateInfo }) => {
  const [dataInput, setDataInput] = useState({});

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

  const canEdit = [CREDIT_ORDER_STATUS.Draft, CREDIT_ORDER_STATUS.WaitingForUpdate].includes(
    itemDetail?.status
  );

  const onChangeValue = obj => {
    onChange({ ...dataInput, ...obj });
  };

  const onChange = useCallback(
    value => {
      setDataInput(pre => {
        return { ...pre, ...value };
      });
      itemDetail.ordersItem.loanAmount = parseInt(value.loan);
      itemDetail.ordersItem.loanPeriod = parseInt(value.duration);
    },
    [itemDetail]
  );

  useEffect(() => {
    setDataInput({
      loan: itemDetail?.ordersItem?.loanAmount,
      duration: itemDetail?.ordersItem?.loanPeriod
    });
  }, [itemDetail]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.wrapper}
      showsVerticalScrollIndicator={false}>
      {itemDetail?.title ? (
        <ExpandView translateTitle title={'info_tab.profile_info'} style={styles.infoContainer}>
          {canEdit ? (
            <>
              <CustomInput
                translate
                translateTitle
                type={'number'}
                style={styles.input}
                title={'loan_package.borrowed_time'}
                placeholder={'loan_package.borrowed_time_placeholder'}
                value={dataInput.duration}
                onChangeText={value => {
                  onChangeValue({ duration: value });
                }}
              />
            </>
          ) : (
            <>
              <TextView
                translate
                title={'product_tab.loan'}
                value={
                  formatNumber(itemDetail?.ordersItem?.loanAmount) +
                  ' ' +
                  translate('common.currency')
                }
              />
              {itemDetail?.ordersItem?.loanPeriod ? (
                <TextView
                  translate
                  title={'product_tab.time_term'}
                  value={itemDetail?.ordersItem?.loanPeriod + ' ' + translate('time.months')}
                />
              ) : null}
            </>
          )}

          <TextView
            translate
            title={'info_tab.create_time'}
            value={itemDetail?.creationTime ? formatDate(itemDetail?.creationTime) : ''}
          />
          <TextView
            translate
            title={'info_tab.last_modification_time'}
            value={
              itemDetail?.lastModificationTime ? formatDate(itemDetail?.lastModificationTime) : ''
            }
          />
        </ExpandView>
      ) : null}
      {!canEdit ||
      (itemDetail?.isNeedSupport && !itemDetail?.isTopener && !itemDetail?.isMyDeal) ? (
        <>
          <DynamicViewForm listComponent={itemDetail?.contact?.listComponent || []} />
          <DynamicViewForm listComponent={itemDetail?.productForm?.listComponent || []} />
        </>
      ) : (
        <>
          <DynamicInputForm
            listComponent={itemDetail?.contact?.listComponent || []}
            onChange={onChangeInfo}
          />
          <DynamicInputForm
            listComponent={itemDetail?.productForm?.listComponent || []}
            onChange={onChangeProductForm}
          />
        </>
      )}
    </ScrollView>
  );
};

export default InfoTab;

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
  infoContainer: {
    marginBottom: SPACING.Medium
  }
});
