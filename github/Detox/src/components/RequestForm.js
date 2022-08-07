import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {PaymentUnit} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {
  CONSULT_BANKLOAN_SUPPORT_TYPE,
  CREATE_ACCOUNT_SUPPORT_TYPE,
  EMPTY_STRING,
  KEY_BOARD_TYPE,
  MAX_LENGTH,
  PAYMENT_UNITS,
  REQUEST_TYPE,
} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, normal} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import {useLogin} from '../screens/Auth/useLogin';
import SelectionOfficeView from '../screens/BookingDeposit/Confirm/Components/SelectionOfficeView';
import {callAfterInteraction} from '../screens/commonHooks';
import SubmitComponent from '../screens/ManagePost/Contact/SubmitComponent';
import ArrayUtils from '../utils/ArrayUtils';
import {dropdownMapper} from '../utils/DataProcessUtil';
import {getUserFullName} from '../utils/UserAgentUtil';
import ValidateInput from '../utils/ValidateInput';
import CustomFooterButtons from './Button/CustomFooterButtons';
import CustomCheckbox from './Checkbox/CustomCheckbox';
import DropdownCities from './DropdownCities';
import DropdownWithTitle from './DropdownWithTitle';
import ErrorText from './ErrorText';
import InputSection from './InputSection';
import KeyboardScrollView from './KeyboardScrollView';
import {Captcha} from './RecaptchaV2/Captcha';
import SelectRequestType from './SelectRequestType';
import TextView from './TextView';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normal,
    paddingBottom: normal,
  },
  textCustomerInfo: {
    ...FONTS.fontSize14,
    ...FONTS.bold,
    textAlign: 'right',
  },
  textCustomerInfoTitle: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.BRAND_GREY,
  },
  headerCustomerInfo: {
    ...FONTS.bold,
    fontSize: 21,
  },
  separatorRow32: {
    height: 32,
  },
  textInputNote: {
    width: '100%',
    height: 80,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    borderRadius: 4,
    ...METRICS.horizontalPadding,
  },
  inputTitle: {
    ...FONTS.regular,
    ...commonStyles.txtFontSize14,
    color: COLORS.BRAND_GREY,
  },
  inputPlaceholder: {
    color: COLORS.GREY_CB,
  },
});

const extractError = errors => {
  return errors.description ? translate(errors.description) : null;
};

const extractInitialData = (isEditable, value) => {
  return isEditable ? EMPTY_STRING : value;
};

const getDataField = requestType => {
  return requestType === REQUEST_TYPE.REFUND ? 'createRefundRequest' : 'createSupportRequest';
};

const getQueryOptions = defaultSelectValue => {
  if (defaultSelectValue === CREATE_ACCOUNT_SUPPORT_TYPE) {
    return {
      variables: {
        where: {
          requestTypeName_in: ['CreateAccountSupport'],
        },
      },
    };
  }
  return {
    variables: {
      where: {
        requestTypeName_not_in: ['ContactTrading', 'CreateAccountSupport'],
      },
    },
  };
};

const getBankList = (banks: Array, selectedBankId) => {
  if (!ArrayUtils.hasArrayData(banks)) {
    return banks;
  }

  const selectedBank = banks?.find(e => e.bankId === selectedBankId);
  const bankList = dropdownMapper(banks, 'bankId', 'bankName', selectedBank?.bankId ?? '');

  return bankList;
};

const getRequestInfoBodyForm = ({
  requestType,
  setName,
  name,
  setMobile,
  mobile,
  setEmail,
  email,
  errors,
  onSelectRequest,
  isEditable,
  disabledSelect,
  defaultSelectValue,
  typeNotIns,
  paymentUnit,
  refundAddress,
}) => {
  if (requestType === REQUEST_TYPE.REFUND) {
    let paidVia = PAYMENT_UNITS[paymentUnit]?.name;
    paidVia = PaymentUnit.Bidv === paymentUnit ? paidVia + '\n(BIDV)' : paidVia;
    const userInfoView = (
      <>
        <Text style={styles.headerCustomerInfo}>{translate(STRINGS.CUSTOMER_INFOR)}</Text>
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={translate(STRINGS.FULLNAME) + ':'}
          titleStyle={styles.textCustomerInfoTitle}
          containerStyle={HELPERS.mainSpaceBetween}
          valueStyle={styles.textCustomerInfo}
          value={name || '-'}
        />
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={translate(STRINGS.PHONE_NUMBER) + ':'}
          titleStyle={styles.textCustomerInfoTitle}
          containerStyle={HELPERS.mainSpaceBetween}
          valueStyle={styles.textCustomerInfo}
          value={mobile || '-'}
        />
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={translate(STRINGS.EMAIL) + ':'}
          titleStyle={styles.textCustomerInfoTitle}
          containerStyle={HELPERS.mainSpaceBetween}
          valueStyle={styles.textCustomerInfo}
          value={email || '-'}
        />
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={translate('payment.paidVia') + ':'}
          titleStyle={styles.textCustomerInfoTitle}
          containerStyle={HELPERS.mainSpaceBetween}
          valueStyle={styles.textCustomerInfo}
          valueLines={2}
          value={paidVia || '-'}
        />
        {paymentUnit === PaymentUnit.Fast && (
          <>
            <View style={commonStyles.separatorRow16} />
            <TextView
              title={translate('payment.paymentOffice') + ':'}
              titleStyle={[styles.textCustomerInfoTitle, HELPERS.fill]}
              containerStyle={HELPERS.mainSpaceBetween}
              valueStyle={[styles.textCustomerInfo, HELPERS.fill]}
              valueLines={6}
              value={refundAddress || '-'}
            />
          </>
        )}
      </>
    );
    return userInfoView;
  } else {
    const consultRequestInfoView = (
      <>
        <InputSection
          headerTitle={translate(STRINGS.YOUR_NAME)}
          placeholder={translate(STRINGS.FIll_YOUR_NAME)}
          value={name}
          error={errors.requestName}
          isRequired={true}
          editable={isEditable}
          onChangeText={setName}
        />
        <InputSection
          keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
          headerTitle={translate(STRINGS.PHONE_NUMBER)}
          placeholder={translate(STRINGS.PHONE_NUMBER)}
          value={mobile}
          error={errors.requestMobile}
          isRequired={true}
          editable={isEditable}
          onChangeText={setMobile}
        />
        <InputSection
          keyboardType={KEY_BOARD_TYPE.EMAIL}
          headerTitle={translate(STRINGS.EMAIL)}
          placeholder={translate(STRINGS.FILL_EMAIL)}
          value={email}
          isRequired={true}
          error={errors.requestEmail}
          editable={isEditable}
          onChangeText={setEmail}
        />
        <SelectRequestType
          onSelected={onSelectRequest}
          error={errors.requestTypeId}
          defaultValue={defaultSelectValue}
          disabled={disabledSelect}
          typeNotIns={typeNotIns}
          queryOptions={getQueryOptions(defaultSelectValue)}
          showSearchBox={true}
        />
      </>
    );
    return consultRequestInfoView;
  }
};

const getRefundTransactionInfo = ({
  extRefundInfo,
  refundInfo,
  paymentUnit,
  errors,
  onChosenTopenLandOffice,
  onChosenBank,
  onChangeBankBranch,
  onChangeAccountName,
  onChangeAccountNumber,
  onChosenCity = () => {},
}) => {
  switch (paymentUnit) {
    case PaymentUnit.Fast:
      return (
        <>
          <Text style={styles.headerCustomerInfo}>{translate('transaction.refundAddress')}</Text>
          <View style={commonStyles.separatorRow16} />
          <SelectionOfficeView
            isRequired
            title={translate('common.office')}
            placeHolder={translate('transaction.pleaseSelectOffice')}
            inputStyle={commonStyles.dropdownInput}
            dropdownPlaceHolderStyle={[
              commonStyles.dropdownPlaceHolder,
              extRefundInfo?.selectedOffice ? null : styles.inputPlaceholder,
            ]}
            emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
            item={extRefundInfo?.selectedOffice}
            onPress={onChosenTopenLandOffice}
            error={isEmpty(errors?.selectedOffice) ? '' : translate(errors?.selectedOffice)}
          />
          <View style={commonStyles.separatorRow8} />
        </>
      );
    case PaymentUnit.Vnpay:
      return null;
    case PaymentUnit.Bidv:
      const styleDrop = refundInfo?.selectedBankId ? null : styles.inputPlaceholder;

      return (
        <>
          <Text style={styles.headerCustomerInfo}>
            {translate('transaction.receipientCardInfo')}
          </Text>
          <View style={commonStyles.separatorRow16} />
          <DropdownWithTitle
            inputStyle={commonStyles.dropdownInput}
            title={translate(STRINGS.BANK)}
            headerStyles={styles.inputTitle}
            showSearchBox={true}
            dropdownPlaceHolderStyle={{
              ...commonStyles.dropdownPlaceHolder,
              ...styleDrop,
            }}
            dropdownTitle={translate('transaction.pleaseSelectBank')}
            popupTitle={translate('transaction.pleaseSelectBank')}
            items={refundInfo?.banks}
            itemSelected={() => {}} // TODO Parse data
            onChosen={onChosenBank}
            isRequiredAtLeastOne
            isRequired
            emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
            error={isEmpty(errors?.selectedBankId) ? '' : translate(errors?.selectedBankId)}
          />
          <DropdownCities
            onChangeCity={onChosenCity}
            isRequired
            inputStyle={commonStyles.dropdownInput}
            title={translate('PROVINCE')}
            titleStyle={styles.inputTitle}
            placeholderStyle={
              refundInfo?.selectedCityId ? {color: COLORS.TEXT_DARK_10} : styles.inputPlaceholder
            }
            placeholder={translate('common.pleaseSelectProvince')}
            selectedId={refundInfo?.selectedCityId}
            style={{...HELPERS.fill, marginVertical: normal}}
            error={isEmpty(errors?.selectedCityId) ? '' : translate(errors?.selectedCityId)}
          />
          <InputSection
            customStyle={METRICS.resetPadding}
            headerTitle={translate('common.branch')}
            placeHolderColor={COLORS.GREY_CB}
            placeholder={translate('common.enterBankBranch')}
            headerStyles={styles.inputTitle}
            inputStyle={commonStyles.input}
            value={refundInfo?.bankBranch}
            error={errors?.bankBranch}
            onChangeText={onChangeBankBranch}
            isRequired
          />
          <View style={commonStyles.separatorRow16} />
          <InputSection
            customStyle={METRICS.resetPadding}
            headerTitle={translate('common.accountName')}
            placeHolderColor={COLORS.GREY_CB}
            placeholder={translate('common.enterAccountName')}
            headerStyles={styles.inputTitle}
            inputStyle={commonStyles.input}
            value={refundInfo?.accountName}
            error={errors?.accountName}
            onChangeText={onChangeAccountName}
            isRequired
          />
          <View style={commonStyles.separatorRow16} />
          <InputSection
            customStyle={METRICS.resetPadding}
            headerTitle={translate('common.accountNumber')}
            placeHolderColor={COLORS.GREY_CB}
            placeholder={translate('common.enterAccountNumber')}
            headerStyles={styles.inputTitle}
            inputStyle={commonStyles.input}
            value={refundInfo?.accountNumber}
            error={errors?.accountNumber}
            onChangeText={onChangeAccountNumber}
            isRequired
          />
          <View style={commonStyles.separatorRow16} />
        </>
      );
  }
};

const RequestForm = ({
  user,
  loan,
  propertyPostId,
  projectId,
  onSubmitSuccess,
  defaultSelectValue,
  disabledSelect,
  children,
  typeNotIns,
  isEditable,
  queryLazy,
  requestType = REQUEST_TYPE.NORMAL,
  paymentUnit,
  onChosenTopenLandOffice,
  extRefundInfo,
}) => {
  const navigation = useNavigation();
  const [name, setName] = useState(extractInitialData(isEditable, getUserFullName(user)));
  const [mobile, setMobile] = useState(extractInitialData(isEditable, user.phoneNumber));
  const [email, setEmail] = useState(extractInitialData(isEditable, user.email));
  const [description, setDescription] = useState(EMPTY_STRING);
  const captchaRef = useRef(null);
  const [request, setRequest] = useState();
  const [errors, setErrors] = useState({});
  const [submited, setSubmited] = useState(false);
  const [refundInfo, setRefundInfo] = useState({
    banks: getBankList(extRefundInfo?.banks, null),
    selectedBankId: null,
    selectedCityId: null,
    agree: false,
    bankBranch: '',
    accountName: '',
    accountNumber: '',
  });

  const {notLoggedIn} = useLogin();

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: queryLazy,
    dataField: getDataField(requestType),
    onSuccess: response => {
      if (typeof onSubmitSuccess === 'function') {
        callAfterInteraction(() => {
          onSubmitSuccess({...response, ...request});
        });
      }
    },
    showSpinner: true,
  });
  useEffect(() => {
    if (user.firstName) {
      const fullName = getUserFullName(user);
      setName(fullName);
    }
    if (user.email) {
      setEmail(user.email);
    }
    if (user.phoneNumber) {
      setMobile(user.phoneNumber);
    }
  }, [user]);

  useEffect(() => {
    setErrors({...errors, selectedOffice: ''});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extRefundInfo?.selectedOffice]);

  const onChosenBank = item => {
    setErrors({...errors, selectedBankId: ''});
    setRefundInfo({
      ...refundInfo,
      selectedBankId: item?.bankId,
      banks: getBankList(refundInfo?.banks, item?.bankId),
    });
  };

  const onChosenCity = item => {
    setErrors({...errors, selectedCityId: ''});
    setRefundInfo({...refundInfo, selectedCityId: item?.id});
  };

  const onCheckAgreement = value => {
    setErrors({...errors, agree: ''});
    setRefundInfo({...refundInfo, agree: value});
  };

  const onChangeBankBranch = text => {
    setErrors({...errors, bankBranch: ''});
    setRefundInfo({...refundInfo, bankBranch: text});
  };

  const onChangeAccountName = text => {
    setErrors({...errors, accountName: ''});
    setRefundInfo({...refundInfo, accountName: text});
  };

  const onChangeAccountNumber = text => {
    setErrors({...errors, accountNumber: ''});
    setRefundInfo({...refundInfo, accountNumber: text});
  };

  const onPressCancel = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  const validateForm = () => {
    let errorsObj = {};
    if (requestType === REQUEST_TYPE.REFUND) {
      if (paymentUnit === PaymentUnit.Bidv) {
        errorsObj = {
          selectedBankId: ValidateInput.checkRequiredField(refundInfo?.selectedBankId),
          selectedCityId: ValidateInput.checkRequiredField(refundInfo?.selectedCityId),
          agree: refundInfo?.agree ? '' : ValidateInput.checkRequiredField(''),
          bankBranch: ValidateInput.checkRequiredField(refundInfo?.bankBranch),
          accountName: ValidateInput.checkRequiredField(refundInfo?.accountName),
          accountNumber: ValidateInput.checkRequiredField(refundInfo?.accountNumber),
        };
      } else if (paymentUnit === PaymentUnit.Fast) {
        errorsObj = {
          selectedOffice: ValidateInput.checkRequiredField(
            extRefundInfo?.selectedOffice?.fundAccountId,
          ),
          agree: refundInfo?.agree ? '' : ValidateInput.checkRequiredField(''),
        };
      } else if (paymentUnit === PaymentUnit.Vnpay) {
        errorsObj = {
          agree: refundInfo?.agree ? '' : ValidateInput.checkRequiredField(''),
        };
      }
    } else {
      errorsObj = {
        requestTypeId: ValidateInput.checkRequiredField(request?.id),
        requestName: ValidateInput.checkName(name),
        requestEmail: ValidateInput.checkEmail(email),
        requestMobile: ValidateInput.checkMobilePhone(mobile),
      };
    }
    setErrors(errorsObj);
    for (const [, value] of Object.entries(errorsObj)) {
      if (value) {
        return false;
      }
    }
    return true;
  };

  const submitForm = () => {
    setSubmited(true);
    if (!validateForm()) {
      return;
    }
    captchaRef?.current?.show(getCaptchaSuccess);
  };

  const getCaptchaSuccess = captcha => {
    if (requestType === REQUEST_TYPE.NORMAL) {
      const input = {
        propertyPostId: propertyPostId,
        requesterEmail: email,
        requesterIsUser: !notLoggedIn,
        requesterName: name,
        requesterPhoneNumber: mobile,
        requestTypeId: request?.id,
        tokenCaptcha: captcha,
      };
      if (description) {
        input.requestDescription = description;
      }
      if (projectId) {
        input.projectId = projectId;
      }
      if (propertyPostId) {
        input.propertyPostId = propertyPostId;
      }
      if (defaultSelectValue === CREATE_ACCOUNT_SUPPORT_TYPE) {
        input.propertyPostId = '';
        input.requesterIsUser = false;
      }
      if (defaultSelectValue === CONSULT_BANKLOAN_SUPPORT_TYPE) {
        input.requestData = loan;
      }
      startApi({variables: {input}});
    } else if (requestType === REQUEST_TYPE.REFUND) {
      if (paymentUnit === PaymentUnit.Bidv) {
        startApi({
          variables: {
            input: {
              bankAccountName: refundInfo?.accountName,
              bankAccountNo: refundInfo?.accountNumber,
              bankId: refundInfo?.selectedBankId,
              branchName: refundInfo?.bankBranch,
              cityId: refundInfo?.selectedCityId,
              isBooking: extRefundInfo?.isBooking,
              propertyPostId,
              requestDescription: description,
            },
          },
        });
      } else if (paymentUnit === PaymentUnit.Fast) {
        startApi({
          variables: {
            input: {
              propertyPostId,
              requestDescription: description,
              fundAccountId: extRefundInfo?.selectedOffice?.fundAccountId,
              isBooking: extRefundInfo?.isBooking,
            },
          },
        });
      } else {
        startApi({
          variables: {
            input: {
              propertyPostId,
              requestDescription: description,
              isBooking: extRefundInfo?.isBooking,
            },
          },
        });
      }
    }
  };

  useEffect(() => {
    if (submited) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, name, mobile, email]);
  const onSelectRequest = item => {
    if (item && item.id) {
      setRequest(item);
    }
  };

  const requestInfoBody = getRequestInfoBodyForm({
    requestType,
    setName,
    name,
    setMobile,
    mobile,
    setEmail,
    email,
    errors,
    onSelectRequest,
    isEditable,
    setDescription,
    description,
    disabledSelect,
    defaultSelectValue,
    typeNotIns,
    paymentUnit,
    refundAddress: extRefundInfo?.fundAccount?.branchAddress, // VP thanh toán tiền mặt
  });

  const refundTransactionInfo = getRefundTransactionInfo({
    paymentUnit,
    onChosenTopenLandOffice,
    onChosenBank,
    onChosenCity,
    onChangeBankBranch,
    onChangeAccountName,
    onChangeAccountNumber,
    extRefundInfo,
    refundInfo,
    errors,
  });

  return (
    <Captcha ref={captchaRef}>
      <KeyboardScrollView contentStyle={styles.container}>
        <View style={styles.separatorRow32} />
        {children}
        <View style={styles.separatorRow32} />
        {requestInfoBody}
        {requestType === REQUEST_TYPE.REFUND && (
          <>
            <View style={styles.separatorRow32} />
            {refundTransactionInfo}
          </>
        )}
        <InputSection
          headerTitle={translate(STRINGS.NOTE)}
          placeholder={translate('transaction.transactionNotePlaceHolder')}
          headerStyles={styles.inputTitle}
          inputStyle={styles.textInputNote}
          value={description}
          error={extractError(errors)}
          onChangeText={setDescription}
          multiline
          maxLength={MAX_LENGTH.textArea}
        />
        {requestType === REQUEST_TYPE.REFUND && (
          <>
            <CustomCheckbox
              title={
                extRefundInfo?.isBooking
                  ? translate('transaction.confirmRefundBookingInfo')
                  : translate('transaction.confirmRefundDepositInfo')
              }
              onChange={onCheckAgreement}
            />
            <ErrorText errorText={isEmpty(errors?.agree) ? '' : translate(errors?.agree)} />
          </>
        )}
      </KeyboardScrollView>
      {requestType === REQUEST_TYPE.REFUND && (
        <View style={[commonStyles.footerContainer, {backgroundColor: COLORS.BACKGROUND}]}>
          <CustomFooterButtons
            nextButtonStyle={
              refundInfo?.agree ? commonStyles.enableColorButton : commonStyles.disabledColorButton
            }
            disabledNext={!refundInfo?.agree}
            nextButtonTitle={translate(STRINGS.SEND_REQUEST)}
            onPressNext={submitForm}
            onPressCancel={onPressCancel}
          />
        </View>
      )}
      {requestType !== REQUEST_TYPE.REFUND && (
        <SubmitComponent onPress={submitForm} text={translate(STRINGS.SEND_REQUEST)} />
      )}
    </Captcha>
  );
};

RequestForm.propTypes = {
  propertyPostId: PropTypes.string,
  projectId: PropTypes.string,
  onSubmitSuccess: PropTypes.func,
  postTitle: PropTypes.string,
  image: PropTypes.string,
  customerInfo: PropTypes.object,
  user: PropTypes.object,
  typeNotIns: PropTypes.array,
  defaultSelectValue: PropTypes.string,
  disabledSelect: PropTypes.bool,
  requestType: PropTypes.string,
  paymentUnit: PropTypes.string,
};

RequestForm.defaultProps = {
  onSubmitSuccess: () => {},
  propertyPostId: null,
  projectId: null,
  postTitle: '',
  image: null,
  customerInfo: null,
  user: {},
  typeNotIns: [],
  defaultSelectValue: null,
  disabledSelect: false,
  requestType: REQUEST_TYPE.NORMAL,
  paymentUnit: PaymentUnit.Fast,
};

export default RequestForm;
