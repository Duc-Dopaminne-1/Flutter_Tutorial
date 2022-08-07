import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { add, interpolate } from 'react-native-reanimated';
import { BackHeader } from '../components';
import SCREENS_NAME from '../constants/screens';
import {
  default as LoanComparison,
  default as LoanComparisonScreen
} from '../screens/credit/comparison';
import ConfirmCreditOrderScreen from '../screens/credit/create_or_edit/confirm_order';
import CreateCreditStep1Screen from '../screens/credit/create_or_edit/input_step1';
import CreateCreditStep2Screen from '../screens/credit/create_or_edit/input_step2';
import CreateCreditStep3Screen from '../screens/credit/create_or_edit/input_step3';
import ScanInfoCreditScreen from '../screens/credit/create_or_edit/scan_info';
import CreditProductDetailScreen from '../screens/credit/detail';
import CreditFilterScreen from '../screens/credit/filter';
import CreditSuggestedScreen from '../screens/credit/list';
import ExtraServiceListScreen from '../screens/extra_service/list';
import InsuranceListScreen from '../screens/insurance/insurance_list';
import MiddleWare from '../screens/middleware';
import CameraCreateQuestionScreen from '../screens/support/camera_create_question';
import CreateSupportScreen from '../screens/support/create_support';
import PhotosCollectionScreen from '../screens/support/photos_collection';
import PreviewCreateQuestionScreen from '../screens/support/preview_create_question';
import InsuranceDetailScreen from '../screens/insurance/insurance_detail';
import ExtraServiceDetailScreen from '../screens/extra_service/detail';
import CreateExtraServiceOrderScreen from '../screens/extra_service/create_order';
import ApplicationListScreen from '../screens/application/list';
import TransactionHistoryScreen from '../screens/payment/transaction_history/list';
import CreditOrderDetailScreen from '../screens/application/credit/credit_order_detail';
import CreateScheduleScreen from '../screens/schedule/create_schedule';
import SelectProductTypeScreen from '../screens/product/select_product_type_new';
import PolicyCreditOrderScreen from '../screens/credit/credit_policy';
import ConfirmCreditOrderTopenerScreen from '../screens/credit/create_or_edit/confirm_order_topener';
import TermAndConditionScreen from '../screens/account/term_and_condition';
import InsurancePurchaseScreen from '../screens/insurance/create_or_edit/input_step_1';
import InsuranceConfirmInfoScreen from '../screens/insurance/create_or_edit/input_step_2/index';
import InsuranceOrderInfoPurchaseScreen from '../screens/insurance/create_or_edit/input_step_3';
import InsurancePolicyOrderScreen from '../screens/insurance/insurance_policy';
import InsuranceOrderDetailScreen from '../screens/application/insurance/insurance_order_detail';
import VNPayScreen from '../screens/payment/vnpay_sdk';
import PaymentResultScreen from '../screens/payment/payment_result';
import ExtraServicePolicyOrderScreen from '../screens/extra_service/extra_service_policy';
import CreateOrderSuccessScreen from '../screens/extra_service/create_order_success';
import ExtraServiceOrderDetailScreen from '../screens/application/extra_service/extra_service_order_detail';
import PolicyApplicationExtraServiceScreen from '../screens/application/extra_service/policy';
import AllInsuranceListScreen from '../screens/insurance/insurance_list_all';
import CreateRequestScreen from '../screens/lead/create_request';
import LeadListScreen from '../screens/lead/list';
import CreateOrEditLeadScreen from '../screens/lead/create_or_edit';
import LeadDetailScreen from '../screens/lead/detail';
import SupportScreen from '../screens/support/support_list';
import SupportDetailScreen from '../screens/support/support_detail';
import AccountBalanceScreen from '../screens/account/balance/account_balance';
import RefundRequestSuccessScreen from '../screens/application/refund_request_success';
import RefundRequestList from '../screens/account/refund/refund_request_list';
import DepositLoanScreen from '../screens/depositLoan';
import CreateRequestSuccessScreen from '../screens/lead/create_request_success';
import PolicyApplicationInsurance from '../screens/application/insurance/policy';
import PolicyCreditDepositOrderScreen from '../screens/credit/credit_deposit_policy';
import ReturnPolicyApplicationInsuranceScreen from '../screens/application/insurance/retun_policy';
import RefundRequest from '../screens/account/refund/refund_request';
import SuggestProductListScreen from '../screens/product/suggest_product_list';
import TriggerFlowScreen from '../screens/trigger';
import TriggerProductListScreen from '../screens/credit/triggers/list';
import LegalScreen from '../screens/middleware/legal';
import WithdrawalRequestDetail from '../screens/account/balance/withdrawal_request_detail';
import PolicyScreen from '../screens/auth/policy';
import InfoAccountDepositScreen from '../screens/application/info_account_deposit';
import ConfirmRefundRequestScreen from '../screens/application/cofirm_refund_request';
import ScheduleDetail from '../screens/schedule/schedule_detail';
import UpdateSchedule from '../screens/schedule/update_schedule';
import ReviewSchedule from '../screens/schedule/review_schedule';

const Stack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 2000,
    mass: 1,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01
  }
};
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0.2, 0.7, 1]
    })
  }
});

const forHeaderFade = ({ current, next }) => {
  const opacity = interpolate(add(current.progress, next ? next.progress : 0), {
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0]
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity }
  };
};

const AppNavigator = ({ onLoaded }, ref) => {
  useEffect(() => {
    onLoaded?.();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={SCREENS_NAME.MIDDLEWARE}
      screenOptions={{
        presentation: 'modal',
        header: headerProps => <BackHeader {...headerProps} />,
        cardOverlayEnabled: true,
        transitionSpec: {
          open: config,
          close: config
        },
        gestureEnabled: false,
        cardStyleInterpolator: forFade,
        headerStyleInterpolator: forHeaderFade
      }}>
      <Stack.Screen
        name={SCREENS_NAME.MIDDLEWARE}
        component={MiddleWare}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREDIT_FILTER_SCREEN}
        component={CreditFilterScreen}
        options={{ title: 'screen_name.loan' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_SUPPORT_SCREEN}
        component={CreateSupportScreen}
        options={{ title: 'create_support.title_screen' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREDIT_SUGGESTED_SCREEN}
        component={CreditSuggestedScreen}
        options={{ title: 'loan_package.suggested_product' }}
      />

      <Stack.Screen
        name={SCREENS_NAME.CREDIT_TRIGGER_FLOW_SCREEN}
        component={TriggerProductListScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.LOAN_COMPARISON}
        component={LoanComparison}
        options={{ title: 'loan_package.compare_product' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.LOAN_COMPARISON_SCREEN}
        component={LoanComparisonScreen}
        options={{ title: 'screen_name.loan_comparison' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREDIT_PRODUCT_DETAIL_SCREEN}
        component={CreditProductDetailScreen}
        options={{ title: 'product_detail_form.loan_detail_title' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.SCAN_INFO_CREDIT_SCREEN}
        component={ScanInfoCreditScreen}
        options={{ title: 'screen_name.create_credit_application' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_CREDIT_STEP_1_SCREEN}
        component={CreateCreditStep1Screen}
        options={{ title: 'screen_name.create_credit_application' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_CREDIT_STEP_2_SCREEN}
        component={CreateCreditStep2Screen}
        options={{ title: 'screen_name.create_credit_application' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_CREDIT_STEP_3_SCREEN}
        component={CreateCreditStep3Screen}
        options={{ title: 'screen_name.create_credit_application' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CAMERA_CREATE_QUESTION}
        component={CameraCreateQuestionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREENS_NAME.PHOTOS_COLLECTION}
        component={PhotosCollectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREENS_NAME.PREVIEW_CREATE_QUESTION}
        component={PreviewCreateQuestionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREENS_NAME.POLICY_CREDIT_ORDER_SCREEN}
        component={PolicyCreditOrderScreen}
        options={{ title: 'common.policy' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.POLICY_CREDIT_DEPOSIT_ORDER_SCREEN}
        component={PolicyCreditDepositOrderScreen}
        options={{ title: 'common.policy' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CONFIRM_CREDIT_ORDER_SCREEN}
        component={ConfirmCreditOrderScreen}
        options={{ title: 'screen_name.deposit_loan_application' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CONFIRM_CREDIT_ORDER_TOPENER_SCREEN}
        component={ConfirmCreditOrderTopenerScreen}
        options={{ title: 'screen_name.create_credit_application' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.TERM_AND_CONDITION_SCREEN}
        component={TermAndConditionScreen}
        options={{ title: 'screen_name.term_and_condition' }}
      />

      <Stack.Screen
        name={SCREENS_NAME.INSURANCE_LIST_SCREEN}
        component={InsuranceListScreen}
        options={{
          title: 'product_screen.insurrance'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.INSURANCE_DETAIL_SCREEN}
        component={InsuranceDetailScreen}
        options={{
          title: 'product_screen.insurrance_detail'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.INSURANCE_PURCHASE_SCREEN}
        component={InsurancePurchaseScreen}
        options={{
          title: 'product_screen.buy_insurance'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.INSURANCE_CONFIRM_INFO_SCREEN}
        component={InsuranceConfirmInfoScreen}
        options={{
          title: 'product_screen.buy_insurance'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN}
        component={InsuranceOrderInfoPurchaseScreen}
        options={{
          title: 'product_screen.buy_insurance'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.INSURANCE_POLICY_ORDER_SCREEN}
        component={InsurancePolicyOrderScreen}
        options={{
          title: 'common.policy'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.INSURANCE_ORDER_DETAIL_SCREEN}
        component={InsuranceOrderDetailScreen}
        options={{
          title: 'screen_name.application_info'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.VN_PAY_SCREEN}
        component={VNPayScreen}
        options={{
          title: 'product_screen.vnpay_screen',
          headerShown: false
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.PAYMENT_RESULT_SCREEN}
        component={PaymentResultScreen}
        options={{
          title: 'product_screen.payment',
          hideLeftHeader: true
        }}
      />

      <Stack.Screen
        name={SCREENS_NAME.EXTRA_SERVICE_LIST_SCREEN}
        component={ExtraServiceListScreen}
        options={{
          title: 'product_screen.added_service'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.EXTRA_SERVICE_DETAIL_SCREEN}
        component={ExtraServiceDetailScreen}
        options={{
          title: 'product_screen.added_service_detail'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_EXTRA_SERVICE_ORDER_SCREEN}
        component={CreateExtraServiceOrderScreen}
        options={{ title: 'product_screen.sign_up_for_additional_services' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.EXTRA_SERVICE_POLICY_ORDER_SCREEN}
        component={ExtraServicePolicyOrderScreen}
        options={{
          title: 'common.policy'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_ORDER_SUCCESS}
        component={CreateOrderSuccessScreen}
        options={{ title: 'product_screen.sign_up_for_additional_services' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.EXTRA_SERVICE_ORDER_DETAIL_SCREEN}
        component={ExtraServiceOrderDetailScreen}
        options={{ title: 'screen_name.application_info' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.POLICY_APPLICATION_EXTRA_SERVICE_SCREEN}
        component={PolicyApplicationExtraServiceScreen}
        options={{ title: 'common.policy' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.APPLICATION_LIST_SCREEN}
        component={ApplicationListScreen}
        options={{
          title: 'screen_name.application'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.ALL_INSURANCE_LIST_SCREEN}
        component={AllInsuranceListScreen}
        options={{
          title: 'insurance_screen.home_insurance'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.REFUND_REQUEST_SUCCESS}
        component={RefundRequestSuccessScreen}
        options={{ title: 'screen_name.confirm_refund_request_success' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.REFUND_REQUEST_LIST_SCREEN}
        component={RefundRequestList}
        options={{
          title: 'screen_name.refund_request_list',
          disableShadow: true
        }}
      />

      <Stack.Screen
        name={SCREENS_NAME.TRANSACTION_HISTORY}
        component={TransactionHistoryScreen}
        options={{ title: 'screen_name.transaction_history' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN}
        component={CreditOrderDetailScreen}
        options={{ title: 'screen_name.application_info' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_SCHEDULE_SCREEN}
        component={CreateScheduleScreen}
        options={{ title: 'create_schedule.title_screen' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.SELECT_PRODUCT_TYPE_SCREEN}
        component={SelectProductTypeScreen}
        options={{ title: 'screen_name.select_product_type' }}
      />

      <Stack.Screen
        name={SCREENS_NAME.LEAD_LIST_SCREEN}
        component={LeadListScreen}
        options={{ title: 'loan_health_insurance.title_screen' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.LEAD_DETAIL_SCREEN}
        component={LeadDetailScreen}
        options={{ title: 'loan_health_insurance.title_screen' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.POLICY_APPLICATION_INSURANCE_SCREEN}
        component={PolicyApplicationInsurance}
        options={{ title: 'screen_name.return_policy' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.RETURN_POLICY_APPLICATION_INSURANCE_SCREEN}
        component={ReturnPolicyApplicationInsuranceScreen}
        options={{ title: 'screen_name.return_policy' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_OR_EDIT_LEAD_SCREEN}
        component={CreateOrEditLeadScreen}
        options={{ title: 'screen_name.create_lead' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.SUPPORT_SCREEN}
        component={SupportScreen}
        options={{
          title: 'screen_name.support'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.SUPPORT_DETAIL_SCREEN}
        component={SupportDetailScreen}
        options={{
          title: 'screen_name.support_detail',
          headerShown: true
        }}
      />

      <Stack.Screen
        name={SCREENS_NAME.ACCOUNT_BALANCE_SCREEN}
        component={AccountBalanceScreen}
        options={{ title: 'screen_name.account_balance' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_REQUEST_SCREEN}
        component={CreateRequestScreen}
        options={{ title: 'screen_name.create_request' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CREATE_REQUEST_SCREEN_SUCCESS}
        component={CreateRequestSuccessScreen}
        options={{ title: 'screen_name.create_request' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.DEPOSIT_LOAN}
        component={DepositLoanScreen}
        options={{ title: 'screen_name.deposit_loan_application' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.SUGGEST_PRODUCT_LIST_SCREEN}
        component={SuggestProductListScreen}
        options={{ title: 'loan_package.suggested_product' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.REFUND_REQUEST_SCREEN}
        component={RefundRequest}
        options={{ title: 'screen_name.refund_request_list2' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.TRIGGER_FLOW_SCREEN}
        component={TriggerFlowScreen}
        options={{ title: 'screen_name.trigger_flow' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.LEGAL_SCREEN}
        component={LegalScreen}
        options={{ title: 'screen_name.term_condition' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.WITHDRAWAL_REQUEST_DETAIL}
        component={WithdrawalRequestDetail}
        options={{ title: 'screen_name.withdrawal_request_detail' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.POLICY_SCREEN}
        component={PolicyScreen}
        options={{
          title: 'screen_name.term_and_condition'
        }}
      />
      <Stack.Screen
        name={SCREENS_NAME.INFO_ACCOUNT_DEPOSIT}
        component={InfoAccountDepositScreen}
        options={{ title: 'screen_name.info_account_deposit' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.CONFIRM_REFUND_REQUEST}
        component={ConfirmRefundRequestScreen}
        options={{ title: 'screen_name.confirm_refund_request' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.SCHEDULE_DETAIL}
        component={ScheduleDetail}
        options={{ title: 'screen_name.schedule_detail' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.UPDATE_SCHEDULE}
        component={UpdateSchedule}
        options={{ title: 'screen_name.update_schedule' }}
      />
      <Stack.Screen
        name={SCREENS_NAME.REVIEW_SCHEDULE}
        component={ReviewSchedule}
        options={{ title: 'screen_name.review_schedule' }}
      />

      {/* <Stack.Screen
        name={SCREENS_NAME.EVENT_DETAIL_SCREEN}
        component={EventDetailScreen}
        options={{ title: 'screen_name.event_detail' }}
      />

      <Stack.Screen
        name={SCREENS_NAME.NEWS_DETAIL_SCREEN}
        component={NewsDetailScreen}
        options={{ title: 'screen_name.news_detail' }}
      /> */}
    </Stack.Navigator>
  );
};

export default React.forwardRef(AppNavigator);
