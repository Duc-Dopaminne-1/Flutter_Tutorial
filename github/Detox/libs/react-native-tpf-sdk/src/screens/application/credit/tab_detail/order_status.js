import { CustomBadge } from '../../../../components/';
import React from 'react';
import { CREDIT_ORDER_STATUS } from '../../../../global/order_status';

const OrderStatus = ({ status }) => {
  const StatusList = [
    {
      status: CREDIT_ORDER_STATUS.Draft,
      title: 'credit_order_status.draft',
      type: 'draft'
    },
    {
      status: CREDIT_ORDER_STATUS.WaitingForUpdate,
      title: 'credit_order_status.need_to_handle',
      type: 'wait'
    },
    {
      status: CREDIT_ORDER_STATUS.WaitingForOperatorAcceptance,
      title: 'credit_order_status.processing',
      type: 'processing'
    },
    {
      status: CREDIT_ORDER_STATUS.WaitingForPartnerAcceptance,
      title: 'credit_order_status.processing',
      type: 'processing'
    },
    {
      status: CREDIT_ORDER_STATUS.WaitingForAssessment,
      title: 'credit_order_status.processing',
      type: 'processing'
    },
    {
      status: CREDIT_ORDER_STATUS.Approved,
      title: 'credit_order_status.approved',
      type: 'success'
    },
    {
      status: CREDIT_ORDER_STATUS.Disbursing,
      title: 'credit_order_status.approved',
      type: 'success'
    },
    {
      status: CREDIT_ORDER_STATUS.Completed,
      title: 'credit_order_status.completed',
      type: 'success'
    },
    {
      status: CREDIT_ORDER_STATUS.Canceled,
      title: 'credit_order_status.user_cancels',
      type: 'draft'
    },
    {
      status: CREDIT_ORDER_STATUS.Rejected,
      title: 'credit_order_status.refuse',
      type: 'draft'
    },
    {
      status: CREDIT_ORDER_STATUS.WaitingForPayment,
      title: 'credit_order_status.wait_for_pay',
      type: 'wait'
    }
  ];
  const mappingStatus = StatusList.find(t => status === t.status);
  // const mappingStatus = StatusList[8];
  return <CustomBadge status={mappingStatus?.type} value={mappingStatus?.title} />;
};

export default OrderStatus;
