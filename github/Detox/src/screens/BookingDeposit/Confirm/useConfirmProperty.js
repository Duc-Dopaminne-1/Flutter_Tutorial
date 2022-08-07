import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import {useContext, useEffect, useReducer, useState} from 'react';

import {useSendOtpToUpdateCustomerForDepositTransactionMutation} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {TRANSACTION_MODE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {validateFields} from '../../../utils/ErrorHandler';
import ValidateInput from '../../../utils/ValidateInput';
import {
  checkValidAddress,
  checkValidContactAddress,
  mappingAddressToPlace,
  parsePlaceToAddress,
} from '../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';
import {BOOKING_DEPOSIT_ACTIONS} from '../actions';
import {ConfirmBookingDepositErrors} from '../DataHandler';
import {BookingContext} from '../useBooking';

const isBookingTransaction = projectStatus => {
  return projectStatus === TRANSACTION_MODE.BOOKING;
};

const getScreenTitle = projectStatus => {
  return isBookingTransaction(projectStatus)
    ? translate(STRINGS.BOOKING_SUMMARY)
    : translate('project.confirmTransaction.depositHeader');
};

export const getFullName = info =>
  `${info?.customerLastName ?? ''} ${info?.customerFirstName ?? ''}`;

const BASIC_FIELD_VALIDATORS = {
  customerFullName: ValidateInput.checkName,
  customerPhone: ValidateInput.checkMobilePhone,
  customerNationalId: ValidateInput.checkIdentity,
  customerNationalIdIssueDate: ValidateInput.checkName,
  customerNationalIdIssuePlace: ValidateInput.checkName,
  permanentAddress: ValidateInput.checkName,
  customerEmail: ValidateInput.checkEmail,
  customerBirthDay: ValidateInput.checkName,
  customerGender: ValidateInput.validateGender,
  nationalIdType: ValidateInput.checkRequiredField,
};

const validate = state => {
  const errs = validateFields(state, BASIC_FIELD_VALIDATORS);
  const eAddress = checkValidAddress(state.permanentAddress);
  const eContactAddress = checkValidContactAddress(state.contactAddress);
  const errorValue = {
    ...errs,
    ...eAddress,
    ...eContactAddress,
  };
  return pickBy(errorValue);
};

const useConfirmProperty = ({
  customerInfo,
  depositeTransactionId,
  isUpdateInfo,
  reducer,
  navigation,
}) => {
  const {track} = useAnalytics();
  const {
    state: moduleState,
    setAgent,
    resetCustomerDepositInfo,
    setState,
  } = useContext(BookingContext);
  const {projectStatus} = moduleState.project;
  const [submitOnce, setSubmitOnce] = useState(false);
  const [isBooking] = useState(isBookingTransaction(projectStatus));
  const [state, dispatch] = useReducer(reducer, moduleState);
  const [errors, setErrors] = useState(ConfirmBookingDepositErrors);
  const screenTitle = isUpdateInfo
    ? translate('transaction.detail.updateInfoCustomer')
    : getScreenTitle(projectStatus);

  const {startApi: sendOtp} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useSendOtpToUpdateCustomerForDepositTransactionMutation,
  });

  useEffect(() => {
    if (!submitOnce) {
      return;
    }
    const errs = validate(state);
    if (!isEmpty(errs)) {
      setErrors(errs);
      return;
    }
    setErrors(ConfirmBookingDepositErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const fieldInfo = () => {
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
  };

  useEffect(() => {
    if (isUpdateInfo) {
      fieldInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateInfo]);

  const mapStateToConfirmOtp = () => {
    const tempState = {
      depositTransactionId: depositeTransactionId,
      customerFullName: state?.customerFullName,
      customerGender: state?.customerGender,
      customerDob: state?.customerBirthDay,
      customerPhone: state?.customerPhone,
      customerEmail: state?.customerEmail,
      customerNationalIdType: state?.nationalIdType,
      customerNationalId: state?.customerNationalId,
      customerNationalIdIssueDate: state?.customerNationalIdIssueDate,
      customerNationalIdIssuePlace: state?.customerNationalIdIssuePlace,
      customerPermanentAddress: JSON.stringify(mappingAddressToPlace(state.permanentAddress)),
      customerContactAddress: JSON.stringify(mappingAddressToPlace(state.contactAddress)),
    };
    return tempState;
  };

  const saveStateToPayment = () => {
    const tempState = {
      permanentAddress: JSON.stringify(mappingAddressToPlace(state.permanentAddress)),
      contactAddress: JSON.stringify(mappingAddressToPlace(state.contactAddress)),
      isBuyer: state?.isBuyer,
      customerFullName: state?.customerFullName,
      customerPhone: state?.customerPhone,
      customerEmail: state?.customerEmail,
      customerNationalId: state?.customerNationalId,
      customerNationalIdIssueDate: state?.customerNationalIdIssueDate,
      customerNationalIdIssuePlace: state?.customerNationalIdIssuePlace,
      nationalIdType: state?.nationalIdType,
      customerGender: state?.customerGender,
      customerBirthDay: state?.customerBirthDay,
    };
    setState({...moduleState, ...tempState});
  };

  const onConfirm = () => {
    !submitOnce && setSubmitOnce(true);
    const errs = validate(state);
    if (!isEmpty(errs)) {
      setErrors(errs);
    } else {
      if (isUpdateInfo) {
        sendOtp(
          {
            variables: {
              request: {
                depositTransactionId: depositeTransactionId,
              },
            },
          },
          () => {
            navigation.navigate(ScreenIds.TransactionOTPScreen, {
              state: mapStateToConfirmOtp(),
            });
          },
        );
      } else {
        track(TrackingActions.projectOrderBuyerConfirmed, {
          property_id: state?.propertyPost?.propertyCode,
          project_name: state?.project?.projectName,
          project_status: state?.project?.projectStatusDescription,
          floor: state?.propertyPost?.floor,
          block: state?.propertyPost?.blockName,
          consultant: state?.consultantInfo?.fullName,
          is_buy_for_myself: state?.isBuyer,
          full_name: state?.customerFullName,
          phone_number: state?.customerPhone,
          email: state?.customerEmail,
          birthDay: new Date(state?.customerBirthDay).toISOString(),
          gender: state?.customerGender,
        });

        saveStateToPayment();
        navigation.navigate(ScreenIds.SelectPaymentMethod);
      }
    }
  };

  const onBackPress = () => {
    resetCustomerDepositInfo();
    navigation.canGoBack && navigation.goBack();
  };

  return {onConfirm, screenTitle, errors, setAgent, state, onBackPress, dispatch, isBooking};
};

export default useConfirmProperty;
