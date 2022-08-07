import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {
  SUPPORT_REQUEST_PAYMENT_STATUS,
  SUPPORT_REQUEST_STATUS,
  SUPPORT_REQUEST_STATUS_ID,
} from '../../../../assets/constants';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {normal, small} from '../../../../assets/theme/metric';
import {
  getCancelReasonTicket,
  getRejectReasonTicket,
  supportServiceTicketProcessingStatuses,
} from '../../../../utils/GetMasterData';
import {formatTimeToTimeDate, getTextDateFromTimeStamp} from '../../../../utils/TimerCommon';

export const toOffsetDate = (input, seconds, format): string => {
  return moment(input).add(seconds, 'seconds').format(format);
};

const MESSAGE_STATE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
};

export const getKeyByValue = status => {
  const objectStatus = SUPPORT_REQUEST_STATUS.RECEIVED;
  return Object.keys(objectStatus).find(key => objectStatus[key] === status);
};

const getStatusNameByType = ({
  currentStatus,
  lastStatus,
  ticketPaymentStatusId,
  isRequest,
  masterData,
  refundDateTime,
  supportServiceTicketResult,
}) => {
  let message = '';
  let state = '';
  const updatedDatetime = getTextDateFromTimeStamp(lastStatus?.updatedDatetime);
  switch (currentStatus) {
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.new:
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.confirm:
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.processing:
      break;
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.reject:
      const messageReject = isRequest
        ? 'supportRequest.message.executorRejected'
        : 'supportRequest.message.requesterRejected';
      const note = isEmpty(lastStatus.reasonNote)
        ? getRejectReasonTicket(masterData, lastStatus?.reasonId)
        : lastStatus.reasonNote;
      message = translate(messageReject, {
        value: note,
      });
      state = MESSAGE_STATE.ERROR;
      break;
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.waitingresultbyconsultant:
      if (!isRequest) {
        message = translate('supportRequest.message.waitingResultByConsultant');
      } else {
        message = translate('supportRequest.message.requesterRejectedResult', {
          value: updatedDatetime,
        });
      }
      state = MESSAGE_STATE.WARNING;
      break;
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.waitingresultbyrequester:
      if (isRequest) {
        const date = toOffsetDate(
          lastStatus?.updatedDatetime,
          supportServiceTicketResult?.autoAcceptTicketInMinutes * 60,
          'HH:mm DD/MM/YYYY',
        );
        message = translate('supportRequest.message.executorWaitingResult', {
          value: date,
        });
      } else {
        message = translate('supportRequest.message.requesterWaitingResult');
      }
      state = MESSAGE_STATE.WARNING;
      break;
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.waitingupdatebyexecutor:
      const reasonNote = lastStatus?.reasonNote;
      message = translate('supportRequest.message.executorWaitingResult', {
        value: reasonNote,
      });
      state = MESSAGE_STATE.WARNING;
      break;
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.complete:
      message = translate('supportRequest.message.executorCompletedResult', {
        value: updatedDatetime,
      });
      state = MESSAGE_STATE.SUCCESS;
      break;
    case SUPPORT_REQUEST_STATUS_ID.RECEIVED.cancelled:
      if (ticketPaymentStatusId === SUPPORT_REQUEST_PAYMENT_STATUS.refund_request.id) {
        state = MESSAGE_STATE.INFO;
        message = translate('supportRequest.message.requesterRequestRefund', {
          date: formatTimeToTimeDate(refundDateTime),
        });
      } else {
        const value = isEmpty(lastStatus.reasonNote)
          ? getCancelReasonTicket(masterData, lastStatus?.reasonId)
          : lastStatus.reasonNote;
        message = translate('supportRequest.message.requesterCancelled', {value: value});
        state = MESSAGE_STATE.ERROR;
      }
      break;
    default:
      message = '';
      state = '';
      break;
  }
  return {message, state};
};

const mapStateToImage = messageState => {
  switch (messageState) {
    case MESSAGE_STATE.SUCCESS:
      return IMAGES.IC_SUCCESS_FILL;
    case MESSAGE_STATE.WARNING:
      return IMAGES.IC_STATUS_WARNING;
    case MESSAGE_STATE.ERROR:
      return IMAGES.IC_STATUS_CLOSE;
    case MESSAGE_STATE.INFO:
      return IMAGES.IC_STATUS_INFO;
    default:
      return IMAGES.IC_STATUS_WARNING;
  }
};

export const StatusMessageRequest = ({
  masterData,
  ticketPaymentStatusId,
  isRequest,
  supportTicketProcessings,
  updatedDatetime,
  supportServiceTicketResult,
}) => {
  const lastStatus = supportTicketProcessings[supportTicketProcessings.length - 1];
  const {status} = supportServiceTicketProcessingStatuses(
    masterData,
    lastStatus?.ticketProcessingStatusId,
  );
  const currentStatus = getKeyByValue(status);
  const {message, state: messageState} = getStatusNameByType({
    currentStatus,
    lastStatus,
    ticketPaymentStatusId,
    supportServiceTicketResult,
    isRequest,
    masterData,
    refundDateTime: updatedDatetime,
  });
  if (isEmpty(message)) return null;
  return (
    <View style={styles.container}>
      <Image style={styles.imageStatus} source={mapStateToImage(messageState)} />
      <Text style={{marginHorizontal: normal}}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStatus: {width: 20, height: 20},
  container: {
    flex: 1,
    height: 70,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: normal,
    marginVertical: small,
  },
});
