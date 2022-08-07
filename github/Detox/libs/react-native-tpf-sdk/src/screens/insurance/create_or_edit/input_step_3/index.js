import {
  clearInsuranceOrderResult,
  editInsuranceOrderHandle,
  getInsuranceOrderFormForEditHandle
} from '../../../../redux/actions/insurance';
import { INSURANCE } from '../../../../redux/actionsType';
import {
  BecomeTopener,
  ExpandView,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../../components/';
import AppText from '../../../../components/app_text';
import TextView from '../../../../components/text_view';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import SCREENS_NAME from '../../../../constants/screens';
import { SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import { formatNumber } from '../../../../helpers/formatNumber';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../../redux/selectors/partner';
import { DATE_FORMAT } from '../../../../global/entity_type';
import { translate } from '../../../../i18n';
import { scale } from '../../../../utils/responsive';
import ProgressPurchase from '../../components/progress_purchase';
import { isIphoneX } from '../../../../helpers/device';

import { INSURANCE_ORDER_STATUS } from '../../../../global/order_status';
import { getShowAlertError } from '../../../../redux/actions/system';
import { CREATE_OR_EDIT_INSURANCE_ORDER_ERROR, SEND_SUCCESS_2 } from '../../../../constants/errors';
import { getBecomeTopenerHandle } from '../../../../redux/actions/masterData';
import { emitEvent } from '../../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../../global/app';

const InsuranceOrderInfoPurchaseScreen = props => {
  const {
    navigation,
    route: { params: screenState }
  } = props;

  const itemDetail = useSelector(state => state.insurance.insuranceOrderFormEdit);
  const partner = useSelector(state => partnerItemSelector(state, screenState?.form?.partnerId));
  const memberId = useSelector(state => state.auth.memberId);

  const [effectDate, setEffectDate] = useState(null);

  useEffect(() => {
    dispatch(getInsuranceOrderFormForEditHandle({ orderId: itemDetail?.orderId, memberId }));
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getInsuranceOrderFormForEditHandle({ orderId: itemDetail?.orderId, memberId }));
    });
    return () => {
      focusListener();
    };
  }, [dispatch, itemDetail?.orderId, navigation]);

  useEffect(() => {
    dispatch(getBecomeTopenerHandle());
  }, [dispatch]);

  /**
   * Dynamic workflow
   */
  const dispatch = useDispatch();
  const insuranceProductDetail = useSelector(state => state?.insurance?.insuranceProductDetail);
  const { insuranceCreateOrEditOrderResult } = useSelector(state => state.insurance);

  useEffect(() => {
    if (
      insuranceCreateOrEditOrderResult?.isSuccess &&
      insuranceCreateOrEditOrderResult.step === 3
    ) {
      emitEvent({ event_name: SDK_EVENT_NAME.INSURRANCE_APPLICATION_CREATE, data: itemDetail });
      dispatch(clearInsuranceOrderResult());
      if (insuranceCreateOrEditOrderResult?.action === 'continue') {
        navigation.navigate(SCREENS_NAME.INSURANCE_POLICY_ORDER_SCREEN, {
          screenState: screenState,
          itemDetail: itemDetail
        });
      } else {
        dispatch(getShowAlertError(SEND_SUCCESS_2));
        navigation.navigate(SCREENS_NAME.INSURANCE_ORDER_DETAIL_SCREEN, {
          orderId: itemDetail.orderId,
          item: itemDetail,
          withBackScreen: SCREENS_NAME.MIDDLEWARE
        });
      }
    } else if (insuranceCreateOrEditOrderResult?.isError) {
      dispatch(clearInsuranceOrderResult());
      dispatch(getShowAlertError(CREATE_OR_EDIT_INSURANCE_ORDER_ERROR));
    }
  }, [dispatch, insuranceCreateOrEditOrderResult, navigation, screenState, itemDetail]);

  const updateOrderStatus = useCallback(
    action => {
      dispatch(
        editInsuranceOrderHandle({
          ...itemDetail,
          productId: screenState?.productId,
          status: INSURANCE_ORDER_STATUS.WaitingForPayment,
          action: action,
          step: 3
        })
      );
    },
    [itemDetail, dispatch, screenState?.productId]
  );

  const onContinue = useCallback(() => {
    updateOrderStatus('continue');
  }, [updateOrderStatus]);

  const onPaymentLater = useCallback(() => {
    updateOrderStatus('paymentlater');
  }, [updateOrderStatus]);

  useEffect(() => {
    screenState.form?.productForm?.listComponent?.find(item => {
      item?.listAttribute.find(el => {
        if (el.attributeCode === 'StartTime') {
          setEffectDate(el.value);
        }
      });
    });
  }, [screenState?.form?.productForm?.listComponent]);

  const value = moment(effectDate);
  const formatEffectDate = value.isValid() ? value.format(DATE_FORMAT.date) : '';

  const onGetLink = () => {
    alert('a');
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        <AppText translate bold={true} style={styles.title}>
          {(insuranceProductDetail?.name ||
            itemDetail?.ordersItem?.name ||
            screenState?.data?.productName) + ''}
        </AppText>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={2}
          stepList={[
            'product_screen.progress_purchase_item_01',
            'product_screen.progress_purchase_item_02',
            screenState?.action === 'update' ? 'common.update' : 'common.payment'
          ]}
        />
        <>
          <View style={{ marginHorizontal: SPACING.Medium }}>
            <ExpandView
              canExpand={false}
              title={'insurance_record_details.order_infor'}
              translateTitle>
              <>
                <TextView
                  translate
                  title={'insurance_screen.products_name'}
                  value={
                    insuranceProductDetail?.name ||
                    itemDetail?.ordersItem?.name ||
                    screenState?.data?.productName
                  }
                />
                <TextView translate title={'insurance_screen.supplier'} value={partner?.name} />
                {!!itemDetail?.ordersItem?.productPackage && (
                  <TextView
                    translate
                    title={'insurance_screen.package'}
                    value={itemDetail?.ordersItem?.productPackage}
                  />
                )}
                {effectDate ? (
                  <TextView
                    translate
                    title={'insurance_screen.effect_from'}
                    value={formatEffectDate || ''}
                  />
                ) : null}
                <TextView
                  translate
                  title={'insurance_screen.total_premium'}
                  value={`${formatNumber(
                    screenState?.form?.ordersItem?.price || itemDetail?.ordersItem?.price || '0'
                  )} ${translate('common.currency')}`}
                />
                <TextView
                  translate
                  bold
                  title={'insurance_screen.amount_to_be_paid'}
                  value={`${formatNumber(
                    screenState?.form?.ordersItem?.price || itemDetail?.ordersItem?.price || '0'
                  )} ${translate('common.currency')}`}
                />
              </>
            </ExpandView>
          </View>
        </>
        <View style={styles.banner}>
          <BecomeTopener />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: scale(15) }]}>
          <SecondaryButton translate title={'common.pay_later'} onPress={onPaymentLater} />
        </View>
        <View style={styles.flex}>
          <PrimaryButton translate title={'common.payment'} onPress={onContinue} />
        </View>
      </View>
    </>
  );
};

export default WithLoading(InsuranceOrderInfoPurchaseScreen, [
  INSURANCE.EDIT_INSURANCE_ORDER.HANDLER
]);

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  flex: {
    flex: 1
  },
  list: {
    paddingVertical: SPACING.Large
  },
  title: {
    marginHorizontal: SPACING.Medium,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading
  },
  progressContainer: {
    marginTop: SPACING.Large,
    marginBottom: SPACING.Medium
  },
  footer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    backgroundColor: BACKGROUND_COLOR.White,
    flexDirection: 'row'
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  },
  expandView: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal
  },
  inputContainer: {
    // marginVertical: SPACING.Normal
  },
  banner: {
    marginTop: SPACING.Large
  }
});
