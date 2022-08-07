import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  CommonTabHeader,
  ExpandView,
  Heading,
  RowSpace,
  SecondaryButton,
  OutLineButton,
  SubHead,
  WithLoading,
  AppLoading
} from '../../../components/';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import FloatFooter from '../../../components/float_footer';
import PrimaryButton from '../../../components/primary_button';
import { FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import {
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  CUSTOM_COLOR,
  TEXT_COLOR
} from '../../../constants/colors';
import {
  CANCEL_EXTRA_SERVICE,
  CANCEL_SUCCESS,
  CONFIRM_QUOTE_SERVICE,
  ERROR_PROCESS
} from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { SDK_EVENT_NAME } from '../../../global/app';
import { EXTRA_SERVICE_ORDER_STATUS } from '../../../global/order_status';
import { ScheduleType } from '../../../global/schedule_type';
import { isIphoneX } from '../../../helpers/device';

import {
  createExtraServicePaymentTransactionHandle,
  getExtraServiceOrderDetailClear,
  getExtraServiceOrderDetailHandle,
  updateExtraServiceOrderStatusClear,
  updateExtraServiceOrderStatusHandle
} from '../../../redux/actions/extraService';

import { getShowAlertError } from '../../../redux/actions/system';
import { EXTRA_SERVICE, SCHEDULE } from '../../../redux/actionsType';
import { emitEvent } from '../../../utils/eventEmit';
import { scale } from '../../../utils/responsive';
import InfoTab from './tab_detail/info_tab';
import Status from './tab_detail/order_status';
import Quote from './tab_detail/quote_tab';
import Schedule from './tab_detail/schedule_tab';
import { exportFileHandle } from '../../../redux/actions/schedule';
import { store } from '../../../redux/store/configureStore';

const tabScreen = {
  INFO: 0,
  QUOTES: 1,
  SCHEDULE: 2
};

const APPLICATION_PRODUCT_TAB = [
  { id: 0, title: 'insurance_record_details.information' },
  { id: 1, title: 'insurance_record_details.quotes' },
  { id: 2, title: 'insurance_record_details.appointment_schedule' }
];

const ApplicationServiceDetail = props => {
  const refC = useRef();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orderId = route.params?.item?.id;
  const { item } = props.route.params;
  const goBack = route.params?.goBack;
  const [tabIndex, setTabIndex] = useState(0);
  const orderDetail = useSelector(state => state.extraService.orderDetail);
  const paymentResult = useSelector(state => state.extraService.paymentResult);
  const updateStatusResult = useSelector(state => state.extraService.updateStatusResult);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        navigation.navigate(SCREENS_NAME.APPLICATION_LIST_SCREEN, { tab: 2 });
      }
    });
  }, [navigation]);

  const onUpdateOrderStatus = useCallback(
    newStatus => {
      dispatch(updateExtraServiceOrderStatusHandle({ id: orderId, status: newStatus }));
    },
    [dispatch, orderId]
  );

  const onCancel = useCallback(() => {
    let messageCancel = 'errMessage.cancel_extra_service_message';
    if (
      orderDetail.status === EXTRA_SERVICE_ORDER_STATUS.New ||
      orderDetail.status === EXTRA_SERVICE_ORDER_STATUS.PartnerInvestigating ||
      orderDetail.status === EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment
    ) {
      messageCancel = 'errMessage.cancel_extra_service_message2';
    }
    dispatch(
      getShowAlertError({
        ...CANCEL_EXTRA_SERVICE,
        message: messageCancel,
        confirmAction: () => onUpdateOrderStatus(EXTRA_SERVICE_ORDER_STATUS.Canceled)
      })
    );
  }, [dispatch, orderDetail, onUpdateOrderStatus]);

  const onConfirmQuote = useCallback(() => {
    dispatch(
      getShowAlertError({
        ...CONFIRM_QUOTE_SERVICE,
        confirmAction: () => onUpdateOrderStatus(EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment)
      })
    );
  }, [dispatch, onUpdateOrderStatus]);

  const { profile, topenIdProfile } = useSelector(state => state.member);

  const onPaymentRemaining = useCallback(() => {
    let price = Math.round(orderDetail?.ordersItem?.prepayment) || orderDetail?.ordersItem?.price;

    if (EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment === orderDetail.status) {
      price = Math.round(orderDetail?.ordersItem?.remainingFee) || orderDetail?.ordersItem?.price;
    }
    const memberId = store.getState().auth.memberId;
    setLoading(true);
    const callback = data => {
      setLoading(false);
      if (data) {
        const { urlPayment, isSandbox, tmnCode, invoiceId } = data;
        const paymentInfo = {
          amount: price,
          paymentUrl: urlPayment,
          isSandbox,
          tmnCode,
          invoiceId
        };
        navigation.navigate(SCREENS_NAME.VN_PAY_SCREEN, {
          orderInfo: orderDetail,
          flowCode: 'AdditionalServicePayment',
          headerSuccess: [
            EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment,
            EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment
          ].includes(orderDetail.status)
            ? 'application_list.successful_first_payment'
            : 'application_list.remaining_payment_successful',
          paymentInfo
        });
      }
    };

    dispatch(
      createExtraServicePaymentTransactionHandle({
        memberId,
        orderId: orderDetail?.orderId || '',
        callback
      })
    );
  }, [dispatch, orderDetail, profile, topenIdProfile]);

  const onPayment = useCallback(() => {
    emitEvent({ event_name: SDK_EVENT_NAME.EXTRA_SERVICE_APPLICATION_UPDATE, data: orderDetail });
    if (orderDetail.status === EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment) {
      navigation.navigate(SCREENS_NAME.POLICY_APPLICATION_EXTRA_SERVICE_SCREEN, {
        orderDetail: orderDetail
      });
    } else {
      onPaymentRemaining();
    }
  }, [navigation, orderDetail, onPaymentRemaining]);

  React.useEffect(() => {
    dispatch(getExtraServiceOrderDetailHandle({ orderId }));
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getExtraServiceOrderDetailHandle({ orderId }));
    });
    return () => {
      focusListener();
      dispatch(getExtraServiceOrderDetailClear());
    };
  }, [dispatch, orderId, navigation]);

  React.useEffect(() => {
    dispatch(updateExtraServiceOrderStatusClear());
    if (updateStatusResult?.isSuccess) {
      dispatch(getExtraServiceOrderDetailHandle({ orderId }));
      if (updateStatusResult.status === EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment) {
        //dispatch(getShowAlertError(CONFIRM_QUOTE_SUCCESS));
      } else {
        dispatch(getShowAlertError(CANCEL_SUCCESS));
      }
      emitEvent({ event_name: SDK_EVENT_NAME.EXTRA_SERVICE_APPLICATION_UPDATE, data: orderDetail });
    } else if (updateStatusResult?.isError) {
      dispatch(getShowAlertError(ERROR_PROCESS));
    }
  }, [dispatch, updateStatusResult, orderId, orderDetail]);

  React.useEffect(() => {
    // effect: cancelASP
  }, [dispatch, paymentResult]);

  const onCreateSchedule = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CREATE_SCHEDULE_SCREEN, {
      reference: item,
      scheduleType: ScheduleType.ADDED_SERVICE,
      callback: refC.current?.onRefreshSchedule,
      from: SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN
    });
  }, [navigation, item]);

  const onExportFile = useCallback(() => {
    dispatch(exportFileHandle({ orderId: orderDetail?.orderId }));
  }, [dispatch, orderDetail]);

  const ButtonActionBottom = useCallback(() => {
    return (
      <FloatFooter style={styles.groupFloatFooter}>
        {[
          EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment,
          EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment
        ].includes(orderDetail?.status) && tabIndex !== 2 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%'
            }}>
            <SecondaryButton
              translate
              onPress={onCancel}
              title={'profile_info.cancel'}
              style={{ marginRight: SPACING.Medium, flex: 1 }}
            />
            <PrimaryButton
              translate
              onPress={onPayment}
              title={'profile_info.payment'}
              style={{ flex: 1 }}
            />
          </View>
        ) : null}
        {tabIndex !== 2 ? (
          [
            EXTRA_SERVICE_ORDER_STATUS.New,
            EXTRA_SERVICE_ORDER_STATUS.Draft,
            EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment,
            EXTRA_SERVICE_ORDER_STATUS.PartnerInvestigating
          ].includes(orderDetail?.status) ? (
            <PrimaryButton translate onPress={onCancel} title={'profile_info.cancel'} />
          ) : [EXTRA_SERVICE_ORDER_STATUS.WaitingForQuote].includes(orderDetail?.status) ? (
            <View style={styles.buttonConfirmQuoteArea}>
              <PrimaryButton
                outline
                translate
                onPress={onCancel}
                title={'profile_info.cancel'}
                width={'48%'}
                backgroundColor={BUTTON_COLOR.DisablePrimary}
              />
              <PrimaryButton
                width={'48%'}
                translate
                onPress={onConfirmQuote}
                title={'application_list.confirm_quote'}
              />
            </View>
          ) : null
        ) : null}
        {tabIndex === 2 ? (
          <PrimaryButton
            translate
            title={'schedule.btn_create'}
            onPress={onCreateSchedule}
            style={{ flex: 1 }}
          />
        ) : null}
      </FloatFooter>
    );
  }, [orderDetail?.status, onCancel, onPayment, tabIndex]);

  const isRenderTab = ![
    EXTRA_SERVICE_ORDER_STATUS.Canceled,
    EXTRA_SERVICE_ORDER_STATUS.Completed
  ].includes(orderDetail?.status);

  const dataValue = { orderId, itemDetail: orderDetail, item };
  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <AppLoading loading={isLoading} />
      <View style={styles.headerContainer}>
        <View style={styles.topHeader}>
          <Heading semiBold style={styles.productName}>
            {orderDetail?.ordersItem?.name || ''}
          </Heading>
          {orderDetail?.status ? <Status status={orderDetail?.status} /> : null}
        </View>
        <Divider />
        <View style={styles.bottomHeader}>
          <View style={styles.inforText}>
            <AppText translate style={styles.label}>
              {'profile_info.customer'}
            </AppText>
            <SubHead semiBold style={styles.contact}>
              {orderDetail?.contactName}
            </SubHead>
          </View>
          <RowSpace />
          <View style={styles.inforText}>
            <AppText translate style={styles.label}>
              {'profile_info.profile_code'}
            </AppText>
            <SubHead semiBold style={styles.code}>
              {orderDetail?.code}
            </SubHead>
          </View>
        </View>
        {tabIndex === 2 ? (
          <>
            <Divider />
            <View style={styles.topHeader}>
              <OutLineButton
                translate
                title={'schedule.export_file'}
                onPress={onExportFile}
                style={styles.outLine}
              />
            </View>
          </>
        ) : null}
      </View>
      {isRenderTab ? (
        <>
          <CommonTabHeader
            translate
            tabs={APPLICATION_PRODUCT_TAB}
            tabIndex={tabIndex}
            onPress={id => {
              setTabIndex(id);
            }}
          />
          {tabIndex !== tabScreen.SCHEDULE ? (
            <ScrollView
              style={styles.body}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.wrapper}>
              {tabIndex === tabScreen.INFO ? <InfoTab orderDetail={orderDetail} /> : null}
              {tabIndex === tabScreen.QUOTES ? <Quote orderDetail={orderDetail} /> : null}
            </ScrollView>
          ) : null}
          {tabIndex === tabScreen.SCHEDULE ? (
            <Schedule route={props.route} ref={refC} {...dataValue} />
          ) : null}
          <ButtonActionBottom />
        </>
      ) : (
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.wrapper, { paddingTop: SPACING.Small }]}>
          <InfoTab orderDetail={orderDetail} cannotExpand={false} />
          <ExpandView
            translateTitle
            title={
              [EXTRA_SERVICE_ORDER_STATUS.Completed, EXTRA_SERVICE_ORDER_STATUS.Canceled].includes(
                orderDetail?.status
              )
                ? 'profile_info.order_details'
                : 'profile_info.quote_information'
            }
            expanded
            collapseChildren={null}>
            <Quote orderDetail={orderDetail} hasTitle={false} isExpand />
          </ExpandView>
        </ScrollView>
      )}
    </View>
  );
};

export default WithLoading(ApplicationServiceDetail, [
  EXTRA_SERVICE.GET_ORDER_DETAIL.HANDLER,
  EXTRA_SERVICE.UPDATE_ORDER_STATUS.HANDLER,
  SCHEDULE.EXPORT_FILE.HANDLER
]);

const styles = StyleSheet.create({
  label: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  // textNaviRight: {
  //   color: TEXT_COLOR.Primary
  // },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  wrapper: {
    paddingTop: SPACING.XMedium,
    paddingBottom: scale(100),
    paddingHorizontal: SPACING.Medium
  },
  productName: {
    flex: 1,
    marginRight: SPACING.Normal
  },
  body: {},
  title: {
    marginTop: scale(12),
    marginBottom: scale(8),
    fontSize: FONT_SIZE.BodyText
  },
  groupCallSupport: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: SPACING.Normal
  },
  textCallSupport: {
    color: TEXT_COLOR.PersianGreen
  },

  bwSpace: {
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: FONT_SIZE.Heading
  },
  viewState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium,
    borderRadius: BORDER_RADIUS
  },
  textState: {
    color: CUSTOM_COLOR.White
  },
  viewAction: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: '#F7F8FB',
    padding: scale(18),
    margin: scale(2)
  },
  itemTab: {
    alignItems: 'center'
  },
  groupFloatFooter: {
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    flexDirection: 'row',
    backgroundColor: CUSTOM_COLOR.White
  },
  btnFloatFooter: {
    marginVertical: SPACING.Small
  },
  space: {
    paddingStart: SPACING.Medium
  },
  headerContainer: {
    ...Shadow,
    marginHorizontal: SPACING.Medium,
    marginTop: SPACING.Large,
    marginBottom: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    padding: SPACING.Medium
  },
  bottomHeader: {
    paddingVertical: SPACING.Medium,
    paddingHorizontal: SPACING.Medium
  },
  customBottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  inforText: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonConfirmQuoteArea: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1
  }
});
