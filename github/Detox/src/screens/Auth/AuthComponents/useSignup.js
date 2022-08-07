import {useNavigation} from '@react-navigation/native';
import React, {createContext, useContext, useReducer, useState} from 'react';
import {StyleSheet} from 'react-native';

import {AppContext} from '../../../appData/appContext/appContext';
import {GLOBAL_ACTIONS} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {getCities, getPreferPropertyTypes} from '../../../components/AgentInfoContainer';
import useMergeState from '../../../hooks/useMergeState';
import {deepFindValue} from '../../../utils/ObjectUtils';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';
import {
  checkValidAddress,
  checkValidContactAddress,
} from '../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import ScreenIds from '../../ScreenIds';
import {initialState, InputViewsError, InputViewsProps, State} from './types';

export const useSignup = () => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useMergeState();
  const {getMasterData, showAppModal} = useContext(AppContext);

  const [areaCities, setAreaCities] = useState([]);
  const [addressCities, setAddressCities] = useState([]);
  const [contactCities, setContactCities] = useState([]);

  useMount(() => {
    loadCitiesDistricts();
  });

  function loadCitiesDistricts() {
    const masterData = getMasterData();
    const {permanentAddress, contactAddress, preferPropertyTypes} = state;
    if (masterData) {
      setAreaCities(getCities(masterData, {}));
      setAddressCities(getCities(masterData, permanentAddress?.city));
      setContactCities(getCities(masterData, contactAddress?.city));
      dispatch({
        type: GLOBAL_ACTIONS.SET_PREFER_PROPERTY_TYPES,
        payload: getPreferPropertyTypes(masterData, preferPropertyTypes),
      });
    }
  }

  const validateStep1 = () => {
    const {name, email, password, confirmPassword, dob} = state;
    const e: InputViewsError = {
      name: ValidateInput.checkName(name),
      email: ValidateInput.checkEmail(email),
      password: ValidateInput.checkPassword(password),
      confirmPassword: ValidateInput.checkConfirmPassword(password, confirmPassword),
      dob: ValidateInput.checkBirthday(dob),
    };
    setErrors({step1: e});
    return isError(e);
  };
  const validateStep2 = () => {
    const {
      nationalId,
      nationalIdIssueDate,
      nationalIdIssuePlace,
      permanentAddress,
      contactAddress,
      workingAreas,
      preferPropertyTypes,
      isSameAddress,
    } = state;
    const e: InputViewsError = {
      errNationId: ValidateInput.checkRequiredField(nationalId),
      errNationalIdIssueDate: ValidateInput.checkRequiredField(nationalIdIssueDate),
      errNationalIdIssuePlace: ValidateInput.checkRequiredField(nationalIdIssuePlace),
      ...checkValidAddress(permanentAddress),
      ...(isSameAddress ? {} : checkValidContactAddress(contactAddress)),
      errArea: workingAreas.length === 0 ? translate(STRINGS.ERR_AT_LEAST_ONE_AREA) : '',
      errProperty:
        preferPropertyTypes.filter(item => item.checked).length === 0
          ? translate(STRINGS.ERR_AT_LEAST_ONE_PROPERTY)
          : '',
    };
    setErrors({step2: e});
    return isError(e);
  };

  const isError = e => {
    for (const [, value] of Object.entries(e)) {
      if (value) {
        return true;
      }
    }
    return false;
  };

  const onPressCancel = () => {
    showAppModal({
      isVisible: true,
      message: translate('signup.cancelMessage'),
      cancelText: translate(STRINGS.CANCEL),
      okText: translate(STRINGS.CONFIRM),
      cancelButtonStyle: styles.btnCancelPopup,
      cancelTextStyle: styles.txtCancelPopup,
      onOkHandler: () => {
        navigation.navigate(ScreenIds.MainStack);
      },
    });
  };

  const props: InputViewsProps = {
    state,
    validates: errors,
    validateStep1,
    validateStep2,
    loadCitiesDistricts,
    setErrors,
    dispatch,
    onPressCancel,
    setName: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'name', payload: text});
    },
    setMiddleLastName: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'middleLastName', payload: text});
    },
    setEmail: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'email', payload: text});
    },
    setPassword: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'password', payload: text});
    },
    setConfirmPassword: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'confirmPassword', payload: text});
    },
    setDob: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'dob', payload: text});
    },
    onChangeGender: item => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'gender', payload: item.value});
    },
    setInviteCode: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'inviteCode', payload: text});
    },
    setCampaignCode: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'campaignCode', payload: text});
    },

    onChangeIdentificationType: type => {
      dispatch({type: GLOBAL_ACTIONS.SET_IDENTIFYCATION_TYPE, payload: type.value});
    },
    onIdTextChanged: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'nationalId', payload: text});
    },
    onChangeIdentifyDate: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'nationalIdIssueDate', payload: text});
    },
    onChangeIdentifyPlace: text => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'nationalIdIssuePlace', payload: text});
    },
    areaCities,
    addressCities,
    contactCities,
    onAddressTextChanged: text => {
      dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_STREET, payload: text});
    },
    onContactAddressTextChanged: text => {
      dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET, payload: text});
    },
    onCheckSameAddress: checked => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'isSameAddress', payload: checked});
    },
    onPriceInterestedChanged: values => {
      dispatch({type: GLOBAL_ACTIONS.PRICES_INTERESTED, payload: values});
    },
    onFocusField: ({path, fieldName, parent}) => {
      dispatch({type: GLOBAL_ACTIONS.FOCUS, path, fieldName, parent});
    },
    onBlurField: ({path, fieldName, parent}) => {
      dispatch({type: GLOBAL_ACTIONS.BLUR, path, fieldName, parent});
    },
    changeAgree: value => {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'isAgree', payload: value});
    },
    resetState: () => {
      dispatch({type: GLOBAL_ACTIONS.RESET_STATE});
    },
  };

  return props;
};

const reducer = (state: State, action) => {
  const {path, fieldName, parent} = action;
  switch (action.type) {
    case GLOBAL_ACTIONS.FIELD:
      return {...state, [action.fieldName]: action.payload};

    case GLOBAL_ACTIONS.SET_IDENTIFYCATION_TYPE:
      return {...state, nationalIdType: action.payload};

    case GLOBAL_ACTIONS.SET_ADDRESS_CITY:
      return {...state, permanentAddress: {...state.permanentAddress, city: action.payload}};
    case GLOBAL_ACTIONS.SET_ADDRESS_DISTRICT:
      return {...state, permanentAddress: {...state.permanentAddress, district: action.payload}};
    case GLOBAL_ACTIONS.SET_ADDRESS_WARD:
      return {...state, permanentAddress: {...state.permanentAddress, ward: action.payload}};
    case GLOBAL_ACTIONS.SET_ADDRESS_STREET:
      return {...state, permanentAddress: {...state.permanentAddress, street: action.payload}};

    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_CITY:
      return {...state, contactAddress: {...state.contactAddress, city: action.payload}};
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_DISTRICT:
      return {...state, contactAddress: {...state.contactAddress, district: action.payload}};
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_WARD:
      return {...state, contactAddress: {...state.contactAddress, ward: action.payload}};
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET:
      return {...state, contactAddress: {...state.contactAddress, street: action.payload}};

    case GLOBAL_ACTIONS.INSERT_WORKING_AREA:
      return {...state, workingAreas: [...state.workingAreas, action.payload]};

    case GLOBAL_ACTIONS.SET_PREFER_PROPERTY_TYPES:
      return {...state, preferPropertyTypes: action.payload};
    case GLOBAL_ACTIONS.PRICES_INTERESTED:
      return {
        ...state,
        preferPropertyPriceFrom: action.payload[0],
        preferPropertyPriceTo: action.payload[1],
      };
    case GLOBAL_ACTIONS.REMOVE_WORKING_AREA:
      return {
        ...state,
        workingAreas: state.workingAreas.filter(compareItem => compareItem !== action.payload),
      };
    case GLOBAL_ACTIONS.FOCUS:
      if (deepFindValue(state, path) === deepFindValue(initialState, path)) {
        if (parent) {
          return {
            ...state,
            [parent]: {
              ...state[parent],
              [fieldName]: '',
            },
          };
        }
        return {...state, [fieldName]: ''};
      }
      return {...state};
    case GLOBAL_ACTIONS.BLUR:
      if (deepFindValue(state, path) === '') {
        if (parent) {
          return {
            ...state,
            [parent]: {
              ...state[parent],
              [fieldName]: deepFindValue(initialState, path),
            },
          };
        }
        return {...state, [fieldName]: deepFindValue(initialState, path)};
      }
      return {...state};
    case GLOBAL_ACTIONS.RESET_STATE:
      return initialState;
    default:
      throw new Error(action.type);
  }
};

const SignUpContext = createContext('');

const SignUpProvider = ({children}) => {
  const value = useSignup();
  return <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>;
};
export {SignUpContext, SignUpProvider};

const styles = StyleSheet.create({
  btnCancelPopup: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_A100,
  },
  txtCancelPopup: {
    color: COLORS.PRIMARY_A100,
  },
});
