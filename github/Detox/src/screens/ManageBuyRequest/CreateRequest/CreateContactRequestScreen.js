import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {StyleSheet} from 'react-native';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {
  CONTACT_TRADING_TYPE,
  getLocationList,
  GLOBAL_ACTIONS,
  NAVIGATION_ANIMATION_DURATION,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import BaseScreen from '../../../components/BaseScreen';
import {getPropertyTypeDescriptionById} from '../../../utils/GetMasterData';
import {parseDirection, parseLocationToEnum} from '../../../utils/MapDataUtils';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {CONTACT_ACTIONS, CONTACT_FIELD} from '../DetailRequestConstant';
import {
  convertDirections,
  getPropertyTypeChoices,
  mapAreaToAreaOptions,
  mapPriceToPriceRanges,
} from '../ManageBuyRequestUtils';
import {ContactTradingContext} from '../useContactTrading';
import CreateContactRequestContainer from './CreateRequestComponents/CreateContactRequestContainer';

const styles = StyleSheet.create({
  baseScreenContainer: {
    backgroundColor: COLORS.BACKGROUND,
  },
});

function clearFieldError(fieldName) {
  return {[fieldName]: ''};
}

function validateFieldName(fieldName, value) {
  return {[fieldName]: ValidateInput.checkRequiredField(value)};
}

function validateFieldNumber(fieldName, value) {
  const errorCode = ValidateInput.checkFloatNumberOnly(value);
  return {[fieldName]: isEmpty(errorCode) || isEmpty(value) ? '' : translate(errorCode)};
}

const validateForm = state => {
  const errorList = {
    ...validateFieldName(CONTACT_FIELD.city, state?.interestedCity?.name ?? ''),
    ...validateFieldName(CONTACT_FIELD.district, state?.interestedDistrict?.name ?? ''),
    ...validateFieldNumber(CONTACT_FIELD.fromPrice, state?.interestedPrice?.fromValue ?? ''),
    ...validateFieldNumber(CONTACT_FIELD.toPrice, state?.interestedPrice?.toValue ?? ''),
    ...validateFieldNumber(CONTACT_FIELD.fromArea, state?.areaMeasurement?.fromValue ?? ''),
    ...validateFieldNumber(CONTACT_FIELD.toArea, state?.areaMeasurement?.toValue ?? ''),
  };
  let isValid = true;
  // eslint-comments no-unused-vars
  for (const [key, value] of Object.entries(errorList)) {
    const isRequiredFields = key === CONTACT_FIELD.city || key === CONTACT_FIELD.district;
    if (value && isRequiredFields) {
      isValid = false;
      break;
    }
  }

  return {
    ...errorList,
    isValid,
  };
};

function reducer(state, action) {
  let newState = {...state};
  switch (action.type) {
    case CONTACT_ACTIONS.POST_CODE:
      const postInfo = {...state.postInfo, postId: ''};
      newState = {...state, [action.fieldName]: action.payload};
      const clearError = clearFieldError(action.fieldName);
      return {...newState, errors: {...state.errors, ...clearError}, postInfo: postInfo};
    case CONTACT_ACTIONS.FIELD:
      newState = {...state, [action.fieldName]: action.payload};
      const fieldError = clearFieldError(action.fieldName);
      return {...newState, errors: {...state.errors, ...fieldError}};
    case CONTACT_ACTIONS.SET_ERROR_STATE:
      return {...state, errors: {...state.errors, ...action.payload}};
    case GLOBAL_ACTIONS.RESET:
      newState = {...action.payload};
      return newState;
    default:
      return newState;
  }
}

const mapRequestInfo = (state, masterData) => {
  const parsedDirection = parseDirection(state?.direction, true);
  const parsedLocation = parseLocationToEnum(state?.location);
  const requestInfo = {
    propertyPostId: null,
    propertyPostUrl: state.postUrl,
    propertyPriceFrom: parseFloat(state.interestedPrice?.fromValue) || null,
    propertyPriceTo: parseFloat(state.interestedPrice?.toValue) || null,
    propertyTypeId: state.propertyPostTypeId,
    propertyTypeDescription: getPropertyTypeDescriptionById(masterData, state?.propertyPostTypeId),
    direction: parsedDirection,
    cityId: state.interestedCity?.id,
    cityName: state.interestedCity?.name,
    districtId: state.interestedDistrict?.id,
    districtName: state.interestedDistrict?.name,
    totalAreaFrom: parseFloat(state.areaMeasurement?.fromValue),
    totalAreaTo: parseFloat(state.areaMeasurement?.toValue),
    location: parsedLocation,
    projectId: state.project?.id,
    numberOfBedroom: state?.createContactPropertyInfo?.numberOfBedroom ?? 0,
    numberOfBathroom: state?.createContactPropertyInfo?.numberOfBathroom ?? 0,
    defaultRelevantProperty: state?.createContactPropertyInfo?.defaultRelevantProperty,
    contactType: state?.contactType,
  };

  return {...requestInfo};
};

const initialErrorState = {
  [CONTACT_FIELD.city]: '',
  [CONTACT_FIELD.district]: '',
  [CONTACT_FIELD.fromArea]: '',
  [CONTACT_FIELD.fromPrice]: '',
  [CONTACT_FIELD.toArea]: '',
  [CONTACT_FIELD.toPrice]: '',
  [CONTACT_FIELD.postUrl]: '',
};

const mapCTInfoToPostInfo = (state, masterData, contactType) => {
  const {
    projectInfo,
    propertyAddress = {},
    projectId,
    price,
    propertyCode,
    postArea,
    propertyTypeId,
    propertyTypeName,
    direction,
    propertyPostForRentDto,
  } = state?.createContactPropertyInfo ?? {};
  const isSearchRentPost = contactType === CONTACT_TRADING_TYPE.RENT;
  const arrayDirections = direction?.split(',');
  const convertedDirections = convertDirections(arrayDirections);
  const mappedInterestedPrice = mapPriceToPriceRanges(
    isSearchRentPost ? propertyPostForRentDto?.rentPrice : price,
    null,
    contactType,
  );
  const mappedAreaMeasurement = mapAreaToAreaOptions(postArea);
  let propertyPostTypeId = null;
  if (!isEmpty(propertyTypeId) || !isEmpty(propertyTypeName)) {
    propertyPostTypeId = propertyTypeId;
  } else {
    const choices = getPropertyTypeChoices(masterData);
    propertyPostTypeId = choices[0]?.id;
  }

  return {
    ...state,
    propertyPostTypeId,
    direction: convertedDirections,
    project: {
      id: projectId || '',
      name: projectInfo?.projectName || '',
    },
    interestedCity: {
      id: propertyAddress?.cityId || '',
      name: propertyAddress?.cityName || '',
    },
    interestedDistrict: {
      id: propertyAddress?.districtId,
      name: propertyAddress?.districtName,
    },
    interestedPrice: mappedInterestedPrice,
    areaMeasurement: mappedAreaMeasurement,
    postCode: propertyCode,
    location: state?.location ?? getLocationList()[0].name,
  };
};

const initialState = {
  contactType: CONTACT_TRADING_TYPE.BUY,
  propertyPostTypeId: null,
  direction: [],
  project: {},
  interestedCity: {},
  interestedDistrict: {},
  interestedPrice: {},
  areaMeasurement: {},
  postCode: '',
  location: null,
};

const CreateContactRequestScreen = ({navigation}) => {
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const {
    state: moduleState,
    updateCreateContactRequestInfo,
    resetCreateContactRequestInfo,
    setFieldToState,
  } = useContext(ContactTradingContext);
  const [state, dispatch] = useReducer(reducer, {
    ...moduleState.createContactPropertyInfo,
    ...initialState,
    errors: initialErrorState,
  });
  const createContactState = {
    createContactPropertyInfo: {...moduleState.createContactPropertyInfo},
    ...state,
  };
  const [showError, setShowError] = useState(false);
  const setErrorState = value => {
    dispatch({type: CONTACT_ACTIONS.SET_ERROR_STATE, payload: value});
  };
  const setState = value => {
    dispatch({type: GLOBAL_ACTIONS.RESET, payload: value});
  };

  useMount(() => {
    setFieldToState({masterData: masterData});
  });

  const handleOnGetPropertyPostInfo = () => {
    setState({
      ...state,
      ...mapCTInfoToPostInfo(moduleState, masterData, state.contactType),
    });
  };

  useEffect(handleOnGetPropertyPostInfo, [moduleState.createContactPropertyInfo]);

  const validateInputs = (newState = null) => {
    const newErrorState = validateForm(newState ?? createContactState);
    setErrorState(newErrorState);
    return newErrorState;
  };

  // ******** Handle get property post info *********
  const handleOnPressNext = () => {
    const newErrorState = validateInputs();
    setShowError(true);
    if (newErrorState.isValid) {
      const requestInfo = mapRequestInfo(createContactState, masterData);
      updateCreateContactRequestInfo({
        ...moduleState.createContactRequestInfo,
        ...requestInfo,
      });
      navigation.navigate(ScreenIds.CreateContactRequest2);
    }
  };

  const handleOnPressCancel = () => {
    setState({...initialState, ...initialErrorState});
    resetCreateContactRequestInfo();
    setTimeout(() => navigation.pop(), NAVIGATION_ANIMATION_DURATION * 0.2);
  };

  return (
    <BaseScreen
      title={translate(STRINGS.CREATE_NEW_REQUEST)}
      testID={ScreenIds.CreateContactRequest}
      containerStyle={styles.baseScreenContainer}
      onBackPress={handleOnPressCancel}>
      <CreateContactRequestContainer
        masterData={masterData}
        state={createContactState}
        dispatch={dispatch}
        errors={showError ? createContactState.errors : initialErrorState}
        handleOnPressCancel={handleOnPressCancel}
        handleOnPressNext={handleOnPressNext}
        validateInputs={validateInputs}
      />
    </BaseScreen>
  );
};

export default CreateContactRequestScreen;
