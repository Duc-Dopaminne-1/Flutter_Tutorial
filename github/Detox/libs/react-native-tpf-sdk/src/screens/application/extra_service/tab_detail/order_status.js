import { CustomBadge } from '../../../../components/';
import React from 'react';
import { StyleSheet } from 'react-native';
import { EXTRA_SERVICE_ORDER_STATUS, KPI_STATUS } from '../../../../global/order_status';
import { scale } from '../../../../utils/responsive';

const OrderStatus = ({ status }) => {
  const StatusList = [
    {
      status: EXTRA_SERVICE_ORDER_STATUS.New,
      title: 'application_list.surveying',
      type: 'wait'
    },
    {
      status: EXTRA_SERVICE_ORDER_STATUS.PartnerInvestigating,
      title: 'application_list.surveying',
      type: 'wait'
    },
    {
      status: EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment,
      title: 'application_list.waiting_for_1_st_payment',
      type: 'processing'
    },
    {
      status: EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment,
      title: 'application_list.processing',
      type: 'wait'
    },
    {
      status: EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment,
      title: 'application_list.waiting_for_remaining_payment',
      type: 'processing'
    },
    {
      status: EXTRA_SERVICE_ORDER_STATUS.CompleteRemainingPayment,
      title: 'application_list.processing',
      type: 'wait'
    },

    {
      status: EXTRA_SERVICE_ORDER_STATUS.Completed,
      title: 'application_list.completed',
      type: 'success'
    },
    {
      status: EXTRA_SERVICE_ORDER_STATUS.WaitingForQuote,
      title: 'application_list.waiting_quote',
      type: 'processing'
    },
    {
      status: EXTRA_SERVICE_ORDER_STATUS.Canceled,
      title: 'application_list.cancel',
      type: 'draft'
    },
    {
      status: KPI_STATUS.Processing,
      title: 'kpi.processing',
      type: 'processing'
    },
    {
      status: KPI_STATUS.Upcoming,
      title: 'kpi.upcoming',
      type: 'wait'
    },
    {
      status: KPI_STATUS.Expired,
      title: 'kpi.expired',
      type: 'draft'
    }
  ];
  const mappingStatus = StatusList.find(t => status === t.status);
  // const mappingStatus = StatusList[8];
  return (
    <CustomBadge style={styles.badge} status={mappingStatus?.type} value={mappingStatus?.title} />
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(-2)
  }
});
export default OrderStatus;
