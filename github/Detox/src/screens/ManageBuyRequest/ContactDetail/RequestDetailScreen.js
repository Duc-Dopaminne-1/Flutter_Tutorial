import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useReducer, useRef, useState} from 'react';
import {StyleSheet, Text} from 'react-native';

import {useCompleteContactTradingB2CMutation} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {
  APPROVAL_STATUS,
  CONTACT_STATUS_ID,
  CONTACT_TRADING_DEPOSIT_STATUS,
  FETCH_POLICY,
  GLOBAL_ACTIONS,
  HOTLINE_NUMBER_FORMAT,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import BaseScreen from '../../../components/BaseScreen';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import ArrayUtils from '../../../utils/ArrayUtils';
import {
  getPropertyPostApprovalStatusById,
  getPropertyPostApprovalStatusNameById,
} from '../../../utils/GetMasterData';
import {StringeeContext} from '../../Call/StringeeContext';
import {useMount} from '../../commonHooks';
import {useFormatPrice} from '../../Home/useFormatPrice';
import ScreenIds from '../../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import {CONTACT_ACTIONS, CONTACT_FIELD, REQUEST_DETAIL_ACTIONS} from '../DetailRequestConstant';
import {useGetSupportRequestsByContactTradingId} from '../hooks';
import useCheckPropertyPostUpdateContactTradingStatus from '../hooks/useCheckPropertyPostUpdateContactTradingStatus';
import useGetDetailContactTradingB2C from '../hooks/useGetDetailContactTradingB2C';
import useGetDetailContactTradingC2C from '../hooks/useGetDetailContactTradingC2C';
import useUpdateContactTradingConnectC2C from '../hooks/useUpdateContactTradingConnectC2C';
import {ContactTradingContext} from '../useContactTrading';
import ModalsContainer, {
  MODAL_TYPE,
} from './RequestDetailScreenComponents/ModalComps/ModalsContainer';
import SendServiceRequestModalContainer from './RequestDetailScreenComponents/ModalComps/SendServiceRequestModalContainer';
import RequestDetailView from './RequestDetailScreenComponents/RequestDetailView';

const styles = StyleSheet.create({
  baseScreenContainer: {
    ...HELPERS.fill,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

function reducer(state, action) {
  let newState = {...state};
  switch (action.type) {
    case GLOBAL_ACTIONS.SET_ERROR_STATE:
      newState = {...state, errorState: {...action.payload}};
      return newState;
    case REQUEST_DETAIL_ACTIONS.SET_CONTACT_UPDATING_STATE:
      newState = {...state, contactProgress: action.payload};
      return newState;
    case REQUEST_DETAIL_ACTIONS.SET_PENDING_REQUEST_INFO:
      newState = {
        ...state,
        pendingContactRequestInfo: {...state.pendingContactRequestInfo, ...action.payload},
      };
      return newState;
    case GLOBAL_ACTIONS.FIELD:
      newState = {...state, [action.fieldName]: action.payload};
      return newState;
    case REQUEST_DETAIL_ACTIONS.SET_CONTACT_TRADING_INFO:
      newState = {...state, ...action.payload};
      return newState;
    case REQUEST_DETAIL_ACTIONS.SET_NEGOTIATION_REQUEST_INFO:
      newState = {
        ...state,
        negotiationContactRequestInfo: {...state.negotiationContactRequestInfo, ...action.payload},
      };
      return newState;
    default:
      return newState;
  }
}

const initialErrorState = {
  pendingReason: '',
  pendingCompensationAmount: '',
  negotiationPrice: '',
  propertyPostId: '',
  contractPrice: '',
};

const mapRejectReason = (statusId, masterData, isSending) => {
  if (isSending || isEmpty(statusId)) return null;

  if (
    statusId === CONTACT_STATUS_ID.Waiting &&
    ArrayUtils.hasArrayData(masterData?.getContactTradingRejectReasons?.edges)
  ) {
    const data: Array = masterData?.getContactTradingRejectReasons?.edges;
    const result = data.map(item => ({
      id: item?.contactTradingRejectReasonId,
      key: item?.rejectReasonName,
      name: item?.rejectReasonDescription,
      checked: false,
    }));

    result[0].checked = true;
    return {rejectReason: '', rejectReasons: result, rejectReasonId: result[0].id};
  }

  return {rejectReason: '', rejectReasons: [], rejectReasonId: ''};
};

const mapState = (moduleState, masterData, isSending, isB2C) => {
  const stateC2C = isB2C
    ? null
    : {
        negotiationDescription: moduleState?.contactTradingInfo?.negotiationDescription ?? '',
        negotiationPrice: moduleState?.contactTradingInfo?.negotiationPrice ?? 0,
        ...mapRejectReason(
          moduleState?.contactTradingInfo?.contactTradingStatusId,
          masterData,
          isSending,
        ),
      };
  const state = {
    ...moduleState,
    errorState: initialErrorState,
    ...stateC2C,
  };

  return state;
};

const RequestDetailScreen = ({route, navigation}) => {
  const {
    requestId,
    contactTradingCode = '',
    isSending,
    shouldReload,
    isB2C = false,
    onHandler,
  } = route?.params || '';
  const {track} = useAnalytics();
  const {state: moduleState, setFieldToState, resetState} = useContext(ContactTradingContext);
  const {showMessageAlert, getMasterData, showAppModal} = useContext(AppContext);
  const {callUser, chatUser} = useContext(StringeeContext);
  const masterData = getMasterData();
  const {formatPrice} = useFormatPrice();

  const [state, dispatch] = useReducer(
    reducer,
    mapState(moduleState, masterData, isSending, isB2C),
  );
  const [completeNote, setCompleteNote] = useState('');
  const [serviceRequesting, setServiceRequesting] = useState({
    serviceName: '',
    serviceId: '',
  });

  const {getSupportRequestsByCT, requests} = useGetSupportRequestsByContactTradingId();

  const [modalType, setModalType] = useState(null);
  const rejectReasonModalRef = useRef();
  const negotiateModalRef = useRef();
  const rejectCTModalRef = useRef();

  const serviceModalRef = useRef();

  // contact deposit's status
  const depositHasNotAccepted =
    state?.contactTradingInfo?.deposit?.depositStatus !== CONTACT_TRADING_DEPOSIT_STATUS.accepted;
  const depositHasNotSigned =
    state?.contactTradingInfo?.deposit?.depositStatus !== CONTACT_TRADING_DEPOSIT_STATUS.signed;

  // contact's status
  const contactJustCreated =
    state?.contactTradingInfo?.contactTradingStatusId === CONTACT_STATUS_ID.Waiting;
  const contactJustConnected =
    state?.contactTradingInfo?.contactTradingStatusId === CONTACT_STATUS_ID.Connected;
  const contactIsNegotiating =
    state?.contactTradingInfo?.contactTradingStatusId === CONTACT_STATUS_ID.Negotiate;
  const contactIsCompleted =
    state?.contactTradingInfo?.contactTradingStatusId === CONTACT_STATUS_ID.Completed;

  const postStatus = getPropertyPostApprovalStatusById(
    masterData,
    state?.contactTradingInfo?.propertyPostInfo?.propertyPostApprovalStatusId,
  )?.propertyPostApprovalStatusName;

  const postIsNotAvailable =
    postStatus === APPROVAL_STATUS.EXPIRED ||
    postStatus === APPROVAL_STATUS.CLOSE ||
    postStatus === APPROVAL_STATUS.SOLD;

  const showModalContactTrading = type => {
    switch (type) {
      case MODAL_TYPE.NEGOTIATE:
        negotiateModalRef.current?.open();
        break;
      case MODAL_TYPE.REJECT:
        rejectCTModalRef.current?.open();
        break;
      case MODAL_TYPE.REJECT_REASON:
        rejectReasonModalRef.current?.open();
        break;
      default:
        return;
    }
  };

  const showRequestServiceModal = () => {
    serviceModalRef.current.open();
  };

  const closeRequestServiceModal = () => {
    serviceModalRef.current.close();
  };

  const showSendRequestModal = (serviceName, serviceId) => {
    setServiceRequesting({
      serviceName,
      serviceId,
    });
    showRequestServiceModal();
  };

  const {getContactTradingC2C, loading: loadingC2C} = useGetDetailContactTradingC2C(isSending);
  const {getContactTradingB2C, loading: loadingB2C} = useGetDetailContactTradingB2C();

  const {startApi: updateCompleteContactTradingB2C} = useMutationGraphql({
    graphqlApiLazy: useCompleteContactTradingB2CMutation,
    dataField: 'completeContactTradingB2C',
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    showSpinner: true,
  });

  const onDoneUpdateContactTrading = data => {
    if (data) {
      if (data?.errorCode !== 0) {
        showMessageAlert(translate(STRINGS.INFO), data.errorMessage ?? '');
      } else {
        getContactTradingC2C(requestId, true);
      }
    }
  };

  const [connectContactTradingC2C] = useUpdateContactTradingConnectC2C({
    onSuccess: onDoneUpdateContactTrading,
  });

  const onChangeStatusNegotiate = (canEdit = true) => {
    if (isSending && canEdit && (contactJustConnected || contactIsNegotiating)) {
      const data = {
        [CONTACT_FIELD.action]: CONTACT_ACTIONS.EDIT_STATUS,
        negotiationDescription: state?.contactTradingInfo?.negotiationDescription ?? '',
        negotiationPrice: state?.contactTradingInfo?.negotiationPrice ?? '',
      };

      dispatch({type: REQUEST_DETAIL_ACTIONS.SET_CONTACT_TRADING_INFO, payload: data});
    } else {
      dispatch({
        type: GLOBAL_ACTIONS.FIELD,
        fieldName: CONTACT_FIELD.action,
        payload: CONTACT_ACTIONS.VIEW_STATUS,
      });
    }
  };

  const navigateToDepositScreen = (canEdit = false) => {
    const params = {isSending, canEdit};
    navigation.navigate(ScreenIds.TradingDepositDetail, params);
  };

  // use "modal" param in case "modalType" state isn't updated fast enough
  const onUpdateStatusHandler = (isValidPost, modal) => {
    if (!isValidPost && contactJustConnected) {
      return;
    }

    if (modalType || modal) {
      if (modalType === MODAL_TYPE.NEGOTIATE || modal === MODAL_TYPE.NEGOTIATE) {
        onChangeStatusNegotiate(isValidPost && depositHasNotAccepted);
      }
      showModalContactTrading(modalType || modal);
    } else {
      if (contactIsNegotiating && !isValidPost) {
        return;
      }
      navigateToDepositScreen(isValidPost);
    }
  };

  const disableEditStatusAfterCheckedHandler = errorMessage => {
    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: CONTACT_FIELD.action,
      payload: '',
    });
    showAppModal({
      isVisible: true,
      title: translate(STRINGS.INFO),
      message: errorMessage ?? '',
      onOkHandler: () => {
        onUpdateStatusHandler(false);
      },
    });
  };

  const onCheckedPropertyPost = (data, isValidPost) => {
    if (!isValidPost) {
      disableEditStatusAfterCheckedHandler(data?.errorMessage);
    } else {
      onUpdateStatusHandler(isValidPost);
    }
  };

  const onErrorCheckedProperty = err => {
    disableEditStatusAfterCheckedHandler(err?.errorMessage);
  };

  const [checkPostAndEditContactStatus] = useCheckPropertyPostUpdateContactTradingStatus({
    onSuccess: onCheckedPropertyPost,
    onError: onErrorCheckedProperty,
  });

  const handleOnUpdatedContactRequestStatus = () => {
    shouldReload?.isTrue &&
      getContactTradingC2C(requestId ?? state.contactTradingInfo?.contactTradingId, true);
  };
  useEffect(handleOnUpdatedContactRequestStatus, [shouldReload]);

  const showConfirmConnect = data => {
    showAppModal({
      isVisible: true,
      title: translate(STRINGS.NOTIFICATION),
      message: translate('contactTrading.agreementConnectMessage'),
      cancelText: translate(STRINGS.CANCEL),
      okText: translate('common.approve'),
      onOkHandler: () => {
        connectContactTradingC2C(data);
      },
    });
  };

  const showErrorCanNotProceed = () => {
    showAppModal({
      isVisible: true,
      message: translate('contactTrading.postIsNotAvailableForTrading'),
    });
  };

  const onPressRightButton = () => {
    if (postIsNotAvailable) {
      showErrorCanNotProceed();
      return;
    }

    if (contactJustCreated) {
      const connectData = {
        contactTradingId: state?.contactTradingInfo?.contactTradingId,
        recordVersion: state?.contactTradingInfo?.recordVersion,
      };

      showConfirmConnect(connectData);
      return;
    }
    setModalType(null);
    checkPostAndEditContactStatus(state?.contactTradingInfo?.propertyPostId);
  };

  const onPressLeftButton = () => {
    if (postIsNotAvailable) {
      showErrorCanNotProceed();
      return;
    }
    switch (state?.contactTradingInfo?.contactTradingStatusId) {
      case CONTACT_STATUS_ID.Waiting:
        setModalType(MODAL_TYPE.REJECT);
        showModalContactTrading(MODAL_TYPE.REJECT);
        break;
      case CONTACT_STATUS_ID.Connected:
        setModalType(MODAL_TYPE.NEGOTIATE);
        checkPostAndEditContactStatus(state?.contactTradingInfo?.propertyPostId);
        break;
      case CONTACT_STATUS_ID.Negotiate:
        setModalType(null);
        checkPostAndEditContactStatus(state?.contactTradingInfo?.propertyPostId);
        break;
    }
  };

  const handleOnDoneUpdateCT = modal => {
    if (modal === MODAL_TYPE.REJECT) {
      rejectCTModalRef.current?.close();
    } else if (modal === MODAL_TYPE.NEGOTIATE) {
      negotiateModalRef.current?.close();
    }

    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: CONTACT_FIELD.action,
      payload: '',
    });
  };

  const onPressCallStringee = (phoneNumber, fullName, avatar, isFO = false, isChat = false) => {
    if (isChat) {
      chatUser(phoneNumber, fullName, navigation, isFO);
    } else {
      callUser(
        phoneNumber,
        {
          fullName,
          avatar,
          objectType: `fo-contact-trading-${isB2C ? 'b2c' : 'c2c'}-${
            isSending ? 'sent' : 'received'
          }`,
          objectId: moduleState?.contactTradingInfo?.contactTradingId,
        },
        isFO,
      );
    }
  };

  const onCompleteRequest = () => {
    updateCompleteContactTradingB2C(
      {
        variables: {
          input: {
            contactTradingB2CId: requestId,
            note: completeNote,
          },
        },
      },
      () => {
        navigation.goBack();
      },
    );
  };

  const onChangeNote = text => {
    setCompleteNote(text);
  };

  const onViewNegotiateDetail = () => {
    setModalType(MODAL_TYPE.NEGOTIATE);
    const canEditNegotiateInfo =
      isSending && depositHasNotAccepted && (contactJustConnected || contactIsNegotiating);
    if (canEditNegotiateInfo) {
      if (postIsNotAvailable) {
        showErrorCanNotProceed();
        return;
      }

      checkPostAndEditContactStatus(moduleState.contactTradingInfo?.propertyPostId);
    } else {
      onUpdateStatusHandler(false, MODAL_TYPE.NEGOTIATE);
    }
  };

  const onViewDepositDetail = () => {
    setModalType(null);
    const canEditDepositInfo =
      isSending && depositHasNotAccepted && depositHasNotSigned && !contactIsCompleted;
    if (canEditDepositInfo) {
      if (postIsNotAvailable) {
        showErrorCanNotProceed();
        return;
      }

      checkPostAndEditContactStatus(moduleState?.contactTradingInfo?.propertyPostId);
    } else {
      navigateToDepositScreen(canEditDepositInfo);
    }
  };

  const onViewCompleteDetail = () => {
    navigation.navigate(ScreenIds.TradingCompleteDetail);
  };

  const onViewRejectReasonDetail = () => {
    setModalType(MODAL_TYPE.REJECT_REASON);
    showModalContactTrading(MODAL_TYPE.REJECT_REASON);
  };

  const onRefresh = () => {
    if (isB2C) {
      getContactTradingB2C({variables: {contactTradingB2CId: requestId}});
    } else {
      const currentRequestId = requestId || state?.contactTradingInfo?.contactTradingId;
      getContactTradingC2C(currentRequestId, true);
      getSupportRequestsByCT(currentRequestId);
    }
  };

  const onPressBack = () => {
    resetState && resetState();
    if (!isB2C) {
      // refresh list contact trading
      onHandler && onHandler();
    }
    navigation.canGoBack() && navigation.goBack();
  };

  const onSentSupportRequest = () => {
    closeRequestServiceModal();
    onRefresh();
  };

  const onPressCall = role => {
    track(TrackingActions.callButtonClicked, {
      click_location: ClickLocation.buyRequestPage,
      category: isSending ? Category.send : Category.received,
      contact_person: role,
    });
  };

  const onPressChat = role => {
    track(TrackingActions.messagesButtonClicked, {
      click_location: ClickLocation.buyRequestPage,
      category: isSending ? Category.send : Category.received,
      contact_person: role,
    });
  };

  const onPressProperty = () => {
    const {propertyPostInfo} = state.contactTradingInfo ?? {};
    const postStatusName = getPropertyPostApprovalStatusNameById(
      masterData,
      propertyPostInfo?.propertyPostApprovalStatusId,
    );

    if (postStatusName === APPROVAL_STATUS.APPROVAL) {
      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: propertyPostInfo?.propertyPostId,
        viewByOtherMode: isSending,
      });
    } else {
      showAppModal({
        isVisible: true,
        firstLineMessage: (
          <Text style={styles.postContentMessage}>
            {translate('supportRequest.message.postContentApproval')}
          </Text>
        ),
        message: translate('supportRequest.message.postContentApprovalDescription'),
        hotlineNumber: HOTLINE_NUMBER_FORMAT,
      });
    }
  };

  const onPressAgentAvatar = userId => {
    if (!isEmpty(userId)) {
      navigation.navigate(ScreenIds.AgentManagement, {agentId: userId});
    }
  };

  useMount(() => {
    setFieldToState({masterData: masterData, isSending: isSending});
    if (isB2C) {
      getContactTradingB2C({variables: {contactTradingB2CId: requestId}});
    } else {
      getContactTradingC2C(requestId, false);
      getSupportRequestsByCT(requestId);
    }
  });

  useEffect(() => {
    dispatch({
      type: REQUEST_DETAIL_ACTIONS.SET_CONTACT_TRADING_INFO,
      payload: mapState(moduleState, masterData, isSending, isB2C),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleState]);

  const modals = (
    <>
      <ModalsContainer
        modalType={modalType}
        state={state}
        dispatch={dispatch}
        negotiateModalRef={negotiateModalRef}
        rejectCTModalRef={rejectCTModalRef}
        rejectReasonModalRef={rejectReasonModalRef}
        handleOnDoneUpdate={handleOnDoneUpdateCT}
        callStringee={onPressCallStringee}
        requestId={requestId}
        isSending={isSending}
      />
      <ModalWithModalize getModalRef={serviceModalRef} handlePosition="outside">
        <SendServiceRequestModalContainer
          contactTradingId={requestId}
          serviceName={serviceRequesting.serviceName}
          serviceId={serviceRequesting.serviceId}
          onPressCancel={closeRequestServiceModal}
          onSentRequest={onSentSupportRequest}
        />
      </ModalWithModalize>
    </>
  );

  return RequestDetailContainer(
    isB2C,
    state,
    contactTradingCode,
    onPressBack,
    modals,
    loadingB2C,
    loadingC2C,
    requests,
    isSending,
    postIsNotAvailable,
    onCompleteRequest,
    onChangeNote,
    onPressCallStringee,
    formatPrice,
    navigation,
    showSendRequestModal,
    onViewNegotiateDetail,
    onViewDepositDetail,
    onViewCompleteDetail,
    onPressRightButton,
    onPressLeftButton,
    onViewRejectReasonDetail,
    onRefresh,
    onPressCall,
    onPressChat,
    onPressProperty,
    onPressAgentAvatar,
  );
};

export default RequestDetailScreen;

const RequestDetailContainer = (
  isB2C,
  state,
  contactTradingCode,
  onPressBack,
  modals,
  loadingB2C,
  loadingC2C,
  requests,
  isSending,
  postIsNotAvailable,
  onCompleteRequest,
  onChangeNote,
  onPressCallStringee,
  formatPrice,
  navigation,
  showSendRequestModal,
  onViewNegotiateDetail,
  onViewDepositDetail,
  onViewCompleteDetail,
  onPressRightButton,
  onPressLeftButton,
  onViewRejectReasonDetail,
  onRefresh,
  onPressCall,
  onPressChat,
  onPressProperty,
  onPressAgentAvatar,
) => {
  return (
    <BaseScreen
      title={
        isB2C
          ? translate(STRINGS.REQUEST_DETAIL)
          : state?.contactTradingInfo?.contactTradingCode ?? contactTradingCode
      }
      testID={ScreenIds.RequestDetail}
      containerStyle={styles.baseScreenContainer}
      onBackPress={onPressBack}
      modals={modals}
      showHeaderShadow>
      <RequestDetailView
        isB2C={isB2C}
        loading={isB2C ? loadingB2C : loadingC2C}
        state={state}
        supportRequests={requests}
        isSending={isSending}
        postIsNotAvailable={postIsNotAvailable}
        onCompleteRequest={onCompleteRequest}
        onChangeNote={onChangeNote}
        onPressCallStringee={onPressCallStringee}
        formatPrice={formatPrice}
        navigation={navigation}
        onPressSendServiceRequest={showSendRequestModal}
        onPressNegotiation={onViewNegotiateDetail}
        onPressDeposit={onViewDepositDetail}
        onPressComplete={onViewCompleteDetail}
        onPressRightButton={onPressRightButton}
        onPressLeftButton={onPressLeftButton}
        onPressRejectReason={onViewRejectReasonDetail}
        onRefreshGetDetail={onRefresh}
        onPressCallCallback={onPressCall}
        onPressChatCallback={onPressChat}
        onPressProperty={onPressProperty}
        onPressAgentAvatar={onPressAgentAvatar}
      />
    </BaseScreen>
  );
};
