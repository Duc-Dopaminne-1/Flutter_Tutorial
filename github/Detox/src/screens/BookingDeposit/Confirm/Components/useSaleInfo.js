import {useState} from 'react';
import {useSelector} from 'react-redux';

import {isAgent} from '../../../../appData/user/selectors';
import {MAX_LENGTH} from '../../../../assets/constants';
import {getUserFullName} from '../../../../utils/UserAgentUtil';
import {parsePlaceToAddress} from '../../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import {BOOKING_DEPOSIT_ACTIONS} from '../../actions';
import {getFullName} from '../useConfirmProperty';

export const useSaleInfo = ({state, dispatch, isUpdateInfo, customerInfo, customerDetail}) => {
  const [checkedBuyer, setCheckedBuyer] = useState(state.isBuyer);
  const isAgentUser = useSelector(isAgent);
  const updateField = (fieldName, text) => {
    dispatch({
      type: BOOKING_DEPOSIT_ACTIONS.FIELD,
      fieldName: fieldName,
      payload: text,
    });
  };

  const onCheckIsBuyer = value => {
    if (value === true) {
      if (isAgentUser) {
        dispatch({
          type: BOOKING_DEPOSIT_ACTIONS.CHECK_IS_BUYER,
          payload: {
            isBuyer: true,
            customerFullName: getUserFullName(customerDetail).slice(0, MAX_LENGTH.default),
            customerPhone: customerDetail?.phoneNumber,
            customerEmail: customerDetail?.email,
            customerBirthDay: customerDetail?.dob?.toDateTime,
            customerGender: customerDetail?.gender,
            customerNationalId: customerDetail?.nationalId,
            nationalIdType: customerDetail?.nationalIdType,
            customerNationalIdIssueDate: customerDetail?.nationalIdIssueDate,
            customerNationalIdIssuePlace: customerDetail?.nationalIdIssuePlace,
            permanentAddress: parsePlaceToAddress(JSON.parse(customerDetail?.permanentAddress)),
            contactAddress: parsePlaceToAddress(JSON.parse(customerDetail?.contactAddress)),
          },
        });
      } else {
        dispatch({
          type: BOOKING_DEPOSIT_ACTIONS.CHECK_IS_BUYER,
          payload: {
            isBuyer: false,
            customerFullName: getUserFullName(customerDetail).slice(0, MAX_LENGTH.default),
            customerPhone: customerDetail?.phoneNumber,
            customerEmail: customerDetail?.email,
          },
        });
      }
    } else if (isUpdateInfo && value === false) {
      dispatch({
        type: BOOKING_DEPOSIT_ACTIONS.CHECK_IS_BUYER,
        payload: {
          isBuyer: true,
          customerFullName: getFullName(customerInfo),
          customerPhone: customerInfo?.customerPhone,
          customerEmail: customerInfo?.customerEmail,
          customerBirthDay: customerInfo?.customerDob,
          customerGender: customerInfo?.gender,
          customerNationalId: customerInfo?.customerNationalId,
          nationalIdType: customerInfo?.nationalIdType,
          customerNationalIdIssueDate: customerInfo?.customerNationalIdIssueDate,
          customerNationalIdIssuePlace: customerInfo?.customerNationalIdIssuePlace,
          permanentAddress: parsePlaceToAddress(JSON.parse(customerInfo?.permanentAddress)),
          contactAddress: parsePlaceToAddress(JSON.parse(customerInfo?.customerContactAddress)),
        },
      });
    } else {
      dispatch({
        type: BOOKING_DEPOSIT_ACTIONS.UNCHECK_IS_BUYER,
      });
    }
    setCheckedBuyer(value);
  };

  return {checkedBuyer, updateField, onCheckIsBuyer};
};
