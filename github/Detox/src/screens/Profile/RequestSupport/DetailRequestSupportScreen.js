import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {
  TransactionType,
  useChangeStateOfServiceTicketForFrontOfficeMutation,
  useGetsupportServiceTicketCancelReasonsLazyQuery,
  useGetsupportServiceTicketRejectReasonsLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {getUserId} from '../../../appData/user/selectors';
import {
  APPROVAL_STATUS,
  HOTLINE_NUMBER_FORMAT,
  SUPPORT_SERVICE_STATUS,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import {useModalize} from '../../../components/Modal/ModalWithModalize';
import {RequestSupportContext} from '../../../hooks/useRequestSupport';
import {getImageBySizeFromServer, IMAGE_SIZES} from '../../../utils/ImageUtil';
import {getPriceWithCurrency} from '../../../utils/RenderUtil';
import {getTransactionDateTimeString} from '../../../utils/TimerCommon';
import AgentInfomation from '../../ManagePost/ReviewPropertyPost/AgentInfomation';
import ScreenIds from '../../ScreenIds';
import PopupPropertyPostItem from '../../Search/SearchMap/MapComponents/PopupPropertyPostItem';
import {BottomView} from './Components/BottomView';
import ModalCancelRequest from './Components/ModalCancelRequest';
import RefundPopup from './Components/RefundPopup';
import {StatusMessageRequest} from './Components/StatusMessageRequest';
import useGetDetailSupportServices from './hooks/useGetDetailSupportServices';
import StepIndicator from './StepIndicator';
import {styleStepIndicator} from './styles';

const mapDataToAgentInfo = requester => {
  return {
    sellerId: requester?.userId,
    fullName: requester?.fullName,
    avatar: requester?.profilePhotos
      ? getImageBySizeFromServer(requester?.profilePhotos, IMAGE_SIZES.LARGE)
      : requester.avatar,
    phoneNumber: requester?.phoneNumber,
    isAgent: true,
    agentRating: requester?.agentRating || 0,
  };
};

const initStateCancelRequest = {
  reasonId: null,
  reasonNote: '',
};

const DetailRequestSupportScreen = ({route, navigation}) => {
  const {showAppModal, getMasterData} = useContext(AppContext);
  const userId = useSelector(getUserId);
  const {state, setTicketInfo} = useContext(RequestSupportContext);
  const {ticketId} = route?.params;
  const modalCancelRequest = useRef(null);
  const masterData = getMasterData();
  const [labels, setLabels] = useState(false);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  const modalRefund = useRef(null);

  const {openModal: openRefundModal} = useModalize(modalRefund);

  const {
    ticketCode = '',
    supportServiceName = '',
    ticketNote = '',
    appointmentDatetime = ' ',
    nextStates = [],
    propertyPostId,
    supportServiceTicketResult,
    supportServiceTicketProcessings = [],
    updatedDatetime,
    requester = {},
    currentAllStates = [],
    ticketStatusId = '',
    currentExecutor = {},
    transactionType,
    currentExecutorId,
    requesterId,
    supportServiceId,
    ticketPaymentStatusId,
  } = state?.ticketInfo ?? {};

  const isRequest = userId === requesterId;
  const {getDetailTicket, transactionDetail} = useGetDetailSupportServices({
    ticketId,
    propertyPostId,
    transactionType,
    TransactionType,
    onSuccess: data => {
      if (data) {
        setTicketInfo(data?.supportServiceTicket);
      }
    },
  });

  const onPressStartSupportRequest = () => {
    showAppModal({
      isVisible: true,
      title: translate('supportRequest.detail.beginToExecute'),
      message: translate('supportRequest.detail.beginToExecuteConfirmation'),
      cancelText: translate(STRINGS.CLOSE),
      okText: translate(STRINGS.AGREE),
      onOkHandler: () => onOkHandler(SUPPORT_SERVICE_STATUS.Processing),
    });
  };

  const {startApi: changeStateTicketDetail} = useMutationGraphql({
    graphqlApiLazy: useChangeStateOfServiceTicketForFrontOfficeMutation,
  });

  const queryModalReject = isRequest
    ? {
        query: useGetsupportServiceTicketCancelReasonsLazyQuery,
        dataField: 'supportServiceTicketCancelReasons',
        dataKey: {
          id: 'supportServiceTicketCancelReasonId',
          description: 'supportServiceTicketCancelReasonDescription',
        },
      }
    : {
        query: useGetsupportServiceTicketRejectReasonsLazyQuery,
        dataField: 'supportServiceTicketRejectReasons',
        dataKey: {
          id: 'supportServiceTicketRejectReasonId',
          description: 'supportServiceTicketRejectReasonDescription',
        },
      };

  const mapCurrentStateToStep = () => {
    const nodes = [];
    currentAllStates.map(item2 => {
      masterData?.supportServiceTicketStatuses?.edges.map(item => {
        if (item.supportServiceTicketStatusId === item2) {
          nodes.push(item.supportServiceTicketStatusDescription);
        }
      });
    });

    const index = currentAllStates.findIndex(item => item === ticketStatusId);
    setCurrentStateIndex(index);
    setLabels(nodes);
  };

  useEffect(() => {
    if (!isEmpty(currentAllStates)) {
      mapCurrentStateToStep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAllStates]);

  const onOkHandler = nextStateId => {
    changeStateTicketDetail(
      {
        variables: {
          input: {
            supportServiceTicketId: ticketId,
            nextStateId: nextStateId,
            reasonId: '',
            reasonNote: '',
          },
        },
      },
      () => {
        getDetailTicket();
      },
    );
  };

  const onPressAccept = () => {
    showAppModal({
      isVisible: true,
      title: translate(STRINGS.AGREE),
      message: translate('supportRequest.confirmRequest'),
      cancelText: translate(STRINGS.CLOSE),
      okText: translate(STRINGS.AGREE),
      onOkHandler: () => onOkHandler(SUPPORT_SERVICE_STATUS.Confirm),
    });
  };

  const onPressReject = () => {
    modalCancelRequest?.current?.open();
  };

  const RowItem = ({label, value, valueStyle}) => {
    return (
      <View style={rowStyles.row}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={[rowStyles.value, valueStyle]}>{value ?? '--'}</Text>
      </View>
    );
  };

  React.useEffect(() => {
    getDetailTicket();
    const willFocusSubscription = navigation.addListener('focus', () => {
      getDetailTicket();
    });

    return willFocusSubscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApplyCancelTicket = data => {
    changeStateTicketDetail(
      {
        variables: {
          input: {
            nextStateId: SUPPORT_SERVICE_STATUS.Cancelled,
            reasonId: data?.reasonId,
            reasonNote: data?.reasonNote,
            supportServiceTicketId: ticketId,
          },
        },
      },
      () => {
        modalCancelRequest?.current?.close();
        getDetailTicket();
      },
    );
  };

  const requestInfo = mapDataToAgentInfo(isRequest ? currentExecutor : requester);

  const ProcessingView = () => {
    return (
      <View style={{padding: normal, backgroundColor: COLORS.NEUTRAL_WHITE}}>
        <Text style={rowStyles.section}>{translate('supportRequest.detail.progress')}</Text>
        {supportServiceTicketProcessings.map(item => (
          <View key={item.updatedDatetime} style={styles.processingView}>
            <Text style={styles.processingRow}>
              {moment(item.updatedDatetime).format('HH:mm DD/MM/YYYY')}
            </Text>
            <Text style={[HELPERS.fill, HELPERS.textRight]}>
              {item?.ticketProcessingStatusName}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const onPressPostPopup = item => {
    const postStatusName = item?.propertyPostApprovalStatusName;
    if (postStatusName === APPROVAL_STATUS.SOLD || postStatusName === APPROVAL_STATUS.APPROVAL) {
      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: item.propertyPostId ?? '',
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

  const checkShowFullAddress =
    isRequest || ticketStatusId !== SUPPORT_SERVICE_STATUS.New ? true : false;

  const modals = [
    <RefundPopup
      key={1}
      ref={modalRefund}
      onRefundSuccess={() => getDetailTicket()}
      supportServiceName={supportServiceName}
      supportServicePrice={transactionDetail?.expectedAmount}
      paymentMethod={transactionDetail?.paymentUnit}
      refundAmount={transactionDetail?.paidAmount}
      paymentCode={transactionDetail?.paymentTransferNumber}
      executorId={currentExecutorId}
      ticketId={ticketId}
      userId={requesterId}
      supportTypeId={supportServiceId}
      propertyPostId={propertyPostId}
    />,
    <ModalCancelRequest
      key={2}
      onApply={onApplyCancelTicket}
      initState={initStateCancelRequest}
      ref={modalCancelRequest}
      queryOptions={queryModalReject}
    />,
  ];

  return (
    <BaseScreen title={translate('supportRequest.detail.title')} modals={modals}>
      <ScrollView>
        {labels && (
          <StepIndicator
            stepCount={labels.length}
            customStyles={styleStepIndicator}
            currentPosition={currentStateIndex}
            labels={labels}
          />
        )}
        <StatusMessageRequest
          isRequest={isRequest}
          updatedDatetime={updatedDatetime}
          ticketPaymentStatusId={ticketPaymentStatusId}
          masterData={masterData}
          supportServiceTicketResult={supportServiceTicketResult}
          supportTicketProcessings={supportServiceTicketProcessings}
        />
        <View style={{padding: normal, backgroundColor: COLORS.NEUTRAL_WHITE}}>
          <Text style={rowStyles.section}>{translate('supportRequest.detail.requestInfo')}</Text>
          <RowItem
            label={`${translate('supportRequest.detail.requestCode')}:`}
            value={ticketCode}
          />
          <RowItem
            label={`${translate('supportRequest.detail.requestType')}:`}
            value={supportServiceName}
          />
          <RowItem
            label={`${translate('supportRequest.detail.requestTime')}:`}
            value={getTransactionDateTimeString(appointmentDatetime)}
          />
          <RowItem label={`${translate('supportRequest.detail.requestNote')}:`} value={''} />
          <Text>{ticketNote}</Text>
        </View>

        <ProcessingView />

        <View style={{padding: normal, backgroundColor: COLORS.NEUTRAL_WHITE}}>
          <Text style={rowStyles.section}>{translate('supportRequest.detail.paymentInfo')}</Text>
          <RowItem
            label={`${translate('supportRequest.detail.paymentFee')}:`}
            value={getPriceWithCurrency(transactionDetail?.expectedAmount)}
          />
          <RowItem
            label={'Đã thanh toán:'}
            value={getPriceWithCurrency(transactionDetail?.paidAmount)}
          />
          <RowItem
            label={`${translate('supportRequest.detail.deficit')}:`}
            value={getPriceWithCurrency(
              transactionDetail?.expectedAmount - transactionDetail?.paidAmount,
            )}
          />
          <RowItem
            label={translate('supportRequest.detail.paymentType')}
            value={transactionDetail?.paymentUnit}
          />
        </View>

        <View style={{padding: normal, backgroundColor: COLORS.NEUTRAL_WHITE}}>
          <Text style={rowStyles.section}>
            {isRequest
              ? translate('supportRequest.executor')
              : translate('supportRequest.requester')}
          </Text>
          <AgentInfomation
            viewOwner={true}
            navigation={navigation}
            state={requestInfo}
            showContactButtons={true}
          />
        </View>
        <View style={{padding: normal, backgroundColor: COLORS.NEUTRAL_WHITE}}>
          <Text style={rowStyles.section}>{translate('supportRequest.supportPost')}</Text>
          {propertyPostId && (
            <PopupPropertyPostItem
              isCreateUser={checkShowFullAddress}
              propertyPostId={propertyPostId}
              onPress={onPressPostPopup}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <BottomView
          nextState={nextStates}
          ticketPaymentStatusId={ticketPaymentStatusId}
          isRequest={isRequest}
          masterData={masterData}
          ticketStatusId={ticketStatusId}
          currentExecutorId={currentExecutorId}
          ticketId={ticketId}
          onPressStartSupportRequest={onPressStartSupportRequest}
          propertyPostId={propertyPostId}
          supportServiceId={supportServiceId}
          navigation={navigation}
          supportServiceTicketResult={supportServiceTicketResult}
          supportServiceTicketProcessings={supportServiceTicketProcessings}
          openRefundModal={openRefundModal}
          onPressAccept={onPressAccept}
          onPressReject={onPressReject}
        />
      </View>
    </BaseScreen>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: small,
  },
  label: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
    marginRight: small,
  },
  value: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    textAlign: 'right',
    flex: 1,
    maxWidth: '70%',
  },
  section: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.BLACK_31,
    marginBottom: small,
  },
});

const styles = StyleSheet.create({
  bottomView: {flexDirection: 'row', paddingRight: normal},
  processingView: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 12},
  processingRow: {color: COLORS.GRAY_A3, flex: 1},
  postContentMessage: {...FONTS.bold},
});

export default DetailRequestSupportScreen;
