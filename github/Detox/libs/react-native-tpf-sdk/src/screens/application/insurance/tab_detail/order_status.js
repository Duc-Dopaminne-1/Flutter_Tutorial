import { CustomBadge } from '../../../../components/';
import React from 'react';
import {
  INSURANCE_ORDER_STATUS,
  INSURANCE_REFUND_REQUEST_STATUS,
  INSURANCE_TRANSACTION_HISTORY_STATUS
} from '../../../../global/order_status';

const OrderStatus = ({ status }) => {
  const StatusList = [
    {
      status: INSURANCE_ORDER_STATUS.Draft,
      title: 'application_list.draft',
      type: 'draft'
    },
    {
      status: INSURANCE_ORDER_STATUS.WaitingForUpdate,
      title: 'application_list.additional_documents',
      type: 'wait'
    },
    {
      status: INSURANCE_ORDER_STATUS.WaitingForPayment,
      title: 'application_list.wait_for_pay',
      type: 'wait'
    },
    {
      status: INSURANCE_ORDER_STATUS.WaitingForPartnerAcceptance,
      title: 'application_list.processing',
      type: 'processing'
    },
    {
      status: INSURANCE_ORDER_STATUS.PartnerProcessing,
      title: 'application_list.processing',
      type: 'processing'
    },
    {
      status: INSURANCE_ORDER_STATUS.WaitingForConsider,
      title: 'application_list.consider',
      type: 'wait'
    },
    {
      status: INSURANCE_ORDER_STATUS.WaitingForApproveCancelOrder,
      title: 'application_list.waiting_for_approve_cancel',
      type: 'processing'
    },
    {
      status: INSURANCE_ORDER_STATUS.WaitingForApproveStopOrder,
      title: 'application_list.waiting_for_approve_stop',
      type: 'processing'
    },
    {
      status: INSURANCE_ORDER_STATUS.LiquidationAgreement,
      title: 'application_list.liquidation',
      type: 'canceled'
    },
    {
      status: INSURANCE_ORDER_STATUS.Completed,
      title: 'application_list.completed',
      type: 'success'
    },
    {
      status: INSURANCE_ORDER_STATUS.Canceled,
      title: 'application_list.cancel',
      type: 'canceled'
    },
    {
      status: INSURANCE_REFUND_REQUEST_STATUS.CancelContract,
      title: 'insurance_record_details.cancel_contract_2',
      type: 'success'
    },
    {
      status: INSURANCE_REFUND_REQUEST_STATUS.StopContract,
      title: 'insurance_record_details.stop_contract',
      type: 'success'
    },
    {
      status: INSURANCE_TRANSACTION_HISTORY_STATUS.Payment,
      title: 'insurance_record_details.payment',
      type: 'success'
    },
    {
      status: INSURANCE_TRANSACTION_HISTORY_STATUS.CancelContract,
      title: 'insurance_record_details.cancel_contract_2',
      type: 'wait'
    },
    {
      status: INSURANCE_TRANSACTION_HISTORY_STATUS.StopContract,
      title: 'insurance_record_details.stop_contract',
      type: 'wait'
    }
  ];
  const mappingStatus = StatusList.find(t => status === t.status);
  // const mappingStatus = StatusList[8];

  return <CustomBadge status={mappingStatus?.type} value={mappingStatus?.title} />;
};

export default OrderStatus;
