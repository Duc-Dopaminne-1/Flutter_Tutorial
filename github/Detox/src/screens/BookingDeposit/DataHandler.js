import {dateToTimestamp} from '../../utils/TimerCommon';

export const ConfirmBookingDepositErrors = {
  customerName: '',
  customerPhone: '',
  customerNationalId: '',
  customerNationalIssueDate: '',
  customerNationalIssuePlace: '',
  permanentAddress: '',
  customerContactAddress: '',
  customerBirthDay: '',
  customerGender: '',
  customerDob: '',
};

export const GetBookingRequest = state => {
  const request = {
    locale: state.locale,
    propertyPostId: state.propertyPost.propertyPostId,
    projectId: state.project.projectId,
    consultantId: state?.consultantInfo?.staffId,
    paymentMethod: state?.paymentMethod,
    isBuyer: state.isBuyer,
    customerFullName: state.customerFullName,
    customerPhone: state.customerPhone,
    customerEmail: state.customerEmail,
    customerNationalId: state.customerNationalId,
    customerNationalIdType: state?.nationalIdType,
    customerNationalIdIssueDate: dateToTimestamp(new Date(state.customerNationalIdIssueDate)),
    customerNationalIdIssuePlace: state.customerNationalIdIssuePlace,
    permanentAddress: state.permanentAddress,
    customerContactAddress: state.contactAddress,
    customerGender: state?.customerGender,
    customerDob: state?.customerBirthDay,
    fundAccountId: state.fundAccountId,
    userId: state?.userInfo.id,
  };
  return request;
};
