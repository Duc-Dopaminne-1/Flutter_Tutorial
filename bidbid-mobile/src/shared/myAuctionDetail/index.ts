import { AuctionStatus } from '@/models';

export const shouldShowReceipt = (status: string) => {
  const arrShowReceipt = [
    AuctionStatus.FAILED,
    AuctionStatus.COMPLETED,
    AuctionStatus.NO_WINNER,
    AuctionStatus.FAILED_PAYMENT,
    AuctionStatus.CANCEL,
  ];
  return arrShowReceipt.includes(status);
};
