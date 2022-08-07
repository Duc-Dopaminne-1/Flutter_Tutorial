import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useRef, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {signUp} from '../../../api/authApi';
import {useGetUserStartupData} from '../../../api/masterData/useGetUserStartupData';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/appContext';
import {setAuthState} from '../../../appData/authState';
import * as userActions from '../../../appData/user/actions';
import {CONSTANTS} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {COLORS} from '../../../assets/theme/colors';
import {normal} from '../../../assets/theme/metric';
import AgreementComponent from '../../../components/AgreementComponent';
import BaseScreen from '../../../components/BaseScreen';
import CustomFooterButtons from '../../../components/Button/CustomFooterButtons';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import {PolicyModal} from '../../../components/Modal/PolicyModal';
import {SizeBox} from '../../../components/SizeBox';
import {useAgreePolicy} from '../../../hooks/useAgreePolicy';
import {parseUserData} from '../../../service/userData';
import {capitalize} from '../../../utils/StringUtils';
import {
  mappingAddressToPlace,
  mappingToAreas,
} from '../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import ScreenIds from '../../ScreenIds';
import {UserTraits} from '../../WithSegment';
import {AuthScreenStyles} from '../AuthComponents/AuthScreenContants';
import InputViewInfoAccount from '../AuthComponents/InputViewInfoAccount';
import {InputViewsProps} from '../AuthComponents/types';
import {SignUpContext} from '../AuthComponents/useSignup';

const InfoAccountScreen = ({navigation, route}) => {
  const {mobilePhone, otpKey, inviteCode: inviteCodeLink} = route?.params || {};
  const inputViewsProps = useContext(SignUpContext);
  const dispatch = useDispatch();
  const {identify} = useAnalytics();

  const {showAppSpinner, showErrorAlert, setIsLoggedIn} = useContext(AppContext);

  const agreePolicy = useAgreePolicy();

  const [username, setUsername] = useState('');
  const userInfo: {current: UserTraits} = useRef();

  const onError = error => {
    showAppSpinner(false);
    const {setErrors, validates} = inputViewsProps;
    switch (error.messageKey) {
      case Message.UC4_13_MUS_ERR_002:
        setErrors({
          step1: {
            ...validates.step1,
            email: error.message,
          },
        });
        break;
      case Message.REFERAL_USER_EXISTING:
        setErrors({
          step1: {
            ...validates.step1,
            inviteCode: error.message,
          },
        });
        break;
      default:
        break;
    }
    showErrorAlert(error.message);
  };

  const onSuccess = async data => {
    const {authState, user} = parseUserData(data);
    await dispatch(setAuthState(authState));
    dispatch(userActions.update({username, ...user}));

    identify(user.id, {
      ...userInfo.current,
      createdAt: new Date().toISOString(),
      optin_location: 'signup',
      signup_source: Platform.OS,
    });

    startGetUserData();
  };

  const {startApi} = useApiCall({onError, onSuccess});

  const onSuccessGetUserData = () => {
    showAppSpinner(false);
    setIsLoggedIn(true);
    inputViewsProps.resetState();
    navigation.navigate(ScreenIds.MainStack);
  };
  const {startGetUserData} = useGetUserStartupData({
    onSuccess: onSuccessGetUserData,
  });

  const onPressButtonNext = () => {
    if (inputViewsProps.validateStep1() || !agreePolicy.isAgree) {
      return;
    }
    showAppSpinner(true);
    const state = inputViewsProps.state;
    const permanentAddressString = JSON.stringify(mappingAddressToPlace(state.permanentAddress));
    setUsername(mobilePhone);

    const {name, middleLastName, password, email, dob, gender, inviteCode, campaignCode} = state;
    const dataStep1 = {
      firstName: name,
      lastName: middleLastName,
      phoneNumber: mobilePhone,
      password,
      email,
      dob,
      gender: capitalize(gender),
      referralCode: inviteCodeLink ?? inviteCode,
      campaignCode,
    };
    const {
      nationalIdType,
      nationalId,
      nationalIdIssueDate,
      nationalIdIssuePlace,
      isSameAddress,
      workingAreas,
      preferPropertyTypes,
      preferPropertyPriceFrom,
      preferPropertyPriceTo,
      contactAddress,
    } = state;

    const dataStep2 = {
      nationalIdType: capitalize(nationalIdType),
      nationalId: nationalId,
      nationalIdIssueDate: new Date(nationalIdIssueDate)?.getTime(),
      nationalIdIssuePlace: nationalIdIssuePlace,
      contactAddress: isSameAddress
        ? permanentAddressString
        : JSON.stringify(mappingAddressToPlace(contactAddress)),
      workingAreas: JSON.stringify(workingAreas.map(item => mappingToAreas(item))),
      permanentAddress: permanentAddressString,
      preferPropertyTypes: JSON.stringify(preferPropertyTypes),
      preferPropertyPriceFrom: preferPropertyPriceFrom * CONSTANTS.BILLION,
      preferPropertyPriceTo: preferPropertyPriceTo * CONSTANTS.BILLION,
    };
    const info = {
      propertyAllocates: true,
      agentGroupId: '2b885b7a-468d-11ec-8734-7fb87eb52811',
      ...dataStep1,
      ...dataStep2,
      isAgentLeader: false,
      otpKey: otpKey,
    };

    userInfo.current = {
      email: info.email,
      user_name: info.userName,
      first_name: info.firstName,
      last_name: info.lastName,
      phone_number: info.phoneNumber,
      referral_code: info.referralCode,
      campaign_code: info.campaignCode,
    };

    startApi(async () => {
      const signupResponse = await signUp(info);
      return signupResponse;
    });
  };

  const acceptPolicy = () => {
    agreePolicy.agreeAndCloseModal();
    inputViewsProps.changeAgree(true);
  };

  return (
    <>
      <BaseScreen
        title={translate('signup.titleAccount')}
        showHeaderShadow
        style={AuthScreenStyles.safeArea}
        testID={ScreenIds.InfoAccount}
        containerStyle={styles.container}>
        <InfoAccountContainer
          onPressButtonNext={onPressButtonNext}
          onPressCancel={inputViewsProps.onPressCancel}
          inputViewsProps={{...inputViewsProps, mobilePhone}}
          agreePolicy={agreePolicy}
        />
      </BaseScreen>
      <PolicyModal
        modalizeRef={agreePolicy.modalRef}
        title={translate('signup.policyTitle')}
        html={agreePolicy.html}
        onPress={acceptPolicy}
      />
    </>
  );
};

export type InfoAccountContainerProps = {
  inputViewsProps: InputViewsProps,
  canGoBack: any,
  onPressButtonNext: () => {},
  onPressCancel: () => {},
};

export const InfoAccountContainer = ({
  inputViewsProps,
  agreePolicy,
  onPressButtonNext,
  onPressCancel,
}: InfoAccountContainerProps) => {
  const isAgree = inputViewsProps?.state?.isAgree;
  const changeIsAgree = value => {
    inputViewsProps.changeAgree(value);
    agreePolicy.setAgree(value);
  };
  return (
    <>
      <KeyboardScrollView extraScrollHeight={50}>
        <View style={AuthScreenStyles.viewContainer}>
          <SizeBox height={SIZES.SEPARATOR_24} />
          <InputViewInfoAccount {...inputViewsProps} />
          <SizeBox height={SIZES.SEPARATOR_8} />
          <AgreementComponent
            isAgree={agreePolicy.isAgree}
            checkValue={changeIsAgree}
            textFirst={translate('signup.agreementFirst')}
            hyperlink={translate('signup.policyTitle')}
            onConfirm={agreePolicy.openModal}
          />
          <SizeBox height={SIZES.SEPARATOR_16} />
        </View>
      </KeyboardScrollView>
      <View style={styles.footer}>
        <CustomFooterButtons
          nextButtonTitle={translate('signup.button.apply')}
          cancelButtonTitle={translate('signup.button.cancel')}
          onPressNext={onPressButtonNext}
          onPressCancel={onPressCancel}
          nextButtonStyle={styles.btnNext(isAgree)}
          disabledNext={!isAgree}
        />
      </View>
    </>
  );
};

export default InfoAccountScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  footer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: normal,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_F0,
    height: 80,
  },
  btnNext: isAgree => ({
    opacity: isAgree ? 1 : 0.5,
  }),
});
