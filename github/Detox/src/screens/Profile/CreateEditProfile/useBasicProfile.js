/* eslint-disable react-hooks/exhaustive-deps */
import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useSelector} from 'react-redux';

import {editMyAccount} from '../../../api/authApi';
import {
  useGetUserByIdLazyQuery,
  useSendLinkVerifyEmailMutation,
} from '../../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../../api/graphql/parseGraphqlError';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId} from '../../../appData/user/selectors';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {getImageBySizeFromServer, IMAGE_SIZES} from '../../../utils/ImageUtil';
import ValidateInput from '../../../utils/ValidateInput';
import {callAfterInteraction} from '../../commonHooks';
import {UserTraits} from '../../WithSegment';
import {getGenderKey} from './DropDownGender';

const INIT_VALUE = '';
const INIT_STATE = {
  firstName: INIT_VALUE,
  lastName: INIT_VALUE,
  userName: INIT_VALUE,
  phoneNumber: INIT_VALUE,
  email: INIT_VALUE,
  dob: INIT_VALUE,
  referralCode: INIT_VALUE,
  gender: INIT_VALUE,
  userId: INIT_VALUE,
  roleId: INIT_VALUE,
  profilePhoto: INIT_VALUE,
  avatar: INIT_VALUE,
};

const initialState = {
  originState: INIT_STATE,
  inputState: INIT_STATE,
  errors: {},
};

const BASIC_FIELD_VALIDATORS = {
  firstName: ValidateInput.checkName,
  phoneNumber: ValidateInput.checkMobilePhone,
  email: ValidateInput.checkEmail,
  dob: ValidateInput.checkBirthday,
};

const mapFieldState = result => {
  if (!result) {
    return {};
  }
  return {
    firstName: result.firstName,
    lastName: result.lastName,
    userName: result.userName,
    phoneNumber: result.phoneNumber,
    email: result.email,
    referralCode: result.referralCode,
    emailConfirmed: result.emailConfirmed,
    isVerifyProfilePhoto: result.isVerifyProfilePhoto,
    dob: result.dob?.toDateTime ?? null,
    gender: result.gender,
    userId: result.userId,
    roleId: result.roleId,
    profilePhoto: result.profilePhoto,
    avatar: getImageBySizeFromServer(result.profilePhotos, IMAGE_SIZES.LARGE),
  };
};

const isEditedState = state => {
  if (!state) {
    return false;
  }

  //compare value of originState and inputState
  const {originState, inputState} = state;
  const keys = Object.keys(inputState);
  for (let index = 0; index < keys.length; index++) {
    const fieldName = keys[index];
    if (inputState?.[fieldName] !== originState?.[fieldName]) {
      return true;
    }
  }

  return false;
};

const validateFields = (stateToValidate, validators) => {
  //check input values
  if (!stateToValidate || !validators) {
    return null; //no error
  }

  let errors = {};
  let hasError = false;

  for (const key in stateToValidate) {
    if (stateToValidate.hasOwnProperty(key)) {
      const value = stateToValidate[key];
      const validator = validators[key];
      const error = validator ? validator(value) : null;
      if (error) {
        hasError = true;
        errors = {...errors, [key]: error};
      }
    }
  }

  if (!hasError) {
    return null; //no error
  }

  return errors;
};

const validateBasicFields = stateToValidate => {
  return validateFields(stateToValidate, BASIC_FIELD_VALIDATORS);
};

const BasicProfileContext = createContext(initialState);

const BasicProfileProvider = ({children, route}) => {
  const userId = useSelector(getUserId);
  const {identify} = useAnalytics();
  const [state, setState] = useState(initialState);
  const [loadingUpdate, setLoadingUpdate] = useState();
  const [isEditRefCode, setIsEditRefCode] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isUpdateProfile, setIsUpdateProfile] = useState(true);
  const {originState, inputState} = state;

  const setOriginFieldState = fieldItem => {
    setState({...state, originState: {...originState, ...fieldItem}});
  };
  const setInputFieldState = fieldItem => {
    setState({...state, inputState: {...inputState, ...fieldItem}});
  };

  const {showAppSpinner, showAppModal, showErrorAlert, showMessageAlert} = useContext(AppContext);
  const [getUser, {loading: loadingQuery, error: errorQuery, data: dataQuery}] =
    useGetUserByIdLazyQuery({...FETCH_POLICY.NETWORK_ONLY});

  const checkIsEditRefCode = () => {
    setIsEditRefCode(false);
  };

  const {startApi: updateUser} = useApiCall({
    onError: error => {
      setLoadingUpdate(false);
      showErrorAlert(error.message);
    },
    onSuccess: () => {
      setLoadingUpdate(false);
      const title = translate(STRINGS.SUCCESS);
      const message = translate(STRINGS.SUCCESS_UPDATE);
      const identifyProps: UserTraits = {
        email: inputState.email,
        updated_at: new Date().toISOString(),
        gender: inputState.gender,
        signup_source: Platform.OS,
        optin_location: 'update_profile',
        firstName: inputState.firstName,
        lastName: inputState.lastName,
        user_name: inputState.userName,
        birthday: new Date(inputState.dob).toISOString(),
        phone_number: inputState.phoneNumber,
        referral_code: inputState.referralCode,
      };

      showAppModal({isVisible: true, title, message});
      if (inputState.referralCode && inputState.referralCode.length > 0) {
        checkIsEditRefCode();
      }

      identify(userId, identifyProps);

      getUser({variables: {userId}});
    },
  });

  const onSuccessSendLinkVerifyEmail = () => {
    showMessageAlert(translate(STRINGS.SUCCESS), translate('SUCCESS_VERIFY_EMAIL'));
  };

  const onErrorSendLinkVerifyEmail = error => {
    if (error.errorMessageCode === 'THE_EMAIL_WAS_ALREADY_CONFIRMED') {
      getUser({variables: {userId}});
    }
    showErrorAlert(error.message);
  };

  const {startApi: sendLinkVerifyEmail} = useGraphqlApiLazy({
    showSpinner: true,
    graphqlApiLazy: useSendLinkVerifyEmailMutation,
    dataField: 'sendLinkVerifyEmail',
    onSuccess: onSuccessSendLinkVerifyEmail,
    onError: onErrorSendLinkVerifyEmail,
  });

  useEffect(() => {
    showAppSpinner(loadingUpdate);
    if (errorQuery) {
      callAfterInteraction(() => {
        const errorMessage = parseGraphqlError(errorQuery);
        showErrorAlert(errorMessage);
      });
    }
  }, [loadingQuery, errorQuery, loadingUpdate]);

  const onHandleWithUniversalLink = result => {
    if (!isEmpty(route?.params?.inviteCode) && isEmpty(result.referralCode)) {
      const newResult = {...result};
      newResult.referralCode = route?.params?.inviteCode;
      return newResult;
    }
    return result;
  };

  const updateUserInfo = () => {
    // validate input fields
    const errors = validateBasicFields(inputState);
    //errors => update state to display errors and do nothing
    if (errors) {
      setState({...state, errors});
      return;
    }

    //no error => update User basic info
    setLoadingUpdate(true);
    updateUser(async () => {
      const {gender} = inputState;
      const genderKey = getGenderKey(gender);
      const response = await editMyAccount({...inputState, gender: genderKey});
      return response;
    });
  };

  useEffect(() => {
    const result = dataQuery?.userById?.userDto;
    if (result) {
      const newResult = onHandleWithUniversalLink(result);
      const resultFields = mapFieldState(newResult);
      setState({originState: {...resultFields}, inputState: {...resultFields}});
      setIsEditRefCode(isEmpty(newResult?.referralCode));
    }
  }, [dataQuery]);

  useEffect(() => {
    const result = dataQuery?.userById?.userDto;
    const checkInputState = inputState.phoneNumber.length > 0;
    if (checkInputState && isUpdateProfile && !isEmpty(route?.params?.inviteCode)) {
      if (isEmpty(result.referralCode)) {
        updateUserInfo();
      } else if (!isEmpty(result.referralCode)) {
        const title = translate(STRINGS.DEFAULT_MODAL_TITLE);
        const message = translate(STRINGS.ERROR_UPDATE_INVITE_CODE);
        showAppModal({isVisible: true, title, message});
      }
      setIsUpdateProfile(false);
    }
  }, [inputState]);

  useEffect(() => {
    const errors = validateBasicFields(inputState);
    if (!isFirstLoad) {
      //errors => update state to display errors and do nothing
      if (errors) {
        setState({...state, errors});
      } else {
        setState({...state, errors: {}});
      }
    }
    setIsFirstLoad(false);
  }, [inputState]);

  const verifyEmail = tokenCaptcha => {
    sendLinkVerifyEmail({variables: {input: {tokenCaptcha}}});
  };

  return (
    <BasicProfileContext.Provider
      value={{
        state,
        setState,
        setOriginFieldState,
        setInputFieldState,
        verifyEmail,
        getUser,
        updateUserInfo,
        isEditedState,
        isEditRefCode,
      }}>
      {children}
    </BasicProfileContext.Provider>
  );
};

export {BasicProfileContext, BasicProfileProvider, isEditedState};
