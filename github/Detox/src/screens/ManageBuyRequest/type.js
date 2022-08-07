import {SupportRequestContactTradingDto} from '../../api/graphql/generated/graphql';

export type ProgressDetail = {
  paymentTerms: String,
  remainingPayAmount: Number,
  paymentDatetime: Number,
  amount: Number,
  minDate: Number,
};

export type SupportRequestList = {
  transactionServices: SupportRequestContactTradingDto,
  financialServices: SupportRequestContactTradingDto,
};
