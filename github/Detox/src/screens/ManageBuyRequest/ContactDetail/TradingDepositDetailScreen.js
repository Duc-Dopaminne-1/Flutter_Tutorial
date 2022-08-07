import isEmpty from 'lodash/isEmpty';
import React, {useContext, useReducer, useRef, useState} from 'react';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {
  APPROVAL_STATUS,
  CommissionCurrencyUnit,
  CONSTANTS,
  CONTACT_STATUS_ID,
  GLOBAL_ACTIONS,
  PAYMENT_METHODS,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import ArrayUtils from '../../../utils/ArrayUtils';
import {getPropertyPostApprovalStatusById} from '../../../utils/GetMasterData';
import ValidateInput from '../../../utils/ValidateInput';
import ValidateInputMessage from '../../../utils/ValidateInputMessage';
import ScreenIds from '../../ScreenIds';
import {DEPOSIT_INPUTS, DEPOSIT_INPUTS2} from '../DetailRequestConstant';
import useUpdateContactTradingAcceptedDepositC2C from '../hooks/useUpdateContactTradingAcceptedDepositC2C';
import UpdateContactTradingDepositStatusById from '../hooks/useUpdateContactTradingDepositStatusById';
import {ContactTradingContext} from '../useContactTrading';
import ModalsContainer, {
  MODAL_TYPE,
} from './RequestDetailScreenComponents/ModalComps/ModalsContainer';
import TradingDepositDetailContainer from './TradingDepositDetailInputComponents/TradingDepositDetailContainer';

export const TradingDepositAction = {
  UPDATE_DEPOSIT_INFO: 'UPDATE_DEPOSIT_INFO',
  VALIDATE: 'VALIDATE',
  SET_CONTACT_TRADING_INFO: 'SET_CONTACT_TRADING_INFO',
  SET_ERROR: 'SET_ERROR',
  SET_AGREEMENT_STATUS: 'SET_AGREEMENT_STATUS',
};

function validateState(state) {
  const {
    bankName,
    paymentMethodId,
    paymentProgressDtos,
    depositPaymentTermFrom,
    depositPaymentTermTo,
    commission,
    commissionUnitId,
    depositTerm,
    notaryOffice,
    notarizationDatetime,
    closingPrice,
    depositedAmount,
  } = state?.deposit ?? {};

  const isPayCash = paymentMethodId === PAYMENT_METHODS.cash.id;
  const isCommissionPercentage = commissionUnitId === CommissionCurrencyUnit.PERCENTAGE;

  const bankNameError = isPayCash
    ? ''
    : {
        ...ValidateInput.validateRequiredField(DEPOSIT_INPUTS.bankName, bankName?.toString()),
      };

  const depositPaymentProgressError = paymentProgressDtos?.map(e => {
    const validPaymentDatetime =
      e.paymentDatetime >= depositPaymentTermFrom && e.paymentDatetime <= depositPaymentTermTo;

    return {
      paymentDatetime:
        ValidateInput.checkRequiredField(e.paymentDatetime) || validPaymentDatetime
          ? ''
          : Message.CCT_MSG_010,
      amount:
        e.remainingPayAmount < 0
          ? Message.CCT_MSG_008
          : ValidateInput.checkIntNumber(e.amount, false),
    };
  });

  const validDepositAmount =
    paymentProgressDtos?.length > 0
      ? paymentProgressDtos[paymentProgressDtos.length - 1].remainingPayAmount <= 0
      : false;

  const commissionToAmount = isCommissionPercentage
    ? (commission * closingPrice) / 100
    : commission;

  const validatedCommission = ValidateInputMessage.checkRequiredMinPrice(
    commissionToAmount,
    20 * CONSTANTS.MILLION,
    commission,
    1,
  );

  const depositError = {
    commission: validatedCommission,
    ...ValidateInput.validateIntNumber(DEPOSIT_INPUTS.depositTerm, depositTerm?.toString()),
    depositedDate:
      ValidateInput.checkRequiredField(depositPaymentTermFrom?.toString()) ||
      ValidateInput.checkRequiredField(depositPaymentTermTo?.toString()),
    ...ValidateInput.validateRequiredField(DEPOSIT_INPUTS2.notaryOffice, notaryOffice?.toString()),
    ...ValidateInput.validateRequiredField(
      DEPOSIT_INPUTS2.notarizationDatetime,
      notarizationDatetime?.toString(),
    ),
    ...ValidateInput.validateRequiredFloatNumberField(
      DEPOSIT_INPUTS.closingPrice,
      closingPrice?.toString(),
      false,
    ),
    ...ValidateInput.validateRequiredFloatNumberField(
      DEPOSIT_INPUTS.depositedAmount,
      depositedAmount?.toString(),
      false,
    ),
    ...bankNameError,
  };

  const errors = {
    ...depositError,
  };

  const isValidPaymentProgress = depositPaymentProgressError?.map(e => {
    const isValidProgress = !Object.values(e).some(error => error !== '');
    return isValidProgress;
  });

  const isValid =
    !Object.values(errors).some(item => item !== '') &&
    !isValidPaymentProgress?.some(e => e === false) &&
    validDepositAmount;

  return {
    ...errors,
    isValid,
    paymentProgressDtos: depositPaymentProgressError,
    validDepositAmount,
  };
}

const initialErrorState = {
  depositedDate: '',
  commission: '',
  closingPrice: '',
  depositAmount: '',
  depositTerm: '',
  bankName: '',
  recipientName: '',
  recipientPhoneNumber: '',
  recipientIdentityCard: '',
  depositorName: '',
  depositorPhoneNumber: '',
  depositorIdentityCard: '',
  paymentProgressDtos: [],
};

const mapRejectReason = (statusId, masterData, isSending) => {
  if (isSending || isEmpty(statusId)) return null;
  if (
    statusId === CONTACT_STATUS_ID.Deposited &&
    ArrayUtils.hasArrayData(masterData?.getC2CDepositRejectReasons?.edges)
  ) {
    const data: Array = masterData?.getC2CDepositRejectReasons?.edges;
    const result = data.map(item => ({
      id: item?.c2CDepositRejectReasonId,
      key: item?.rejectReasonName,
      name: item?.rejectReasonDescription,
      checked: false,
    }));

    result[0].checked = true;
    return {
      rejectReason: '',
      rejectReasons: result,
      rejectReasonId: result[0].id,
    };
  }

  return {rejectReason: '', rejectReasons: [], rejectReasonId: ''};
};

const reducer = (state, action) => {
  switch (action.type) {
    case GLOBAL_ACTIONS.FIELD:
      return {...state, [action?.fieldName]: action.payload};
    case TradingDepositAction.SET_CONTACT_TRADING_INFO:
      return {...state, ...action.payload};
    case TradingDepositAction.UPDATE_DEPOSIT_INFO:
      const newState = {
        ...state,
        deposit: {
          ...state?.deposit,
          ...action.payload,
        },
      };
      const errors = validateState(newState);

      return {...newState, errorState: errors};
    case TradingDepositAction.SET_AGREEMENT_STATUS:
      return {...state, isAgree: action.payload};
    case TradingDepositAction.SET_ERROR:
      return {...state, errorState: action.payload};
    default:
      return state;
  }
};

const TradingDepositDetailScreen = ({navigation, route}) => {
  const {canEdit = false, isSending} = route.params ?? {};
  const {state: contactTradingDetail} = useContext(ContactTradingContext);
  const {showAppModal, getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const rejectDepositCTModalRef = useRef();

  const [showError, setShowError] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    ...contactTradingDetail,
    deposit: contactTradingDetail?.contactTradingInfo?.deposit,
    errorState: initialErrorState,
    canEdit: canEdit && isSending,
    isAgree: false,
    ...mapRejectReason(
      contactTradingDetail?.contactTradingInfo?.contactTradingStatusId,
      masterData,
      isSending,
    ),
  });

  const postStatus = getPropertyPostApprovalStatusById(
    masterData,
    state?.contactTradingInfo?.propertyPostInfo?.propertyPostApprovalStatusId,
  )?.propertyPostApprovalStatusName;

  const postIsNotAvailable =
    postStatus === APPROVAL_STATUS.EXPIRED ||
    postStatus === APPROVAL_STATUS.CLOSE ||
    postStatus === APPROVAL_STATUS.SOLD;

  const onSuccessUpdateContactTrading = data => {
    if (data && data.errorCode === 0) {
      showAppModal({
        isVisible: true,
        message: translate(STRINGS.UPDATE_STATUS_SUCCESSFULLY),
        onOkHandler: () => {
          navigation.navigate(ScreenIds.RequestDetail, {
            shouldReload: {isTrue: true},
            isSending,
          });
        },
      });
    }
  };

  const [startUpdateContactTradingDepositStatusById] = UpdateContactTradingDepositStatusById(
    onSuccessUpdateContactTrading,
  );

  const [acceptedDepositContactTradingC2C] = useUpdateContactTradingAcceptedDepositC2C({
    onSuccess: onSuccessUpdateContactTrading,
  });

  const validateInfo = newState => {
    const validationState = validateState(newState ?? state);
    return validationState;
  };

  const confirmAgreement = data => {
    const connectData = {
      contactTradingId: data?.contactTradingId,
      recordVersion: data?.recordVersion,
    };
    showAppModal({
      isVisible: true,
      title: translate(STRINGS.NOTIFICATION),
      message: translate('contactTrading.agreementConnectMessage'),
      cancelText: translate(STRINGS.CANCEL),
      okText: translate('common.approve'),
      onOkHandler: () => {
        acceptedDepositContactTradingC2C(connectData);
      },
    });
  };

  const showErrorCanNotProceed = () => {
    showAppModal({
      isVisible: true,
      message: translate('contactTrading.postIsNotAvailableForTrading'),
    });
  };

  const onPressNextFooterButton = () => {
    if (postIsNotAvailable) {
      showErrorCanNotProceed();
      return;
    }

    if (!isSending) {
      confirmAgreement(contactTradingDetail?.contactTradingInfo);
      return;
    }

    setShowError(true);
    const stateValidation = validateInfo();
    dispatch({type: TradingDepositAction.SET_ERROR, payload: stateValidation});

    if (!stateValidation.validDepositAmount) {
      showAppModal({
        isVisible: true,
        message: translate(Message.CCT_MSG_009),
      });
      return;
    }

    if (stateValidation.isValid) {
      const updateContactDepositStatusInput = {
        ...state.deposit,
        contactType: contactTradingDetail.contactTradingInfo?.contactType,
        recordVersion: contactTradingDetail.contactTradingInfo?.recordVersion,
      };
      startUpdateContactTradingDepositStatusById(
        contactTradingDetail.contactTradingInfo?.contactTradingId,
        updateContactDepositStatusInput,
        contactTradingDetail.contactTradingInfo?.deposit,
      );
    }
  };

  const onPressCancelFooterButton = () => {
    if (!isSending) {
      if (postIsNotAvailable) {
        showErrorCanNotProceed();
        return;
      }

      if (
        contactTradingDetail?.contactTradingInfo?.contactTradingStatusId ===
        CONTACT_STATUS_ID.Deposited
      ) {
        rejectDepositCTModalRef.current?.open();
      }
      return;
    }

    navigation.goBack();
  };

  const modals = (
    <>
      <ModalsContainer
        modalType={MODAL_TYPE.REJECT_DEPOSIT}
        state={state}
        dispatch={dispatch}
        rejectDepositCTModalRef={rejectDepositCTModalRef}
        handleOnDoneUpdate={onSuccessUpdateContactTrading}
        requestId={state?.contactTradingInfo?.contactTradingId}
        isSending={isSending}
      />
    </>
  );

  return (
    <BaseScreen
      title={translate(STRINGS.DEPOSITE_FIRST_TIME)}
      onBackPress={() => navigation.goBack()}
      modals={modals}
      showHeaderShadow>
      <TradingDepositDetailContainer
        isSending={isSending}
        state={state}
        dispatch={dispatch}
        errorState={showError ? state.errorState : initialErrorState}
        onPressCancelFooterButton={onPressCancelFooterButton}
        onPressNextFooterButton={onPressNextFooterButton}
      />
    </BaseScreen>
  );
};

export default TradingDepositDetailScreen;
