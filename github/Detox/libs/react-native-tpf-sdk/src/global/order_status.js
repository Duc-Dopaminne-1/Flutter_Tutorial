export const CREDIT_ORDER_STATUS = {
  Draft: 'Draft',
  WaitingForUpdate: 'WaitingForUpdate',
  WaitingForOperatorAcceptance: 'WaitingForOperatorAcceptance',
  WaitingForPartnerAcceptance: 'WaitingForPartnerAcceptance',
  WaitingForAssessment: 'WaitingForAssessment',
  Approved: 'Approved',
  Disbursing: 'Disbursing',
  Completed: 'Completed',
  Canceled: 'Canceled',
  Rejected: 'Rejected',
  WaitingForPayment: 'WaitingForPayment'
};

export const INSURANCE_ORDER_STATUS = {
  Draft: 'Draft',
  WaitingForPayment: 'WaitingForPayment',
  WaitingForUpdate: 'WaitingForUpdate',
  WaitingForPartnerAcceptance: 'WaitingForPartnerAcceptance',
  PartnerProcessing: 'PartnerProcessing',
  WaitingForConsider: 'WaitingForConsider',
  Completed: 'Completed',
  WaitingForApproveCancelOrder: 'WaitingForApproveCancelOrder',
  WaitingForApproveStopOrder: 'WaitingForApproveStopOrder',
  LiquidationAgreement: 'LiquidationAgreement',
  Canceled: 'Canceled'
};
export const INSURANCE_REFUND_REQUEST_STATUS = {
  CancelContract: 'CancelContract',
  StopContract: 'StopContract'
};

export const INSURANCE_TRANSACTION_HISTORY_STATUS = {
  CancelContract: 'CancelContractTransaction',
  StopContract: 'StopContractTransaction',
  Payment: 'Payment'
};

export const EXTRA_SERVICE_ORDER_STATUS = {
  New: 'New',
  PartnerInvestigating: 'PartnerInvestigating',
  WaitingForDepositPayment: 'WaitingForDepositPayment',
  CompleteDepositPayment: 'CompleteDepositPayment',
  WaitingForRemainingPayment: 'WaitingForRemainingPayment',
  CompleteRemainingPayment: 'CompleteRemainingPayment',
  Completed: 'Completed',
  Canceled: 'Canceled',
  WaitingForQuote: 'WaitingForQuote'
};

export const KPI_STATUS = {
  Upcoming: 'Upcoming',
  Processing: 'Processing',
  Expired: 'Expired'
};
