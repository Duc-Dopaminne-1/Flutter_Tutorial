import { setLoginSuccess } from '../../../redux/actions/auth';
import { clearLeadContactForCredit } from '../../../redux/actions/credit';
import { clearLeadContactForExtraService } from '../../../redux/actions/extraService';
import { clearLeadContactForInsurance } from '../../../redux/actions/insurance';
import { getNewActionClear } from '../../../redux/actions/workflow';
import { ICNext, ICSuccess, ICTick } from '../../../assets/icons';
import { ExpandView, Heading, PrimaryButton } from '../../../components/';
import AppText from '../../../components/app_text';
import FloatFooter from '../../../components/float_footer';
import TextView from '../../../components/text_view';
import { EVENT_TYPE } from '../../../constants/analyticEnums';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import AppsFlyerService from '../../../helpers/AppsFlyerService';
import FirebaseAnalyticsService from '../../../helpers/FirebaseAnalyticsService';
import { formatNumber } from '../../../helpers/formatNumber';
import { formatDate } from '../../../helpers/formatTime';
import { ActionObject } from '../../../models';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { getModel, getDeviceName } from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type';
import { translate } from '../../../i18n';
import { scale } from '../../../utils/responsive';
import SCREENS_NAME from '../../../constants/screens';
import { getAgencyInformationHandle } from '../../../redux/actions/member';

const analyticsInstance = FirebaseAnalyticsService.getInstance();
const appsFlyerInstance = AppsFlyerService.getInstance();

const PaymentResultScreen = props => {
  const {
    navigation,
    route: { params: screenState }
  } = props;

  const dispatch = useDispatch();
  const [header, setHeader] = useState('insurance_screen.payment_successfully');
  const [productScreen, setProductScreen] = useState(SCREENS_NAME.INSURANCE_LIST_SCREEN);
  const [detailScreen, setDetailScreen] = useState(SCREENS_NAME.INSURANCE_ORDER_DETAIL_SCREEN);
  const profile = useSelector(state => state.member.topenIdProfile);
  const { memberId, topenId } = useSelector(state => state.auth);
  const agencyInformation = useSelector(state => state.member.agencyInformation);

  const [deviceName, setDeviceName] = useState();
  const getDevice = async () => {
    const device = await getDeviceName();
    setDeviceName(device);
  };
  console.log('screenState', screenState);
  useLayoutEffect(() => {
    getDevice();
  }, []);

  useLayoutEffect(() => {
    if (memberId) {
      dispatch(getAgencyInformationHandle({ id: memberId }));
    }
  }, [dispatch, memberId]);

  useLayoutEffect(() => {
    let screenName;
    const revenue = screenState?.depositMoney || 0;

    switch (screenState?.flowCode) {
      case 'ExtendTopener':
        {
          screenName = 'screen_name.extend_topener';
          const actionObj = new ActionObject({
            route_name: props.route?.name || '',
            event_name: 'EXTEND_TOPENER_SUCCESS' || '',
            component: 'EXTEND_TOPENER_SUCCESS_SCREEN' || '',
            memberCode: memberId,
            topenId,
            deviceName: `${getModel()}-${deviceName}`
          });
          analyticsInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logRevenue(EVENT_TYPE.REVENUE, revenue);
          dispatch(setLoginSuccess({ role: MEMBER_TYPE.Topener }));
        }
        break;

      case 'UpgradeMember':
        {
          screenName = 'payment_result.membership_level_upgrade';
          const actionObj = new ActionObject({
            route_name: props.route?.name || '',
            event_name: 'UPGRADE_MEMBER_SUCCESS' || '',
            component: 'UPGRADE_MEMBER_SUCCESS_SCREEN' || '',
            memberCode: memberId,
            topenId,
            deviceName: `${getModel()}-${deviceName}`
          });
          analyticsInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logRevenue(EVENT_TYPE.REVENUE, revenue);
          dispatch(setLoginSuccess({ role: MEMBER_TYPE.Topener }));
        }
        break;

      case 'InsurancePayment':
        {
          screenName = 'screen_name.insurance_payment_successful';
          setHeader('payment_result.insurance_payment_successful');
          setProductScreen(SCREENS_NAME.INSURANCE_LIST_SCREEN);
          setDetailScreen(SCREENS_NAME.INSURANCE_ORDER_DETAIL_SCREEN);
          const actionObj = new ActionObject({
            route_name: props.route?.name || '',
            event_name: 'INSURANCE_PAYMENT_SUCCESS' || '',
            component: 'INSURANCE_PAYMENT_SUCCESS_SCREEN' || '',
            memberCode: memberId,
            topenId,
            deviceName: `${getModel()}-${deviceName}`
          });
          analyticsInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logRevenue(EVENT_TYPE.REVENUE, revenue);
        }
        break;

      case 'AdditionalServicePayment':
        {
          screenName = 'screen_name.additional_service_payment_successful';
          setHeader(screenState?.headerSuccess || 'payment_result.payment_success');
          setProductScreen(SCREENS_NAME.EXTRA_SERVICE_LIST_SCREEN);
          setDetailScreen(SCREENS_NAME.EXTRA_SERVICE_ORDER_DETAIL_SCREEN);
          const actionObj = new ActionObject({
            route_name: props.route?.name || '',
            event_name: 'EXTRA_SERVICE_PAYMENT_SUCCESS' || '',
            component: 'EXTRA_SERVICE_PAYMENT_SUCCESS_SCREEN' || '',
            memberCode: memberId,
            topenId,
            deviceName: `${getModel()}-${deviceName}`
          });
          analyticsInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logEvent(EVENT_TYPE.SUBSCRIPTION, actionObj);
          appsFlyerInstance.logRevenue(EVENT_TYPE.REVENUE, revenue);
        }
        break;

      default:
        screenName = 'screen_name.payment';
        break;
    }
    navigation.setOptions({
      hideLeftHeader: true,
      title: screenName,
      translate: true
    });
  }, [
    navigation,
    screenState?.flowCode,
    screenState?.headerSuccess,
    dispatch,
    props.route?.name,
    memberId,
    deviceName,
    // screenState?.invoiceInfo?.amount,
    topenId
  ]);
  const goToInsuranceProductList = useCallback(() => {
    dispatch(getNewActionClear());
    dispatch(clearLeadContactForInsurance());
    dispatch(clearLeadContactForCredit());
    dispatch(clearLeadContactForExtraService());
    navigation.navigate(SCREENS_NAME.MIDDLEWARE);
  }, [dispatch, navigation]);

  const onTransitDetail = useCallback(() => {
    navigation.navigate(detailScreen, {
      item: { ...screenState?.data, id: screenState?.orderInfo?.orderId }
      // withBackScreen: SCREENS_NAME.APPLICATION_LIST_SCREEN
    });
  }, [navigation, screenState, detailScreen]);
  const ResultView = useMemo(() => {
    if (screenState?.flowCode === 'UpgradeMember' || screenState?.flowCode === 'ExtendTopener') {
      return (
        <>
          <ScrollView style={styles.container}>
            <View style={styles.successWrapper}>
              <ICTick />
              {screenState?.flowCode === 'ExtendTopener' ? (
                <Heading translate style={styles.successText}>
                  {'confirm_subscription.congratulations'}
                  {profile?.name?.toUpperCase()}
                  {'confirm_subscription.extend_success'}
                  {formatDate(agencyInformation?.endTopener)}
                </Heading>
              ) : (
                <Heading translate style={styles.successText}>
                  {'confirm_subscription.congratulations'}
                  {profile?.name?.toUpperCase()}
                  {'confirm_subscription.become_topener'}
                  {formatDate(agencyInformation?.endTopener)}
                </Heading>
              )}
            </View>
          </ScrollView>

          <FloatFooter style={styles.backToHome}>
            <PrimaryButton
              translate
              title={'result_additional_services.back_to_home'}
              onPress={() => {
                navigation.navigate(SCREENS_NAME.MIDDLEWARE);
              }}
            />
          </FloatFooter>
        </>
      );
    }
    return (
      <>
        <ScrollView style={styles.container}>
          <View style={styles.flex}>
            <View style={styles.header}>
              <ICSuccess />
            </View>
            <AppText translate bold={true} style={styles.message}>
              {header}
            </AppText>

            <ExpandView
              canExpand={false}
              translateTitle
              style={styles.expandView}
              title={'insurance_screen.profile_information'}>
              <>
                <TextView
                  translate
                  title={'payment_result.code_orders'}
                  type={'text'}
                  placeholder={''}
                  value={screenState?.orderInfo?.code}
                />
                <TextView
                  translate
                  title={'payment_result.product_s_name'}
                  type={'text'}
                  placeholder={''}
                  value={screenState?.orderInfo?.ordersItem?.name}
                />
                {screenState?.orderInfo?.ordersItem?.prepayment &&
                  screenState?.headerSuccess ===
                    'application_list.remaining_payment_successful' && (
                    <TextView
                      translate
                      title={'payment_result.prepayment'}
                      placeholder={''}
                      value={`${formatNumber(
                        screenState?.orderInfo?.ordersItem?.prepayment
                      )} ${translate('common.currency')}`}
                    />
                  )}
                <TextView
                  translate
                  title={'payment_result.supplier'}
                  type={'text'}
                  placeholder={''}
                  value={screenState?.orderInfo?.partnerName}
                />
                <TextView
                  translate
                  title={'payment_result.value_payment'}
                  placeholder={''}
                  value={`${formatNumber(screenState?.depositMoney || '0')} ${translate(
                    'common.currency'
                  )}`}
                  bold
                />
                <TouchableOpacity onPress={onTransitDetail} style={styles.moreContainer}>
                  <AppText translate bold={true} style={styles.more}>
                    {'insurance_screen.show_detail'}
                  </AppText>
                  <ICNext color={CUSTOM_COLOR.PersianGreen} />
                </TouchableOpacity>
              </>
            </ExpandView>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            translate
            title={'common.back_to_main_screen'}
            style={styles.comparationButton}
            titleStyle={styles.whiteTitle}
            onPress={goToInsuranceProductList}
            disabledText={styles.disabledText}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
      </>
    );
  }, [
    screenState,
    header,
    navigation,
    onTransitDetail,
    goToInsuranceProductList,
    profile?.name,
    agencyInformation?.endTopener
  ]);

  return ResultView;
};

export default PaymentResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  flex: {
    flex: 1
  },
  header: {
    marginTop: SPACING.Medium * 2,
    marginBottom: SPACING.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center',
    marginBottom: scale(25)
  },
  expandView: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal
  },
  inputContainer: {
    // marginVertical: SPACING.Normal
  },
  footer: {
    padding: SPACING.Medium
  },
  moreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.Medium
  },
  more: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.PersianGreen,
    marginRight: SPACING.Normal
  },
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: scale(53, false),
    backgroundColor: BACKGROUND_COLOR.White
  },
  successText: {
    alignSelf: 'center',
    marginTop: SPACING.Medium,
    textAlign: 'center'
  },
  backToHome: {
    paddingHorizontal: SPACING.Medium
  }
});
