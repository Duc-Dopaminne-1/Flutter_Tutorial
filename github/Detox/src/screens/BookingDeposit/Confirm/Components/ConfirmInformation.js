import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

import {
  useGetBuyerInfoByCurrentUserForTransactionLazyQuery,
  useGetPolicyByPostIdForTransactionLazyQuery,
  useGetUserDetailLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../../appData/appContext/useAppContext';
import {getUserId, isAgent} from '../../../../appData/user/selectors';
import {FETCH_POLICY} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import AgreementComponent from '../../../../components/AgreementComponent';
import CustomButton from '../../../../components/Button/CustomButton';
import KeyboardScrollView from '../../../../components/KeyboardScrollView';
import {useAgreePolicy} from '../../../../hooks/useAgreePolicy';
import {useMount} from '../../../commonHooks';
import ScreenIds from '../../../ScreenIds';
import {Price} from '../../ConfirmProperty/ConfirmPropertyComponents';
import SaleInfo from './SaleInfo';
import {useSaleInfo} from './useSaleInfo';

const styles = StyleSheet.create({
  bottom: {
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  buttonCancel: {
    marginTop: small,
    flex: 1,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    marginBottom: normal,
  },
  buttonConfirm: {marginTop: small, flex: 2, marginLeft: 12, marginBottom: normal},
});

const BottomView = ({isUpdateInfo, price, state, isAgree, onConfirm, onCancel}) => {
  if (isUpdateInfo) {
    return (
      <View style={[styles.bottom, METRICS.horizontalPadding, HELPERS.row]}>
        <CustomButton
          style={[commonStyles.buttonNext, styles.buttonCancel]}
          title={translate(STRINGS.CANCEL)}
          onPress={onCancel}
          titleStyle={{color: COLORS.PRIMARY_A100, ...FONTS.bold}}
        />
        <CustomButton
          style={[
            styles.buttonConfirm,
            isAgree ? commonStyles.buttonNext : commonStyles.disabledButtonNext,
          ]}
          disabled={!isAgree}
          title={translate(STRINGS.SAVE)}
          titleStyle={FONTS.bold}
          onPress={onConfirm}
        />
      </View>
    );
  }
  return (
    <View style={[styles.bottom, METRICS.horizontalPadding]}>
      <Price type={state?.propertyPost?.contextType} price={price} />
      <CustomButton
        style={[commonStyles.buttonNext, {marginTop: small, marginBottom: normal}]}
        title={translate(STRINGS.PAY)}
        onPress={onConfirm}
      />
    </View>
  );
};

export const ConfirmInformationContainer = ({
  state,
  errors,
  dispatch,
  saleAgentInfo,
  policies,
  isUpdateInfo = false,
  onConfirm,
  updateField,
  onCheckIsBuyer,
  checkedBuyer,
  masterData,
  onCancel,
  onCheckAgreement,
  isAgree,
  setIsAgree,
}) => (
  <View style={[HELPERS.fill, {backgroundColor: COLORS.BACKGROUND}]}>
    <KeyboardScrollView contentStyle={METRICS.horizontalPadding}>
      <SaleInfo
        masterData={masterData}
        state={state}
        errors={errors}
        policies={policies}
        dispatch={dispatch}
        consultantInfo={state?.consultantInfo}
        saleAgentInfo={saleAgentInfo}
        updateField={updateField}
        onCheckIsBuyer={onCheckIsBuyer}
        checkedBuyer={checkedBuyer}
      />
      {isUpdateInfo && (
        <AgreementComponent
          isAgree={isAgree}
          checkValue={setIsAgree}
          onConfirm={onCheckAgreement}
          suffix={translate('project.confirmTransaction.agreeChangeInfoCustomer')}
          hyperlink={`${translate('common.termAndCondition')} `}
        />
      )}
    </KeyboardScrollView>
    <BottomView
      price={state?.propertyPost?.bookingFee}
      isUpdateInfo={isUpdateInfo}
      state={state}
      isAgree={isAgree}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  </View>
);

const ConfirmInformation = ({
  state,
  dispatch,
  errors,
  onConfirm,
  customerInfo,
  isBooking = true,
  isUpdateInfo = false,
  setAgent,
}) => {
  const isLoggedInUserSaleAgent = state.isLoggedInUserSaleAgent;
  const [isAgree, setIsAgree] = useState(false);
  const {saleAgentInfo, propertyPost} = state;
  const [customerDetail, setCustomerDetail] = React.useState({});
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const [policies, setPolicies] = React.useState([]);
  const {propertyPostId} = propertyPost;
  const navigation = useNavigation();
  const userId = useSelector(getUserId);
  const isAgentUser = useSelector(isAgent);
  const agreePolicy = useAgreePolicy('UpdateCustomerPolicy');
  const {updateField, onCheckIsBuyer, checkedBuyer} = useSaleInfo({
    state: state,
    dispatch: dispatch,
    customerDetail: customerDetail,
    isUpdateInfo,
    customerInfo,
  });

  const onCheckAgreement = () => {
    navigation.navigate(ScreenIds.PageDetail, {
      title: translate('common.termAndCondition'),
      isShowDate: false,
      pageDetail: {body: agreePolicy.html},
    });
  };

  const onSuccessGetMemberDetail = detail => {
    setCustomerDetail(detail?.userDto);
  };
  const onSuccessGetAgentDetail = response => {
    const detail = response.buyerInfoDto;
    if (isLoggedInUserSaleAgent === true) {
      setAgent(detail);
    }
    setCustomerDetail(detail);
  };

  const {startApi: getMemberDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserDetailLazyQuery,
    queryOptions: {notifyOnNetworkStatusChange: true, ...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    showSpinner: true,
    onSuccess: onSuccessGetMemberDetail,
  });
  const {startApi: getAgentDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetBuyerInfoByCurrentUserForTransactionLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getBuyerInfoByCurrentUserForTransaction',
    showSpinner: true,
    onSuccess: onSuccessGetAgentDetail,
  });

  const onSuccessGetPolicies = responsePolicies => {
    setPolicies(responsePolicies?.edges);
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const {startApi: getPolicies} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPolicyByPostIdForTransactionLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'policyByPropertyPostIdForTransaction',
    onSuccess: onSuccessGetPolicies,
  });

  useMount(() => {
    propertyPostId &&
      getPolicies({variables: {propertyPostId: propertyPostId, isBooking: isBooking}});
    isAgentUser ? getAgentDetail() : getMemberDetail({variables: {userId}});
  });

  return (
    <ConfirmInformationContainer
      isBooking={isBooking}
      propertyPost={propertyPost}
      state={state}
      dispatch={dispatch}
      errors={errors}
      saleAgentInfo={saleAgentInfo}
      customerDetail={customerDetail}
      policies={policies}
      onCancel={onCancel}
      isUpdateInfo={isUpdateInfo}
      masterData={masterData}
      isAgree={isAgree}
      setIsAgree={setIsAgree}
      onCheckAgreement={onCheckAgreement}
      onConfirm={onConfirm}
      updateField={updateField}
      onCheckIsBuyer={onCheckIsBuyer}
      checkedBuyer={checkedBuyer}
    />
  );
};

export default ConfirmInformation;
