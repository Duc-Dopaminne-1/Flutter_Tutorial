export const DEFINE_STATE = {
  WAIT_FOR_PAY: 0,
  INPROCESS: 1,
  COMPLETED: 2,
  CANCELED: 3
};

export const AdditionServiceState = [
  {
    id: DEFINE_STATE.WAIT_FOR_PAY,
    title: 'profile_state.pedding',
    backgroundColor: '#EF413D'
  },
  {
    id: DEFINE_STATE.INPROCESS,
    title: 'profile_state.inprocess',
    backgroundColor: '#F99D33'
  },
  {
    id: DEFINE_STATE.COMPLETED,
    title: 'Hoan thanh',
    backgroundColor: '#00B495'
  },
  {
    id: DEFINE_STATE.CANCELED,
    title: 'Da huy',
    backgroundColor: '#939598'
  }
];

export const STATUS_CODE = {
  processing: 'CompleteDepositPayment',
  waitingFor1StPayment: 'WaitingForDepositPayment',
  paymentLeft: 'WaitingForRemainingPayment',
  finish: 'Completed',
  cancelled: 'Canceled',
  surveying: 'New',
  draft: 'Draft',
  partnerInvestigating: 'PartnerInvestigating',
  completeRemainingPayment: 'CompleteRemainingPayment'
};
