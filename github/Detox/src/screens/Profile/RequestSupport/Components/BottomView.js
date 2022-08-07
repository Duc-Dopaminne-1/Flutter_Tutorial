import isEmpty from 'lodash/isEmpty';
import React from 'react';

import {
  SUPPORT_REQUEST_PAYMENT_STATUS,
  SUPPORT_REQUEST_STATUS,
  SUPPORT_REQUEST_STATUS_ID,
  SUPPORT_SERVICE_STATUS,
} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import {
  getSupportServicesTicketStatus,
  supportServiceTicketProcessingStatuses,
} from '../../../../utils/GetMasterData';
import ScreenIds from '../../../ScreenIds';
import {getKeyByValue} from './StatusMessageRequest';

const disableButtonState = [
  SUPPORT_SERVICE_STATUS.Reject,
  SUPPORT_SERVICE_STATUS.Cancelled,
  SUPPORT_SERVICE_STATUS.New,
];

export const BottomView = ({
  nextState = [],
  ticketPaymentStatusId,
  isRequest,
  masterData,
  ticketStatusId,
  ticketId,
  supportServiceId,
  propertyPostId,
  navigation,
  supportServiceTicketResult,
  supportServiceTicketProcessings,
  openRefundModal,
  onPressAccept,
  onPressReject,
  currentExecutorId,
  onPressStartSupportRequest,
}) => {
  const lastStatus = supportServiceTicketProcessings[supportServiceTicketProcessings.length - 1];

  const {status} = supportServiceTicketProcessingStatuses(
    masterData,
    lastStatus?.ticketProcessingStatusId,
  );
  const currentStatus = getKeyByValue(status);
  if (
    ticketPaymentStatusId &&
    ticketPaymentStatusId === SUPPORT_REQUEST_PAYMENT_STATUS.refund_request.id
  ) {
    return null;
  }

  const renderStyleButton = id => {
    return disableButtonState.includes(id) ? {backgroundColor: COLORS.GRAY_ED} : {};
  };

  const onPressBottomView = id => {
    switch (id) {
      case SUPPORT_SERVICE_STATUS.New:
      case SUPPORT_SERVICE_STATUS.Confirm:
        return onPressAccept();
      case SUPPORT_SERVICE_STATUS.Reject:
        return onPressReject();
      case SUPPORT_SERVICE_STATUS.Processing:
        return navigation.navigate(ScreenIds.DetailConsultationResult, {
          ticketId,
          supportServiceId,
        });
      case SUPPORT_SERVICE_STATUS.Complete:
      case SUPPORT_SERVICE_STATUS.Cancelled:
      default:
    }
  };

  const Button = ({data}) => {
    const {status: ticketStatus} = getSupportServicesTicketStatus(masterData, data);
    const style = renderStyleButton(data);
    return (
      <CustomButton
        style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal, ...style}}
        title={ticketStatus}
        titleStyle={{...FONTS.bold}}
        onPress={() => onPressBottomView(data)}
      />
    );
  };
  switch (ticketStatusId) {
    case SUPPORT_SERVICE_STATUS.Confirm:
      if (isRequest) {
        return null;
      } else {
        if (supportServiceTicketResult?.ticketResultStatusId) {
          return null;
        } else {
          return (
            <CustomButton
              style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
              title={translate('supportRequest.detail.beginToExecute')}
              titleStyle={{...FONTS.bold}}
              onPress={onPressStartSupportRequest}
            />
          );
        }
      }
    case SUPPORT_SERVICE_STATUS.New:
      if (isRequest) {
        return (
          <CustomButton
            style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
            title={translate('contactAdvice.detail.cancelRequest')}
            titleStyle={{...FONTS.bold}}
            onPress={onPressReject}
          />
        );
      } else {
        return (
          nextState &&
          nextState.map((item, index) => <Button key={index} data={item} masterData={masterData} />)
        );
      }
    case SUPPORT_SERVICE_STATUS.Complete:
      if (isRequest) {
        return (
          <CustomButton
            style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
            title={translate('contactAdvice.detail.seeResult')}
            titleStyle={{...FONTS.bold}}
            onPress={() =>
              navigation.navigate(ScreenIds.DetailConsultationResult, {
                ticketId: ticketId,
                isRequester: true,
                isComplete: true,
                ticketResultId: supportServiceTicketResult?.supportServiceTicketResultId,
                ticketResultStatusId: supportServiceTicketResult?.ticketResultStatusId,
              })
            }
          />
        );
      } else {
        return null;
      }
    case SUPPORT_SERVICE_STATUS.Processing:
      if (isRequest) {
        if (
          currentStatus === SUPPORT_REQUEST_STATUS_ID.RECEIVED.waitingresultbyconsultant ||
          isEmpty(supportServiceTicketResult?.supportServiceTicketResultId)
        ) {
          return null;
        } else {
          return (
            <CustomButton
              style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
              title={translate('supportRequest.detail.feedback')}
              titleStyle={{...FONTS.bold}}
              onPress={() =>
                navigation.navigate(ScreenIds.DetailConsultationResult, {
                  ticketId: ticketId,
                  isRequester: true,
                  ticketResultId: supportServiceTicketResult?.supportServiceTicketResultId,
                  ticketResultStatusId: supportServiceTicketResult?.ticketResultStatusId,
                })
              }
            />
          );
        }
      } else if (!isRequest) {
        if (isEmpty(supportServiceTicketResult?.supportServiceTicketResultId)) {
          return (
            <CustomButton
              style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
              title={translate('contactAdvice.detail.sendResult')}
              titleStyle={{...FONTS.bold}}
              onPress={() => onPressBottomView(SUPPORT_SERVICE_STATUS.Processing)}
            />
          );
        } else if (status === SUPPORT_REQUEST_STATUS.RECEIVED.waitingresultbyrequester) {
          return (
            <CustomButton
              style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
              title={translate('contactAdvice.detail.seeResult')}
              titleStyle={{...FONTS.bold}}
              onPress={() =>
                navigation.navigate(ScreenIds.DetailConsultationResult, {
                  ticketId: ticketId,
                  isRequester: false,
                  isComplete: true,
                  viewOnly: true,
                  ticketResultId: supportServiceTicketResult?.supportServiceTicketResultId,
                  ticketResultStatusId: supportServiceTicketResult?.ticketResultStatusId,
                })
              }
            />
          );
        }
        return (
          <CustomButton
            style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
            title={translate('common.update')}
            titleStyle={{...FONTS.bold}}
            onPress={() =>
              navigation.navigate(ScreenIds.DetailConsultationResult, {
                ticketId: ticketId,
                ticketResultId: supportServiceTicketResult?.supportServiceTicketResultId,
                ticketResultStatusId: supportServiceTicketResult?.ticketResultStatusId,
                supportServiceId,
              })
            }
          />
        );
      }
      return null;
    case SUPPORT_SERVICE_STATUS.Reject:
    case SUPPORT_SERVICE_STATUS.Cancelled:
      if (isRequest) {
        return (
          <>
            <CustomButton
              style={{...commonStyles.buttonNextConfirm, ...HELPERS.fill, marginLeft: normal}}
              title={translate('supportRequest.detail.requestRefund')}
              titleStyle={{...FONTS.bold, color: COLORS.PRIMARY_A100}}
              onPress={openRefundModal}
            />
            <CustomButton
              style={{...commonStyles.buttonNext, ...HELPERS.fill, marginLeft: normal}}
              title={translate('supportRequest.detail.changeTopener')}
              titleStyle={{...FONTS.bold}}
              onPress={() =>
                navigation.navigate(ScreenIds.SelectTopener, {
                  isChangeTopener: true,
                  ticketId,
                  propertyPostId: propertyPostId,
                  supportServiceId: supportServiceId,
                  currentTopenerId: currentExecutorId,
                })
              }
            />
          </>
        );
      } else {
        return null;
      }
    default:
      return (
        nextState &&
        nextState.map((item, index) => <Button key={index} data={item} masterData={masterData} />)
      );
  }
};
