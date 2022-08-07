import { CustomBadge } from '../../../components/';
import React from 'react';
import { LEAD_STATUS } from '../../../global/lead_status';

const LeadS = ({ status }) => {
  const StatusList = [
    {
      status: LEAD_STATUS.ASSIGNED,
      title: 'lead_status.new',
      type: 'primary'
    },
    {
      status: LEAD_STATUS.UPDATING,
      title: 'lead_status.in_progress',
      type: 'processing'
    },
    {
      status: LEAD_STATUS.INPROGRESS,
      title: 'lead_status.in_progress',
      type: 'processing'
    },
    {
      status: LEAD_STATUS.ONHOLD,
      title: 'lead_status.on_hold',
      type: 'processing'
    },
    {
      status: LEAD_STATUS.CANNOTCONTACT,
      title: 'lead_status.not_contact',
      type: 'canceled'
    },
    {
      status: LEAD_STATUS.NOTQUALIFIED,
      title: 'lead_status.not_qualified',
      type: 'canceled'
    },
    {
      status: LEAD_STATUS.COMPLETED,
      title: 'lead_status.completed',
      type: 'canceled'
    },
    {
      status: LEAD_STATUS.CONVERTED,
      title: 'lead_status.converted',
      type: 'canceled'
    }
  ];
  const mappingStatus = StatusList.find(t => status === t.status);
  // const mappingStatus = StatusList[8];
  return <CustomBadge status={mappingStatus?.type} value={mappingStatus?.title} />;
};

export default LeadS;
