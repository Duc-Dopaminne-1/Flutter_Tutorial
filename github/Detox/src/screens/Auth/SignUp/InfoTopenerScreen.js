import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';

import {signUp} from '../../../api/authApi';
import {useGetUserStartupData} from '../../../api/masterData/useGetUserStartupData';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {setAuthState} from '../../../appData/authState';
import * as userActions from '../../../appData/user/actions';
import {CONSTANTS} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images/index';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';
import AgreementComponent from '../../../components/AgreementComponent';
import CustomFooterButtons from '../../../components/Button/CustomFooterButtons';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import {PolicyModal} from '../../../components/Modal/PolicyModal';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
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
import {AuthScreenConstants, AuthScreenStyles} from '../AuthComponents/AuthScreenContants';
import HeaderSignUp from '../AuthComponents/HeaderSignUp';
import InputViewInfoTopener from '../AuthComponents/InputViewInfoTopener';
import {InputViewsProps} from '../AuthComponents/types';
import {SignUpContext} from '../AuthComponents/useSignup';

const InfoTopenerScreen = ({navigation, route}) => {
  const {mobilePhone, otpKey, inviteCode: inviteCodeLink} = route?.params || {};
  const dispatch = useDispatch();
  const {identify} = useAnalytics();

  const {showAppSpinner, showErrorAlert, setIsLoggedIn} = useContext(AppContext);
  const inputViewsProps = useContext(SignUpContext);

  const agreePolicy = useAgreePolicy();

  useEffect(() => {
    agreePolicy.setAgree(inputViewsProps?.state?.isAgree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputViewsProps?.state?.isAgree]);

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
        navigation.goBack();
        break;
      case Message.REFERAL_USER_EXISTING:
        setErrors({
          step1: {
            ...validates.step1,
            inviteCode: error.message,
          },
        });
        navigation.goBack();
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

  const onPressButtonApply = () => {
    if (inputViewsProps?.validateStep2() || !agreePolicy.isAgree) {
      return;
    }
    showAppSpinner(true);
    const state = inputViewsProps.state;
    const permanentAddressString = JSON.stringify(mappingAddressToPlace(state.permanentAddress));
    setUsername(mobilePhone);

    const {name, middleLastName, password, email, dob, gender, inviteCode} = state;
    const dataStep1 = {
      firstName: name,
      lastName: middleLastName,
      phoneNumber: mobilePhone,
      password: password,
      email: email,
      dob: dob,
      gender: capitalize(gender),
      referralCode: inviteCodeLink ?? inviteCode,
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
    };

    startApi(async () => {
      const signupResponse = await signUp(info);
      return signupResponse;
    });
  };

  return (
    <>
      <InfoTopenerContainer
        onPressButtonNext={onPressButtonApply}
        onPressCancel={inputViewsProps.onPressCancel}
        agreePolicy={agreePolicy}
        inputViewsProps={inputViewsProps}
      />
      <PolicyModal
        modalizeRef={agreePolicy.modalRef}
        title={translate('signup.policyTitle')}
        html={agreePolicy.html}
        onPress={agreePolicy.agreeAndCloseModal}
      />
    </>
  );
};

export type InfoTopenerContainerProps = {
  inputViewsProps: InputViewsProps,
  canGoBack: any,
  agreePolicy: {isAgree: Boolean},
  onPressButtonNext: () => {},
  onPressCancel: () => {},
};

export const InfoTopenerContainer = ({
  inputViewsProps,
  agreePolicy = {isAgree: false},
  ...props
}: InfoTopenerContainerProps) => {
  return (
    <SafeAreaScreenContainer style={AuthScreenStyles.safeArea} testID={ScreenIds.Signup}>
      <HeaderSignUp
        canGoBack={props.canGoBack}
        title={translate('signup.titleTopener')}
        iconNameRight={IMAGES.IC_STEP_FINAL}
      />
      <KeyboardScrollView extraScrollHeight={50}>
        <View style={styles.wrapperHeader}>
          <AntDesign name="exclamationcircle" size={20} color={COLORS.BLUE_BASIC} />
          <Text style={styles.txtBanner}>{translate('signup.subTitleTopener')}</Text>
        </View>
        <View style={AuthScreenStyles.viewContainer}>
          <InputViewInfoTopener {...inputViewsProps} />
          <SizeBox height={20} />
          <AgreementComponent
            isAgree={agreePolicy.isAgree}
            checkValue={inputViewsProps.changeAgree}
            hyperlink={translate('signup.policyTitle')}
            onConfirm={agreePolicy.openModal}
          />
          <SizeBox height={25} />
        </View>
      </KeyboardScrollView>
      <View style={styles.footer}>
        <CustomFooterButtons
          nextButtonTitle={translate('signup.button.apply')}
          cancelButtonTitle={translate('signup.button.cancel')}
          onPressNext={props.onPressButtonNext}
          onPressCancel={props.onPressCancel}
          disabledNext={!agreePolicy.isAgree}
          nextButtonStyle={styles.btnNext(inputViewsProps?.state?.isAgree)}
        />
      </View>
    </SafeAreaScreenContainer>
  );
};

export default InfoTopenerScreen;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: COLORS.BACKGROUND,
    padding: normal,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_F0,
    height: 80,
  },
  wrapperHeader: {
    backgroundColor: COLORS.BLUE_90,
    paddingVertical: 10,
    paddingHorizontal: AuthScreenConstants.CONTAINER_PADDING_LEFT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBanner: {...FONTS.regular, marginLeft: 10, fontSize: 14, flex: 1},
  btnNext: isAgree => ({
    opacity: isAgree ? 1 : 0.5,
  }),
});
