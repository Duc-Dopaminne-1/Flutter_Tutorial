import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  clearCreateOrEditTransaction,
  createOrEditTransactionHandle
} from '../../../redux/actions/cashout';
import {
  getFinanceDealOrderFormClear,
  getFinanceDealOrderFormHandle,
  needSupportClear,
  needSupportHandle,
  setLeadContactForCredit,
  createFinaneDealOrderClear,
  editDealHandle,
  deleteFinaneDealOrderHandle
} from '../../../redux/actions/credit';
import { getDepositMoneyHandler } from '../../../redux/actions/deposit';
import { getClearAlertError, getShowAlertError } from '../../../redux/actions/system';
import { CASHOUT, CREDIT } from '../../../redux/actionsType';
import {
  ICCalendarBlank,
  ICEnvelop,
  ICGreenQuestion2,
  ICOrangeQuestion,
  ICPhoneCall
} from '../../../assets/icons';
import {
  CommonTabHeader,
  Heading,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../components/';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import {
  CANCEL_CREDIT,
  CANCEL_SUCCESS,
  CHANGE_CREDIT_PRODUCT,
  CONFIRM_PAYMENT,
  CONFIRM_SEND,
  ERROR_PROCESS,
  REQUEST_UDPATE_EMAIL,
  REQUIRE_SUPPORT_3,
  REQUIRE_SUPPORT_4,
  SEND_SUCCESS,
  SEND_SUCCESS_2
} from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import ActionUtils from '../../../helpers/actionUtils';
import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { LDC_ATTRIBUTE_CODE } from '../../../global/entity_type';
import { MEMBER_TYPE } from '../../../global/member_type';
import { CREDIT_ORDER_STATUS } from '../../../global/order_status';
import { ScheduleType } from '../../../global/schedule_type';
import { useEmptyForm } from '../../../hooks/useEmptyForm';
import { scale } from '../../../utils/responsive';
import createRefundRequest from '../components/refund_request_modal';
import FeedbackTab from './tab_detail/feedback_tab';
import InfoTab from './tab_detail/info_tab';
import OrderStatus from './tab_detail/order_status';
import ProductTab from './tab_detail/product_tab';
import ScheduleTab from './tab_detail/schedule_tab';
import { isIphoneX } from '../../../helpers/device';
import themeContext from '../../../constants/theme/themeContext';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';

const CreditOrderDetailScreen = props => {
  const theme = useContext(themeContext);
  const refC = useRef();
  const TabItem = [
    {
      id: 0,
      title: 'insurance_record_details.information',
      tab: tabProps => <InfoTab {...tabProps} />
    },
    {
      id: 1,
      title: 'insurance_record_details.appointment_schedule',
      tab: tabProps => <ScheduleTab route={props.route} ref={refC} {...tabProps} />
    },
    {
      id: 2,
      title: 'insurance_record_details.product',
      tab: tabProps => <ProductTab {...tabProps} />
    },
    {
      id: 3,
      title: 'insurance_record_details.feedback',
      tab: tabProps => <FeedbackTab {...tabProps} />
    }
  ];

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { orderId, item, goBack } = props.route.params;
  const role = useSelector(state => state.auth.role);
  const fetchData = useSelector(state => state.credit.financeDealOrderForm);
  const createOrEditResult = useSelector(state => state.credit.createOrEditResult);
  const profile = useSelector(state => state.member.profile);
  const isNeedSupport = useSelector(state => state.credit.isNeedSupport);
  const isMyDealForMember = useSelector(state => state.credit.isMyDeal);
  const depositMethod = useSelector(state => state.deposit.depositMethod);

  const [itemDetail, setItemDetail] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const topenId = useSelector(state => state.auth.topenId);
  const isSuccess = useSelector(state => state.cashout.isSuccess);
  const isFocused = useIsFocused();
  const { topenIdProfile } = useSelector(state => state.member);
  const [helpBoxVisible, setHelpBoxVisible] = useState(false);
  const [marginTop, setMarginTop] = useState(0);
  const [typePayment, setTypePayment] = useState(0);
  const [data, setData] = useState([]);
  const button = React.useRef(null);

  useEffect(() => {
    try {
      if (depositMethod !== '[]') {
        setData(JSON.parse(depositMethod));
      } else {
        setData([]);
      }
    } catch (error) {}
  }, [depositMethod]);

  const onCloseHelpBox = useCallback(() => {
    setHelpBoxVisible(false);
  }, []);

  useEffect(() => {
    dispatch(
      getFinanceDealOrderFormHandle({
        orderId,
        isTopener: role === MEMBER_TYPE.Topener ? true : false
      })
    );
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getClearAlertError());
      dispatch(
        getFinanceDealOrderFormHandle({
          orderId,
          isTopener: role === MEMBER_TYPE.Topener ? true : false
        })
      );
    });
    return () => {
      focusListener();
      dispatch(getFinanceDealOrderFormClear());
    };
  }, [dispatch, orderId, navigation]);

  useEffect(() => {
    setItemDetail(fetchData);
  }, [fetchData]);

  const onSend = useCallback(() => {
    if (role === MEMBER_TYPE.Topener || item.depositStatus === 'Deposited') {
      dispatch(
        getShowAlertError({
          ...CONFIRM_SEND,
          confirmAction: () =>
            updateCreditOrder(CREDIT_ORDER_STATUS.WaitingForOperatorAcceptance, 'send')
        })
      );
      return;
    }

    dispatch(
      getShowAlertError({
        ...CONFIRM_PAYMENT,
        cancelAction: () => updateCreditOrder(CREDIT_ORDER_STATUS.WaitingForPayment, 'send2'),
        confirmAction: () => updateCreditOrder(CREDIT_ORDER_STATUS.WaitingForPayment, 'continue')
      })
    );
  }, [role, dispatch, updateCreditOrder, itemDetail]); // don't remove itemDetail

  const gotoProductList = useCallback(() => {
    dispatch(
      setLeadContactForCredit({
        reuseForm: itemDetail,
        filter: {
          loan: itemDetail?.ordersItem?.loanAmount,
          duration: itemDetail?.ordersItem?.loanPeriod,
          categoryId: itemDetail.ordersItem?.categoryId,
          categoryName: itemDetail.ordersItem?.categoryName
        }
      })
    );
    navigation.navigate(SCREENS_NAME.CREDIT_FILTER_SCREEN);
  }, [itemDetail, dispatch, navigation]);

  const onChangeProduct = useCallback(() => {
    dispatch(
      getShowAlertError({
        ...CHANGE_CREDIT_PRODUCT,
        confirmAction: () => gotoProductList()
      })
    );
  }, [dispatch, gotoProductList]);

  const onCreateSchedule = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CREATE_SCHEDULE_SCREEN, {
      reference: item,
      scheduleType: ScheduleType.DEAL,
      callback: refC.current?.onRefreshSchedule,
      from: SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN
    });
  }, [navigation, item]);

  const onCancelOrder = useCallback(() => {
    dispatch(
      getShowAlertError({
        ...CANCEL_CREDIT,
        confirmAction: () =>
          dispatch(deleteFinaneDealOrderHandle({ orderId: itemDetail?.id, action: 'cancel' }))
      })
    );
  }, [dispatch, itemDetail]); // don't remove itemDetail

  const updateCreditOrder = useCallback(
    (newStatus, action) => {
      dispatch(
        editDealHandle({
          form: { ...itemDetail, status: newStatus },
          action
        })
      );
    },
    [itemDetail, dispatch]
  );

  useEffect(() => {
    dispatch(createFinaneDealOrderClear());
    if (createOrEditResult?.isSuccess) {
      if (createOrEditResult?.action === 'send') {
        emitEvent({ event_name: SDK_EVENT_NAME.CREDIT_APPLICATION_UPDATE, data: itemDetail });
        dispatch(
          getFinanceDealOrderFormHandle({
            orderId
          })
        );
        dispatch(getShowAlertError(SEND_SUCCESS));
      } else if (createOrEditResult?.action === 'cancel') {
        emitEvent({ event_name: SDK_EVENT_NAME.CREDIT_APPLICATION_UPDATE, data: itemDetail });
        dispatch(
          getFinanceDealOrderFormHandle({
            orderId
          })
        );
        dispatch(getShowAlertError(CANCEL_SUCCESS));
      } else if (createOrEditResult?.action === 'continue') {
        dispatch(getDepositMoneyHandler());
        navigation.navigate(SCREENS_NAME.POLICY_CREDIT_ORDER_SCREEN, {
          form: itemDetail,
          backToProfileScreen: true
        });
      } else if (createOrEditResult?.action === 'send2') {
        emitEvent({ event_name: SDK_EVENT_NAME.CREDIT_APPLICATION_UPDATE, data: itemDetail });
        dispatch(
          getFinanceDealOrderFormHandle({
            orderId
          })
        );
        dispatch(getShowAlertError(SEND_SUCCESS_2));
      }
    } else if (createOrEditResult?.isError) {
      dispatch(getShowAlertError(ERROR_PROCESS));
    }
  }, [dispatch, navigation, createOrEditResult, itemDetail, orderId]);

  const isFillContact = useEmptyForm(itemDetail?.contact?.listComponent);
  const isFillProduct = useEmptyForm(itemDetail?.productForm?.listComponent);

  const payment = useCallback(() => {
    updateCreditOrder(CREDIT_ORDER_STATUS.WaitingForPayment, 'continue');
  }, [updateCreditOrder]);

  useEffect(() => {
    let RightButton = () => null;
    let canSend = isFillContact && isFillProduct;
    if (
      [CREDIT_ORDER_STATUS.Draft, CREDIT_ORDER_STATUS.WaitingForUpdate].includes(fetchData?.status)
    ) {
      RightButton = () => (
        <TouchableOpacity
          onPress={onSend}
          disabled={
            !canSend ||
            isMyDealForMember ||
            (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
              ? true
              : false
          }>
          <AppText
            translate
            semiBold
            style={[styles.status, !canSend ? { color: TEXT_COLOR.ShuttleGray } : {}]}>
            {'insurance_record_details.send_records'}
          </AppText>
        </TouchableOpacity>
      );
    }
    navigation.setOptions({
      RightComponent: () => (
        <View style={{ marginLeft: SPACING.Medium }}>
          <RightButton />
        </View>
      ),
      backAction: () => {
        navigation.navigate(SCREENS_NAME.APPLICATION_LIST_SCREEN, { tab: 0 });
      }
    });
  }, [navigation, fetchData, onSend, isFillContact, isFillProduct, isMyDealForMember]);

  useEffect(() => {
    if (data.length > 0) {
      data.forEach(el => {
        if (el.Code === 'PaymentAccount') {
          setTypePayment(0);
        } else {
          setTypePayment(1);
        }
      });
    }
  }, [data]);

  const refundRequest = useCallback(() => {
    if (data.length < 2) {
      if (typePayment === 0) {
        dispatch(
          createOrEditTransactionHandle({
            orderId: item?.id || '',
            memberId: profile?.id || ''
          })
        );
      }
      if (typePayment === 1) {
        navigation.navigate(SCREENS_NAME.INFO_ACCOUNT_DEPOSIT, {
          depositValue: item?.depositValue || '0',
          item
        });
      }
    } else {
      dispatch(getDepositMoneyHandler());
      createRefundRequest(
        '',
        '',
        null,
        () => {
          navigation.navigate(SCREENS_NAME.INFO_ACCOUNT_DEPOSIT, {
            depositValue: item?.depositValue || '0',
            item
          });
        },
        () => {
          emitEvent({ event_name: SDK_EVENT_NAME.CREDIT_APPLICATION_REFUND, data: itemDetail });
          dispatch(
            createOrEditTransactionHandle({
              orderId: item?.id || '',
              memberId: profile?.id || ''
            })
          );
        }
      );
    }
  }, [
    data.length,
    dispatch,
    item,
    navigation,
    profile?.id,
    role,
    topenId,
    topenIdProfile?.name,
    topenIdProfile?.phone,
    typePayment,
    itemDetail
  ]);

  React.useEffect(() => {
    if (isSuccess && isFocused) {
      dispatch(clearCreateOrEditTransaction());
      navigation.navigate(SCREENS_NAME.REFUND_REQUEST_SUCCESS);
    }
  }, [isSuccess, dispatch]);
  const actionButton = useCallback(
    () => {
      let button = null;
      if ([CREDIT_ORDER_STATUS.Draft].includes(itemDetail?.status)) {
        if (tabIndex === 1) {
          button = (
            <>
              <SecondaryButton
                translate
                title={'profile_info.cancel'}
                onPress={onCancelOrder}
                style={{ flex: 1, marginRight: SPACING.Medium }}
                route={props?.route}
                disabled={
                  isMyDealForMember ||
                  (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                    ? true
                    : false
                }
              />
              <PrimaryButton
                translate
                title={'schedule.btn_create'}
                onPress={onCreateSchedule}
                style={{ flex: 1 }}
                route={props?.route}
                disabled={
                  isMyDealForMember ||
                  (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                    ? true
                    : false
                }
              />
            </>
          );
        } else if (tabIndex === 2) {
          if (itemDetail?.status === CREDIT_ORDER_STATUS.WaitingForPayment) {
            button = (
              <>
                <SecondaryButton
                  translate
                  title={'profile_info.product_change'}
                  onPress={onChangeProduct}
                  style={{ flex: 1, marginRight: SPACING.Medium }}
                  route={props?.route}
                  disabled={
                    isMyDealForMember ||
                    (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                      ? true
                      : false
                  }
                />
                <PrimaryButton
                  translate
                  onPress={payment}
                  style={{ flex: 1 }}
                  title={'common.payment'}
                  route={props?.route}
                  disabled={
                    isMyDealForMember ||
                    (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                      ? true
                      : false
                  }
                />
              </>
            );
          } else {
            button = (
              <PrimaryButton
                translate
                onPress={onChangeProduct}
                title={'profile_info.product_change'}
                route={props?.route}
                disabled={
                  isMyDealForMember ||
                  (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                    ? true
                    : false
                }
              />
            );
          }
        } else {
          if (itemDetail?.status === CREDIT_ORDER_STATUS.WaitingForPayment) {
            button = (
              <>
                <SecondaryButton
                  translate
                  title={'profile_info.cancel'}
                  onPress={onCancelOrder}
                  style={{ flex: 1, marginRight: SPACING.Medium }}
                  route={props?.route}
                  disabled={
                    isMyDealForMember ||
                    (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                      ? true
                      : false
                  }
                />
                <PrimaryButton
                  translate
                  onPress={payment}
                  style={{ flex: 1 }}
                  title={'common.payment'}
                  route={props?.route}
                  disabled={
                    isMyDealForMember ||
                    (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                      ? true
                      : false
                  }
                />
              </>
            );
          } else {
            button = (
              <PrimaryButton
                translate
                title={'profile_info.cancel'}
                onPress={onCancelOrder}
                route={props?.route}
                disabled={
                  isMyDealForMember ||
                  (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                    ? true
                    : false
                }
              />
            );
          }
        }
      } else if (
        [
          CREDIT_ORDER_STATUS.WaitingForUpdate,
          CREDIT_ORDER_STATUS.WaitingForOperatorAcceptance,
          CREDIT_ORDER_STATUS.WaitingForPartnerAcceptance,
          CREDIT_ORDER_STATUS.WaitingForPayment,
          CREDIT_ORDER_STATUS.WaitingForAssessment,
          CREDIT_ORDER_STATUS.Approved
        ].includes(itemDetail?.status)
      ) {
        if (tabIndex === 1) {
          button = (
            <>
              <SecondaryButton
                translate
                title={'profile_info.cancel'}
                onPress={onCancelOrder}
                style={{ flex: 1, marginRight: SPACING.Medium }}
                route={props?.route}
                disabled={
                  isMyDealForMember ||
                  (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                    ? true
                    : false
                }
              />
              <PrimaryButton
                translate
                title={'schedule.btn_create'}
                onPress={onCreateSchedule}
                style={{ flex: 1 }}
                route={props?.route}
                disabled={
                  isMyDealForMember ||
                  (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                    ? true
                    : false
                }
              />
            </>
          );
        } else {
          if (itemDetail?.status === CREDIT_ORDER_STATUS.WaitingForPayment) {
            button = (
              <>
                <SecondaryButton
                  translate
                  title={'profile_info.cancel'}
                  onPress={onCancelOrder}
                  style={{ flex: 1, marginRight: SPACING.Medium }}
                  route={props?.route}
                  disabled={
                    isMyDealForMember ||
                    (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                      ? true
                      : false
                  }
                />
                <PrimaryButton
                  translate
                  onPress={payment}
                  style={{ flex: 1 }}
                  title={'common.payment'}
                  route={props?.route}
                  disabled={
                    isMyDealForMember ||
                    (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                      ? true
                      : false
                  }
                />
              </>
            );
          } else {
            button = (
              <SecondaryButton
                translate
                title={'profile_info.cancel'}
                onPress={onCancelOrder}
                route={props?.route}
                disabled={
                  isMyDealForMember ||
                  (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                    ? true
                    : false
                }
              />
            );
          }
        }
      } else if (
        [CREDIT_ORDER_STATUS.WaitingForAssessment, CREDIT_ORDER_STATUS.Disbursing].includes(
          itemDetail?.status
        )
      ) {
        if (tabIndex === 1) {
          button = (
            <PrimaryButton
              translate
              title={'schedule.btn_create'}
              onPress={onCreateSchedule}
              route={props?.route}
              disabled={
                isMyDealForMember ||
                (fetchData?.isNeedSupport && !fetchData?.isMyDeal && !fetchData?.isTopener)
                  ? true
                  : false
              }
            />
          );
        }
      } else if (
        [
          CREDIT_ORDER_STATUS.Rejected,
          CREDIT_ORDER_STATUS.Completed,
          CREDIT_ORDER_STATUS.Canceled
        ].includes(itemDetail?.status) &&
        data.length > 0
      ) {
        if (role === MEMBER_TYPE.Member) {
          button = (
            <PrimaryButton
              translate
              onPress={refundRequest}
              title={'account.refund_request'}
              disabled={!(item?.depositStatus === 'Deposited')}
            />
          );
        }
      }
      return button ? <View style={styles.actionContainer}>{button}</View> : null;
    },
    [
      itemDetail?.status,
      tabIndex,
      onCancelOrder,
      onCreateSchedule,
      props?.route,
      onChangeProduct,
      payment,
      isMyDealForMember,
      fetchData,
      item,
      refundRequest,
      role,
      data
    ],
    item.status
  );

  const onUpdateInfo = data => {
    setItemDetail(data);
  };

  const onNavigation = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CREATE_SCHEDULE_SCREEN);
  }, [navigation]);

  useEffect(() => {
    if (fetchData?.contact?.listComponent?.length > 0) {
      fetchData?.contact?.listComponent?.map(group => {
        group?.eavAttribute?.map(att => {
          if (att?.attributeCode?.toLowerCase() === LDC_ATTRIBUTE_CODE.Phone) {
            setPhone(att.value);
          }
          if (att?.attributeCode?.toLowerCase() === LDC_ATTRIBUTE_CODE.Email) {
            setEmail(att.value);
          }
        });
      });
    }
  }, [fetchData.contact?.listComponent]);

  const onCall = useCallback(() => {
    ActionUtils.onCall({ phone });
  }, [phone]);

  const onMail = useCallback(() => {
    ActionUtils.onEmail({
      email,
      onError: () => {
        dispatch(getShowAlertError(REQUEST_UDPATE_EMAIL));
      }
    });
  }, [email, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(needSupportClear());
    };
  }, [dispatch]);

  const showHelpbox = useCallback(() => {
    button.current.measure((fx, fy, width, height, px, py) => {
      setMarginTop(py);
      setHelpBoxVisible(true);
    });
  }, []);

  const onSupportRequired = useCallback(
    action => {
      dispatch(
        getShowAlertError({
          ...REQUIRE_SUPPORT_3,
          confirmAction: () => onSubmitSupportRequest(action, fetchData?.id)
        })
      );
    },
    [dispatch, onSubmitSupportRequest, fetchData]
  );

  const onSubmitSupportRequest = useCallback(
    (action, id) => {
      dispatch(
        needSupportHandle({
          params: {
            memberId: profile?.id,
            dealId: id
          },
          action,
          callback: (err, res) => {
            if (!err) {
              dispatch(getShowAlertError(REQUIRE_SUPPORT_4));
            } else {
            }
          }
        })
      );
    },
    [dispatch, profile?.id]
  );

  const stylePrimaryText = {
    color: theme?.text?.primary,
    fontFamily: theme?.fonts?.SEMIBOLD
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.statusTitleContainer}>
          <Heading style={styles.statusTitle} numberOfLines={2}>
            {itemDetail?.ordersItem?.name || item?.productName}
          </Heading>
          {itemDetail?.status || item?.status ? (
            <OrderStatus status={itemDetail?.status || item?.status} />
          ) : null}
        </View>
        <Divider />
        <View style={styles.statusContent}>
          <View style={styles.row}>
            <AppText translate style={styles.title}>
              {'user_type.customer'}
            </AppText>
            <Text style={[styles.value, stylePrimaryText]} numberOfLines={2}>
              {itemDetail?.contactName || item?.contactName}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: SPACING.XNormal }]}>
            <AppText translate style={styles.title}>
              {'profile_info.profile_code'}
            </AppText>
            <Text style={[styles.value, stylePrimaryText]} numberOfLines={2}>
              {itemDetail?.code || item?.code}
            </Text>
          </View>
          <View style={styles.bottomHeader}>
            <AppText translate style={styles.title}>
              {'lead_detail.contact_to_customer'}
            </AppText>

            <View style={styles.iconArea}>
              <TouchableOpacity onPress={onCreateSchedule}>
                <ICCalendarBlank color1={theme?.icon?.color1} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onCall}>
                <ICPhoneCall color1={theme?.icon?.color1} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onMail}>
                <ICEnvelop color1={theme?.icon?.color1} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {(isNeedSupport && fetchData?.supportorId === null) ||
      (fetchData?.isNeedSupport && fetchData?.supportorId === null) ? (
        <View style={styles.waitingSupport}>
          <Text
            style={[
              styles.textTitle,
              { color: theme.app.primaryColor1, fontFamily: theme?.fonts?.SEMIBOLD }
            ]}>
            Đang chờ hỗ trợ
          </Text>
          <TouchableOpacity
            ref={button}
            onPress={showHelpbox}
            hitSlop={{
              top: SPACING.Normal,
              left: SPACING.Normal,
              bottom: SPACING.Normal,
              right: SPACING.Normal
            }}>
            <ICOrangeQuestion color1={theme.icon.color1} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.supportContainer}>
          <View>
            <AppText translate style={[styles.nameTitle]}>
              support.supporter
            </AppText>
            {fetchData?.supportorName ? (
              <Text style={[styles.name, { fontFamily: theme?.fonts?.SEMIBOLD }]}>
                {fetchData.supportorName}
              </Text>
            ) : null}
          </View>
          <View style={styles.supportText}>
            <AppText
              translate
              semiBold
              style={[styles.textTitle, { color: theme.app.primaryColor1 }]}
              onPress={onSupportRequired}>
              application.create_request_support{' '}
            </AppText>
            <TouchableOpacity
              ref={button}
              onPress={showHelpbox}
              hitSlop={{
                top: SPACING.Normal,
                left: SPACING.Normal,
                bottom: SPACING.Normal,
                right: SPACING.Normal
              }}>
              <ICGreenQuestion2 color1={theme.icon.color1} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CommonTabHeader tabs={TabItem} tabIndex={tabIndex} onPress={setTabIndex} justify translate />
      {TabItem[tabIndex].tab({ orderId, itemDetail, item, onUpdateInfo })}
      {actionButton()}
      <Modal
        onBackdropPress={onCloseHelpBox}
        isVisible={helpBoxVisible}
        backdropColor={null}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{
          justifyContent: 'flex-start'
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onCloseHelpBox}
          style={{ marginTop, alignItems: 'flex-end' }}>
          <View style={[styles.triangle]} />
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.noticeView, { backgroundColor: theme.app.primaryColor3 }]}>
            <AppText translate medium style={styles.notice}>
              help_box.request_support
            </AppText>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default WithLoading(CreditOrderDetailScreen, [
  CREDIT.EDIT_DEAL.HANDLER,
  CREDIT.GET_FINANCEDEAL_ORDER_FORM.HANDLER,
  CREDIT.NEED_SUPPORT.HANDLER,
  CASHOUT.CREATE_OR_EDIT_TRANSACTION.HANDLER,
  CREDIT.DELETE_FINANE_DEAL_ORDER.HANDLER
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },

  contentContainer: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  statusContainer: {
    marginTop: SPACING.Large,
    marginBottom: SPACING.Medium,
    marginHorizontal: SPACING.Medium,
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS
  },
  statusTitleContainer: {
    flexDirection: 'row',
    padding: SPACING.Medium,
    justifyContent: 'space-between'
  },
  statusTitle: {
    flex: 1
  },
  statusContent: {
    padding: SPACING.Medium
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  value: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    flex: 1,
    textAlign: 'right'
  },
  status: {
    color: CUSTOM_COLOR.Orange,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginLeft: -SPACING.Medium
  },
  bottomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.XNormal
  },
  iconArea: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between'
  },
  actionContainer: {
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    flexDirection: 'row'
  },
  supportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: SPACING.Medium,
    marginBottom: SPACING.XMedium
  },
  nameTitle: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  name: {
    color: CUSTOM_COLOR.GreenBold,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.Small
  },
  supportText: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginLeft: SPACING.Small,
    marginRight: SPACING.Small
  },

  waitingSupport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: SPACING.Medium,
    marginBottom: SPACING.XMedium
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(8),
    borderRightWidth: scale(8),
    borderBottomWidth: scale(9),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: CUSTOM_COLOR.BlueStone,
    marginRight: SPACING.XNormal
  },
  noticeView: {
    borderRadius: BORDER_RADIUS,
    padding: SPACING.XNormal,
    width: scale(280),
    height: scale(296),
    justifyContent: 'space-between'
  },
  notice: {
    color: CUSTOM_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  }
});
