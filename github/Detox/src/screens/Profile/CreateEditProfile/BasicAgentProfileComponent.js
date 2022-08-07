/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import filter from 'lodash/filter';
import React, {useContext, useEffect, useReducer} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

import {
  CreateSupportRequestInput,
  useCreateAgentMutation,
  useCreateSupportRequestMutation,
  useUpdateAgentMutation,
} from '../../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../../api/graphql/parseGraphqlError';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {refreshTokenAction} from '../../../api/userApi';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getRefreshToken} from '../../../appData/authState/selectors';
import {getUser} from '../../../appData/user/selectors';
import {CONSTANTS, GLOBAL_ACTIONS} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import AgentInfoContainer from '../../../components/AgentInfoContainer';
import {useGetTopenerServiceTypes} from '../../../hooks/useGetTopenerServiceTypes';
import MeasureUtils from '../../../utils/MeasureUtils';
import {getUserFullName} from '../../../utils/UserAgentUtil';
import ValidateInput from '../../../utils/ValidateInput';
import {nationalIdDefault} from '../../Auth/AuthComponents/types';
import {callAfterInteraction} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {AgentInfoState} from './types';

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

const getProperties = interestedProperties => {
  return filter(interestedProperties, function (property) {
    return property.checked;
  })?.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }));
};

export const initialState = {
  profilePhoto: '',
  nationalId: '',
  permanentAddress: {city: {}, district: {}, ward: {}, street: ''},
  contactAddress: {city: {}, district: {}, ward: {}, street: ''},
  referralCode: '',
  preferPropertyPriceFrom: 0,
  preferPropertyPriceTo: 2,
  workingAreas: [],
  preferPropertyTypes: [],
  address: {},
  agentGroup: {},
  isAgree: false,
  isAgentLeader: false,
  nationalIdType: '',
  nationalIdIssuePlace: '',
  nationalIdIssueDate: false,
  topenerServiceTypes: [],
  allowedCrawler: true,
};

function reducer(state: AgentInfoState, action) {
  switch (action.type) {
    case GLOBAL_ACTIONS.FIELD:
      return {...state, [action.fieldName]: action.payload};
    case GLOBAL_ACTIONS.INSERT_WORKING_AREA:
      return {
        ...state,
        workingAreas: [...state.workingAreas, action.payload],
      };
    case GLOBAL_ACTIONS.REMOVE_WORKING_AREA:
      return {
        ...state,
        workingAreas: state.workingAreas.filter(compareItem => compareItem !== action.payload),
      };
    case GLOBAL_ACTIONS.PRICES_INTERESTED:
      return {
        ...state,
        preferPropertyPriceFrom: action.payload[0],
        preferPropertyPriceTo: action.payload[1],
      };
    case GLOBAL_ACTIONS.SET_PREFER_PROPERTY_TYPES:
      return {
        ...state,
        preferPropertyTypes: action.payload,
      };
    case GLOBAL_ACTIONS.SET_ADDRESS_CITY:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, city: action.payload},
      };
    case GLOBAL_ACTIONS.SET_ADDRESS_DISTRICT:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, district: action.payload},
      };
    case GLOBAL_ACTIONS.SET_ADDRESS_WARD:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, ward: action.payload},
      };

    case GLOBAL_ACTIONS.SET_ADDRESS_STREET:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, street: action.payload},
      };

    case GLOBAL_ACTIONS.SET_COPY_SAME_ADDRESS:
      return {
        ...state,
        contactAddress: action.payload,
      };

    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_CITY:
      return {
        ...state,
        contactAddress: {...state.contactAddress, city: action.payload},
      };
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_DISTRICT:
      return {
        ...state,
        contactAddress: {...state.contactAddress, district: action.payload},
      };
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_WARD:
      return {
        ...state,
        contactAddress: {...state.contactAddress, ward: action.payload},
      };
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET:
      return {
        ...state,
        contactAddress: {...state.contactAddress, street: action.payload},
      };
    case GLOBAL_ACTIONS.SET_IDENTIFYCATION_TYPE:
      return {
        ...state,
        nationalIdType: action.payload,
      };
    case GLOBAL_ACTIONS.SET_AGENT_TYPE:
      return {
        ...state,
        agentGroup: action.payload,
      };

    default:
      return {...state};
  }
}

export const mappingAddressToPlace = permanentAddress => {
  if (!permanentAddress) {
    return {};
  }
  return {
    cityId: permanentAddress.city.id,
    cityName: permanentAddress.city.name,
    districtId: permanentAddress.district.id,
    districtName: permanentAddress.district.name,
    wardId: permanentAddress.ward.id,
    wardName: permanentAddress.ward.name,
    streetName: permanentAddress.street,
  };
};

export const parsePlaceToAddress = place => {
  return {
    city: {id: place?.cityId, name: place?.cityName},
    district: {id: place?.districtId, name: place?.districtName},
    ward: {id: place?.wardId, name: place?.wardName},
    street: place?.streetName,
  };
};

export const parsePlaceToString = place => {
  if (place) {
    const placeObject = JSON.parse(place);
    return `${placeObject?.streetName}, ${placeObject?.wardName}, ${placeObject?.districtName}, ${placeObject?.cityName}`;
  }
};

export const mappingToAreas = permanentAddress => {
  return {
    cityId: permanentAddress.city.id,
    cityName: permanentAddress.city.name,
    districtId: permanentAddress.district.id,
    districtName: permanentAddress.district.name,
  };
};

const parseAreaToAddress = place => {
  return {
    city: {id: place.cityId, name: place.cityName},
    district: {id: place.districtId, name: place.districtName},
  };
};

export const checkValidAddress = permanentAddress => {
  if (!permanentAddress) {
    return {
      errCity: translate(STRINGS.REQUIRE_CHOOSE),
      errDistrict: translate(STRINGS.REQUIRE_CHOOSE),
      errWard: translate(STRINGS.REQUIRE_CHOOSE),
      errAddress: translate(STRINGS.REQUIRE_CHOOSE),
    };
  }
  return {
    errCity: permanentAddress?.city?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errDistrict: permanentAddress?.district?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errWard: permanentAddress?.ward?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errAddress: permanentAddress?.street ? '' : translate(STRINGS.REQUIRE_CHOOSE),
  };
};

export const checkValidContactAddress = contactAddress => {
  if (!contactAddress) {
    return {
      errContactCity: translate(STRINGS.REQUIRE_CHOOSE),
      errContactDistrict: translate(STRINGS.REQUIRE_CHOOSE),
      errerrContactWard: translate(STRINGS.REQUIRE_CHOOSE),
      errContactAddress: translate(STRINGS.REQUIRE_CHOOSE),
    };
  }
  return {
    errContactCity: contactAddress?.city?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errContactDistrict: contactAddress?.district?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errerrContactWard: contactAddress?.ward?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errContactAddress: contactAddress?.street ? '' : translate(STRINGS.REQUIRE_CHOOSE),
  };
};

const mappingRequestParams = (state, user = {}, isBooking, transactionId) => {
  const properties = state ? getProperties(state.preferPropertyTypes) : {};
  let request = {
    input: {
      userId: user.id,
      agentGroupId: state.agentGroup?.id,
      permanentAddress: JSON.stringify(mappingAddressToPlace(state.permanentAddress)),
      contactAddress: JSON.stringify(mappingAddressToPlace(state.contactAddress)),
      isAgentLeader: !!state.isAgentLeader,

      nationalId: state.nationalId,
      profilePhoto: state.profilePhoto,
      preferPropertyTypes: JSON.stringify(properties),
      referralCode: state.referralCode,
      workingAreas: JSON.stringify(state.workingAreas?.map(item => mappingToAreas(item))),
      preferPropertyPriceFrom: MeasureUtils.priceFromBillionUnit(state.preferPropertyPriceFrom),
      preferPropertyPriceTo:
        state.preferPropertyPriceTo >= CONSTANTS.MAX_PRICE_SLIDER
          ? CONSTANTS.MAX_PRICE_VALUE
          : MeasureUtils.priceFromBillionUnit(state.preferPropertyPriceTo),
      nationalIdType: state.nationalIdType,
      nationalIdIssuePlace: state.nationalIdIssuePlace,
      nationalIdIssueDate: state.nationalIdIssueDate,
      propertyAllocates: state.allowedCrawler,
    },
  };

  if (transactionId) {
    request = {...request, input: {...request.input, isBooking, transactionId}};
  }
  return request;
};

const mappingUpdateRequestParams = (state, user) => {
  const properties = getProperties(state.preferPropertyTypes);
  const params = {
    input: {
      agentId: user.id,
      permanentAddress: JSON.stringify(mappingAddressToPlace(state.permanentAddress)),
      contactAddress: JSON.stringify(mappingAddressToPlace(state.contactAddress)),
      isAgentLeader: !!state.isAgentLeader,
      referralCode: state.referralCode,
      nationalId: state.nationalId,
      preferPropertyTypes: JSON.stringify(properties),
      workingAreas: JSON.stringify(state.workingAreas?.map(item => mappingToAreas(item))),
      preferPropertyPriceFrom: MeasureUtils.priceFromBillionUnit(state.preferPropertyPriceFrom),
      preferPropertyPriceTo:
        state.preferPropertyPriceTo >= CONSTANTS.MAX_PRICE_SLIDER
          ? CONSTANTS.MAX_PRICE_VALUE
          : MeasureUtils.priceFromBillionUnit(state.preferPropertyPriceTo),
      nationalIdType: state.nationalIdType,
      nationalIdIssuePlace: state.nationalIdIssuePlace,
      nationalIdIssueDate: state.nationalIdIssueDate,
      initialAccountCode: state.initialAccountCode,
      propertyAllocates: state.allowedCrawler,
    },
  };

  return params;
};

const parseRequestParams = request => {
  if (!request) {
    return {};
  }
  const preferPropertyPriceTo = MeasureUtils.priceToBillionUnit(request.preferPropertyPriceTo);
  const input = {
    agentCode: request.agentCode,
    agentGroupId: request.agentGroupId,
    permanentAddress: JSON.parse(request.permanentAddress),
    contactAddress: JSON.parse(request.contactAddress),
    isAgentLeader: request.isAgentLeader,
    nationalId: request.nationalId,
    preferPropertyTypes: JSON.parse(request.preferPropertyTypes),
    referralCode: request.referralCode,
    workingAreas: JSON.parse(request.workingAreas),
    preferPropertyPriceFrom: MeasureUtils.priceToBillionUnit(request.preferPropertyPriceFrom),
    preferPropertyPriceTo:
      preferPropertyPriceTo >= CONSTANTS.MAX_PRICE_SLIDER
        ? CONSTANTS.MAX_PRICE_SLIDER
        : preferPropertyPriceTo,
  };

  const newState = {
    agentCode: input.agentCode,
    nationalId: input.nationalId,
    referralCode: input.referralCode,
    preferPropertyPriceFrom: input.preferPropertyPriceFrom,
    preferPropertyPriceTo: input.preferPropertyPriceTo,
    workingAreas: input.workingAreas.map(item => parseAreaToAddress(item)),
    preferPropertyTypes: input.preferPropertyTypes.map(item => {
      return {id: item.id, name: item.name, checked: true};
    }),
    permanentAddress: parsePlaceToAddress(input.permanentAddress),
    contactAddress: parsePlaceToAddress(input?.contactAddress),
    agentGroup: {
      id: request.agentGroupId,
      name: request.agentGroupDescription,
    },
    isAgree: true,
    isAgentLeader: input.isAgentLeader,
    nationalIdType: request.nationalIdType,
    nationalIdIssuePlace: request.nationalIdIssuePlace,
    nationalIdIssueDate: request.nationalIdIssueDate,
    initialAccountCode: request.initialAccountCode,
    topenerServiceTypes: JSON.parse(request.topenerServiceTypes ?? '[]')?.map(item => ({
      id: item?.requestTypeId,
    })),
    allowedCrawler: request?.propertyAllocates ?? false,
    isCompletedProfile: request?.isCompletedProfile,
  };
  return newState;
};

const handleResponse = async (responseQuery, context, navigation, refreshToken) => {
  const {showAppSpinner, showAppModal, showErrorAlert} = context;
  const {data, loading, error} = responseQuery;

  const response = navigation ? data?.createNewAgent : data?.updateAgent;
  const successText = translate(navigation ? STRINGS.SUCCESS_CREATE : STRINGS.SUCCESS_UPDATE);
  if (loading) {
    showAppSpinner(true);
    return;
  }
  if (error) {
    showAppSpinner(false);
    callAfterInteraction(() => {
      const errorMessage = parseGraphqlError(error);
      showErrorAlert(errorMessage);
    });

    return;
  }
  if (!response) {
    return;
  }
  if (response?.errorCode === 0) {
    //force refresh token to get new role and permission
    const refreshResponse = await refreshTokenAction(refreshToken);
    showAppSpinner(false);
    callAfterInteraction(() => {
      if (!refreshResponse) {
        return;
      }
      if (navigation) {
        navigation.goBack();
      } else {
        showAppModal({
          isVisible: true,
          title: translate(STRINGS.SUCCESS),
          message: successText,
        });
      }
    });
  } else {
    showAppSpinner(false);
    callAfterInteraction(() => {
      showErrorAlert(response.errorMessage);
    });
  }
};

const isValid = errors => {
  const {
    errArea,
    errProperty,
    errTeam,
    errNationId,
    errNationalIdIssueDate,
    errNationalIdIssuePlace,
    errNationalIdType,
  } = errors;
  const {errCity, errDistrict, errWard, errAddress, errContactAddress, errReferralCode} = errors;
  if (
    !errArea &&
    !errProperty &&
    !errTeam &&
    !errNationId &&
    !errCity &&
    !errDistrict &&
    !errWard &&
    !errAddress &&
    !errContactAddress &&
    !errReferralCode &&
    !errNationalIdIssueDate &&
    !errNationalIdIssuePlace &&
    !errNationalIdType
  ) {
    return true;
  }
  return false;
};

export const initialErrorMessages = {
  errArea: '',
  errProperty: '',
  errTeam: '',
  errNationId: '',
  errProfilePhoto: '',
  errAddress: '',
  errReferral: '',
  errCity: '',
  errDistrict: '',
  errWard: '',

  errContactCity: '',
  errContactDistrict: '',
  errerrContactWard: '',
  errContactAddress: '',

  errReferralCode: '',
  errNationalIdType: '',
  errNationalIdIssuePlace: '',
  errNationalIdIssueDate: '',
};

const getError = (condition, message) => {
  let error = '';
  if (condition) {
    error = message;
  }
  return error;
};

const getErrorObject = (state: AgentInfoState, errors) => {
  const eProperty = getError(
    getProperties(state.preferPropertyTypes)?.length === 0,
    translate(STRINGS.ERR_AT_LEAST_ONE_PROPERTY),
  );
  const eArea = getError(state.workingAreas.length === 0, translate(STRINGS.ERR_AT_LEAST_ONE_AREA));

  const eTeam = getError(!state.agentGroup.id, translate(STRINGS.ERR_AT_LEAST_ONE_TEAM));

  const eNationId = getError(!state.nationalId, translate(STRINGS.ERR_MISSING_NATION_ID));

  const eNationPlace = getError(!state.nationalIdIssuePlace, translate(STRINGS.REQUIRED_FIELD));
  const eNationDate = getError(!state.nationalIdIssueDate, translate(STRINGS.REQUIRED_FIELD));

  const eNationType = getError(!state.nationalIdType, translate(STRINGS.REQUIRE_IDENTIFY));

  const eAddress = checkValidAddress(state.permanentAddress);
  const eContactAddress = checkValidContactAddress(state.contactAddress);

  let eReferralCode = '';
  if (state.referralCode) {
    const phoneCheck = ValidateInput.checkMobilePhone(state.referralCode);
    eReferralCode = phoneCheck ? translate(phoneCheck) : '';
  }

  return {
    ...errors,
    errProperty: eProperty,
    errArea: eArea,
    errTeam: eTeam,
    errNationId: eNationId,
    ...eAddress,
    ...eContactAddress,
    errReferral: eReferralCode,

    errNationalIdType: eNationType,
    errNationalIdIssuePlace: eNationPlace,
    errNationalIdIssueDate: eNationDate,
  };
};

const onRemoveMessages = (state, errors, setErrors, submitOnce) => {
  if (!submitOnce) {
    return;
  }
  setErrors(getErrorObject(state, errors));
};

const onValidateMessage = (state, errors, setErrors) => {
  const errorObject = getErrorObject(state, errors);
  setErrors(errorObject);
  return isValid(errorObject);
};

const BasicAgentProfileComponent = ({route}) => {
  const navigation = useNavigation();

  const isBooking = route?.params?.isBooking;
  const transactionId = route?.params?.transactionId;
  const isEditRefCode = route?.params?.isEditRefCode;
  const {data: allTopenerServiceTypes} = useGetTopenerServiceTypes();
  const [state, dispatch] = useReducer(
    reducer,
    route?.params?.agentById ? parseRequestParams(route?.params?.agentById) : initialState,
  );
  const [errors, setErrors] = React.useState(initialErrorMessages);
  const [submitOnce, setSubmitOnce] = React.useState(false);
  const [editRefCode, setEditRefCode] = React.useState(isEditRefCode);
  const user = useSelector(getUser);
  const refreshToken = useSelector(getRefreshToken);
  const context = useContext(AppContext);

  const [createAgentWS, createQuery] = useCreateAgentMutation({});

  const [updateAgentWS, updateQuery] = useUpdateAgentMutation({});

  const {startApi: createSupportRequest} = useGraphqlApiLazy({
    showSpinner: true,
    graphqlApiLazy: useCreateSupportRequestMutation,
    dataField: 'createSupportRequest',
    onSuccess: () => {
      context.showMessageAlert(
        translate(STRINGS.SUCCESS),
        translate('ACCOUNT_CODE.REQUEST_SUCCESS'),
      );
    },
  });

  const onAgentCodeChanged = text =>
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'agentCode', payload: text});

  const onIdTextChanged = text =>
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'nationalId', payload: text});

  const onChangeIdentifyDate = text =>
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'nationalIdIssueDate', payload: text});

  const onChangeIdentifyPlace = text =>
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'nationalIdIssuePlace', payload: text});

  const onPhotoChanged = text =>
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'profilePhoto', payload: text});

  const onAddressTextChanged = text =>
    dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_STREET, payload: text});

  const onContactAddressTextChanged = text =>
    dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET, payload: text});

  const onPriceInterestedChanged = values => {
    dispatch({type: GLOBAL_ACTIONS.PRICES_INTERESTED, payload: values});
  };
  const onReferralCodeTextChanged = text =>
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'referralCode', payload: text});

  const setIsCompletedProfile = payload =>
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'isCompletedProfile', payload});

  useEffect(() => {
    handleResponse(createQuery, context, navigation, refreshToken);
    const {data} = updateQuery;
    if (data?.createQuery?.errorCode === 0 && state.createQuery.length > 0) {
      setEditRefCode(false);
    }
  }, [createQuery.data, createQuery.loading, createQuery.error]);

  useEffect(() => {
    handleResponse(updateQuery, context, null, refreshToken);
    const {data} = updateQuery;
    if (data?.updateAgent?.errorCode === 0) {
      setIsCompletedProfile(state.nationalId !== nationalIdDefault);
      if (state.referralCode && state.referralCode.length > 0) {
        setEditRefCode(false);
      }
    }
  }, [updateQuery.data, updateQuery.loading, updateQuery.error]);

  useEffect(() => {
    onRemoveMessages(state, errors, setErrors, submitOnce);
  }, [state]);

  const onSubmit = () => {
    setSubmitOnce(true);
    if (onValidateMessage(state, errors, setErrors)) {
      state.agentCode
        ? updateAgentWS({variables: {...mappingUpdateRequestParams(state, user)}})
        : createAgentWS({
            variables: {...mappingRequestParams(state, user, isBooking, transactionId)},
          });
    }
  };

  const requestChangeAccountCode = newAccountCode => {
    const {firstName, lastName, phoneNumber, email, initialAccountCode} = route?.params?.agentById;
    const fullName = getUserFullName({firstName, lastName});
    const description = `Chỉnh sửa MSNV (cũ: ${initialAccountCode}, mới: ${newAccountCode})`;
    const input: CreateSupportRequestInput = {
      requesterEmail: email,
      requesterIsUser: true,
      requesterName: fullName,
      requesterPhoneNumber: phoneNumber,
      requestTypeId: '0113be6f-711f-407d-abf0-372c23a6b6b3',
      requestDescription: description,
    };
    createSupportRequest({variables: {input}});
  };

  return (
    <View style={styles.body} testID={ScreenIds.CreateUpdateProfile}>
      <AgentInfoContainer
        state={state}
        dispatch={dispatch}
        errors={errors}
        onIdTextChanged={onIdTextChanged}
        onPhotoChanged={onPhotoChanged}
        onAddressTextChanged={onAddressTextChanged}
        onContactAddressTextChanged={onContactAddressTextChanged}
        onPriceInterestedChanged={onPriceInterestedChanged}
        onReferralCodeTextChanged={onReferralCodeTextChanged}
        onAgentCodeChanged={onAgentCodeChanged}
        onChangeIdentifyDate={onChangeIdentifyDate}
        onChangeIdentifyPlace={onChangeIdentifyPlace}
        requestChangeAccountCode={requestChangeAccountCode}
        onSubmit={onSubmit}
        isEdit={state.agentCode}
        isEditRefCode={editRefCode}
        allTopenerServiceTypes={allTopenerServiceTypes}
      />
    </View>
  );
};

export default BasicAgentProfileComponent;
