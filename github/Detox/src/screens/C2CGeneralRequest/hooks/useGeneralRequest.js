import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import {useContext, useEffect, useMemo, useReducer, useState} from 'react';

import {
  useCreateC2CDemandMutation,
  useUpdateC2CDemandMutation,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {CONTACT_TRADING_TYPE, GLOBAL_ACTIONS, PRICE_ARRAY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {validateFields} from '../../../utils/ErrorHandler';
import ValidateInput from '../../../utils/ValidateInput';
import ValidateInputMessage from '../../../utils/ValidateInputMessage';
import {getDirectionList, getRoomsList, locationTypes} from '../constants';
import {buildCreateQueryVariables, buildUpdateQueryVariables} from '../utils/generalRequestUtils';

const validatePrice = price => {
  if (isEmpty(price) || (!price?.priceRangeTo && !price?.priceRangeFrom) || !price?.priceRangeTo) {
    return Message.MRG_ERR_001;
  }
};

const validateSquare = square => {
  if (
    isEmpty(square) ||
    (!square?.squareRangeFrom && !square?.squareRangeTo) ||
    !square?.squareRangeTo
  ) {
    return Message.MRG_ERR_001;
  }
};

const BASIC_FIELD_VALIDATORS = {
  title: ValidateInputMessage.checkRequiredFieldMessage,
  requesterFullName: ValidateInput.checkName,
  requesterPhone: ValidateInput.checkMobilePhone,
  requesterEmail: ValidateInput.checkEmail,
  price: validatePrice,
  square: validateSquare,
};

export const checkValidPlace = place => {
  if (!place) {
    return {
      city: translate(STRINGS.REQUIRE_CHOOSE),
      district: translate(STRINGS.REQUIRE_CHOOSE),
    };
  }
  return {
    city: place?.city?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    district: place?.districts?.length ? '' : translate(STRINGS.REQUIRE_CHOOSE),
  };
};

const validate = (state, isUpdate) => {
  const updateValidators = {
    price: BASIC_FIELD_VALIDATORS.price,
    square: BASIC_FIELD_VALIDATORS.square,
    title: BASIC_FIELD_VALIDATORS.title,
  };
  const errs = validateFields(state, isUpdate ? updateValidators : BASIC_FIELD_VALIDATORS);
  const errorAddress = checkValidPlace(state.place);
  const errorValue = {
    ...errs,
    ...errorAddress,
  };
  return pickBy(errorValue);
};

export const GENERAL_REQUEST_ACTION = {
  CHECK_IS_BUYER: 'CHECK_IS_BUYER',
  UNCHECK_IS_BUYER: 'UNCHECK_IS_BUYER',
};

function reducer(state, action) {
  switch (action.type) {
    case GLOBAL_ACTIONS.RESET:
      return action.payload;
    case GLOBAL_ACTIONS.FIELD:
      const fieldError = null;
      return {
        ...state,
        [action.fieldName]: action.payload,
        errorState: {...state.errorState, ...fieldError},
      };
    case GLOBAL_ACTIONS.CREATE_WORKING_AREA:
      return {
        ...state,
        place: action.payload,
      };
    case GENERAL_REQUEST_ACTION.CHECK_IS_BUYER:
      return {
        ...state,
        requesterIsBuyer: true,
        requesterFullName: action.payload?.requesterFullName,
        requesterPhone: action.payload?.requesterPhone,
        requesterEmail: action.payload?.requesterEmail,
      };
    case GENERAL_REQUEST_ACTION.UNCHECK_IS_BUYER:
      return {
        ...state,
        requesterIsBuyer: false,
        requesterFullName: '',
        requesterPhone: '',
        requesterEmail: '',
      };
    default:
      return {...state};
  }
}

export const contactTypesList = [
  {
    id: CONTACT_TRADING_TYPE.BUY,
    name: translate('common.sell'),
    checked: true,
  },
  {
    id: CONTACT_TRADING_TYPE.RENT,
    name: translate('common.rent'),
    checked: false,
  },
];

const mapState = state => {
  return {...state};
};

const mapPropertyTypes = (json, checkedId) => {
  const listTypes = json?.edges;
  if (!listTypes || !Array.isArray(listTypes)) {
    return [];
  }

  return listTypes?.map(item => ({
    id: item.propertyTypeId,
    name: item.propertyTypeDescription,
    checked: item.propertyTypeId === checkedId ? true : false,
    type: item.propertyTypeName,
  }));
};

export const GeneralRequestErrors = {
  requesterFullName: '',
  requesterPhone: '',
  requesterEmail: '',
};

const directionsList = getDirectionList();

const useGeneralRequest = ({isUpdate = false, initialState = {}}) => {
  const navigation = useNavigation();
  const {getMasterData, showAppModal} = useContext(AppContext);
  const masterData = getMasterData();
  const [state, dispatch] = useReducer(reducer, mapState(initialState));

  const [submitOnce, setSubmitOnce] = useState(false);
  const [listPropertyType, setListPropertyType] = useState([]);
  const [listServicePostType] = useState(contactTypesList.map(e => ({...e})));

  const listPriceRange = {arrayRange: PRICE_ARRAY.map(e => ({...e}))};

  const getLocations = locationId =>
    locationTypes.map(e => ({...e, checked: locationId ? locationId === e.id : e.checked}));

  const locations = useMemo(() => getLocations(state?.propertyLocation), [state.propertyLocation]);

  const getDirections = (directions = []) => {
    return directionsList?.map(e => {
      const hasDirection = directions?.includes(e?.id);
      return {
        ...e,
        checked: hasDirection ?? false,
      };
    });
  };

  const directions = useMemo(() => getDirections(state?.direction), [state.direction]);

  const listRooms = getRoomsList();

  const [errors, setErrors] = useState(isUpdate ? {} : GeneralRequestErrors);

  const {startApi: createC2CDemand} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useCreateC2CDemandMutation,
    onSuccess: onCreateSuccess,
  });

  const {startApi: updateC2CDemand} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useUpdateC2CDemandMutation,
    onSuccess: onUpdateSuccess,
  });

  useEffect(() => {
    const propertyTypes = mapPropertyTypes(masterData?.propertyTypes, state?.propertyTypeId);
    if (!state.propertyTypeId && propertyTypes.length > 0) {
      propertyTypes[0].checked = true;
      const item = propertyTypes[0];
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'propertyTypeId', payload: item?.id});
    }
    setListPropertyType(propertyTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterData.propertyTypes]);

  useEffect(() => {
    if (!submitOnce) {
      return;
    }
    const errs = validate(state, isUpdate);
    if (!isEmpty(errs)) {
      setErrors(errs);
      return;
    }
    setErrors(isUpdate ? {} : GeneralRequestErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onCreateSuccess = () => {
    const title = translate(STRINGS.SUCCESS);
    const message = translate(STRINGS.SUCCESS_CREATE);
    showAppModal({
      isVisible: true,
      title,
      message,
      onOkHandler: () => {
        navigation.canGoBack && navigation.goBack();
      },
    });
  };

  const onUpdateSuccess = () => {
    const title = translate(STRINGS.SUCCESS);
    const message = translate(STRINGS.SUCCESS_UPDATE);
    showAppModal({
      isVisible: true,
      title,
      message,
      onOkHandler: () => {
        navigation.canGoBack && navigation.goBack();
      },
    });
  };

  const createGeneralRequest = captcha => {
    const createRequest = buildCreateQueryVariables({...state, tokenCaptcha: captcha});
    createC2CDemand({variables: {request: createRequest}}, onCreateSuccess);
  };

  const updateGeneralRequest = () => {
    const updateRequest = buildUpdateQueryVariables({...state});
    updateC2CDemand({variables: {request: updateRequest}}, onUpdateSuccess);
  };

  const onSubmit = captcha => {
    !submitOnce && setSubmitOnce(true);
    const errs = validate(state, isUpdate);
    if (!isEmpty(errs)) {
      setErrors(errs);
    } else {
      if (isUpdate) {
        updateGeneralRequest();
      } else {
        createGeneralRequest(captcha);
      }
    }
  };

  const validationOnSubmit = () => {
    !submitOnce && setSubmitOnce(true);
    const errs = validate(state, isUpdate);
    if (!isEmpty(errs)) {
      setErrors(errs);
      return false;
    }
    return true;
  };

  const onBack = () => {
    navigation.canGoBack && navigation.goBack();
  };

  return {
    onSubmit,
    errors,
    state,
    onBack,
    dispatch,
    listPropertyType,
    listServicePostType,
    listPriceRange,
    locations,
    listRooms,
    validationOnSubmit,
    directions,
  };
};

export default useGeneralRequest;
