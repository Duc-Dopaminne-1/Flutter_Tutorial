import React from 'react';

import {GLOBAL_ACTIONS} from '../../../assets/constants';
import BaseScreen from '../../../components/BaseScreen';
import ScreenIds from '../../ScreenIds';
import {BOOKING_DEPOSIT_ACTIONS} from '../actions';
import ConfirmInformation from './Components/ConfirmInformation';
import useConfirmProperty from './useConfirmProperty';

function reducer(state, action) {
  switch (action.type) {
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
    case GLOBAL_ACTIONS.SET_COPY_SAME_ADDRESS:
      return {
        ...state,
        contactAddress: action.payload,
      };
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET:
      return {
        ...state,
        contactAddress: {...state.contactAddress, street: action.payload},
      };

    case BOOKING_DEPOSIT_ACTIONS.FIELD:
      return {...state, [action.fieldName]: action.payload};

    case BOOKING_DEPOSIT_ACTIONS.CHECK_IS_BUYER:
      return {
        ...state,
        ...action.payload,
      };

    case BOOKING_DEPOSIT_ACTIONS.UNCHECK_IS_BUYER:
      return {
        ...state,
        isBuyer: false,
        customerFullName: '',
        customerPhone: '',
        customerEmail: '',
        customerNationalId: '',
        customerNationalIdIssueDate: '',
        customerNationalIdIssuePlace: '',
        permanentAddress: '',
        contactAddress: '',
        customerBirthDay: '',
        customerGender: '',
        nationalIdType: '',
      };
    case BOOKING_DEPOSIT_ACTIONS.SET_CONSULTANT_DETAIL:
      return {
        ...state,
        consultantInfo: action.payload,
      };
    default:
      return {...state};
  }
}

const ConfirmTransactionScreen = ({navigation, route}) => {
  const {depositeTransactionId, isUpdateInfo = false, customerInfo = false} = route?.params;
  const {screenTitle, errors, setAgent, state, dispatch, onConfirm, isBooking, onBackPress} =
    useConfirmProperty({
      isUpdateInfo,
      depositeTransactionId,
      customerInfo,
      reducer,
      navigation,
    });
  return (
    <BaseScreen title={screenTitle} onBackPress={onBackPress} testID={ScreenIds.ConfirmTransaction}>
      <ConfirmInformation
        state={state}
        dispatch={dispatch}
        onConfirm={onConfirm}
        errors={errors}
        customerInfo={customerInfo}
        isUpdateInfo={isUpdateInfo}
        isBooking={isBooking}
        setAgent={setAgent}
      />
    </BaseScreen>
  );
};

export default ConfirmTransactionScreen;
