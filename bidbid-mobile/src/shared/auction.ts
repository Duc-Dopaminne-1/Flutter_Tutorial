import { Auction } from '@/models';
import { getUserId } from '@/redux/user/selector';
import { capitalizeAllWorks, Log } from '@/shared/processing';
import { AuctionStatus } from '@/models';
import { colors } from '@/vars';
import { language } from '@/i18n';
import WaitingPaymentSVG from '@/components/SVG/WaitingPaymentSVG';
import AuctionCloseSVG from '@/components/SVG/AuctionCloseSVG';
import CompletedSVG from '@/components/SVG/CompletedSVG';
import { formatNameUser } from '@/shared/discovery';

export const getAuctionWonStatus = (status: string) => {
  if (status) {
    switch (status) {
      case AuctionStatus.COMPLETED:
        return language('myBidsScreen.completed');
      case AuctionStatus.WAITING_PAYMENT:
        return language('waitingPayment');
      case AuctionStatus.BIDDING:
        return language('myBidsScreen.bidding');
      case AuctionStatus.CANCEL:
        return language('myBidsScreen.cancelled');
      case AuctionStatus.FAILED_PAYMENT:
        return language('myBidsScreen.failedPayment');
      case AuctionStatus.READY_TO_PAY:
        return language('myBidsScreen.readyToPay');
      case AuctionStatus.READY_TO_MEET:
        return language('myBidsScreen.inProgress');
      default:
        return '';
    }
  }
  return status ? status : '';
};

export const getAuctionsStatusColor = (status: string) => {
  if (status) {
    switch (status) {
      case AuctionStatus.BIDDING:
        return colors.blue_700;
      case AuctionStatus.WAITING_PAYMENT:
        return colors.yellow_500;
      case AuctionStatus.CANCEL:
        return colors.gray_400;
      case AuctionStatus.COMPLETED:
        return colors.red_700;
      case AuctionStatus.FAILED_PAYMENT:
        return colors.red_900;
      case AuctionStatus.READY_TO_PAY:
      case AuctionStatus.READY_TO_MEET:
        return colors.blue_700;
      default:
        return colors.blue_700;
    }
  }
  return colors.blue_700;
};

export const getAuctionsDetailStatusColor = (status: string) => {
  if (status) {
    switch (status) {
      case AuctionStatus.BIDDING:
        return colors.blue_700;
      case AuctionStatus.WAITING_PAYMENT:
        return colors.yellow_500;
      case AuctionStatus.CANCEL:
        return colors.gray_400;
      case AuctionStatus.FAILED_PAYMENT:
        return colors.red_900;
      case AuctionStatus.COMPLETED:
      case AuctionStatus.READY_TO_PAY:
      case AuctionStatus.READY_TO_MEET:
        return colors.blue_700;
      default:
        return colors.blue_700;
    }
  }
  return colors.blue_700;
};

export const getTicketBuys = (tickets: any) => {
  let total = 0;
  tickets.forEach(item => {
    if (item.status === 'paid') {
      total = total + item.quantity;
    }
  });

  return total;
};

export const getIconAuctions = (status: string) => {
  if (status) {
    switch (status) {
      case AuctionStatus.WAITING_PAYMENT:
        return WaitingPaymentSVG();
      case AuctionStatus.CANCEL:
        return AuctionCloseSVG();
      case AuctionStatus.COMPLETED:
        return CompletedSVG();
      case AuctionStatus.FAILED_PAYMENT:
        return AuctionCloseSVG();
      case AuctionStatus.READY_TO_MEET:
        return CompletedSVG();
      default:
        return null;
    }
  }
  return null;
};

export const getNameMeetGreet = (auction: Auction) => {
  const name = auction ? (auction.creatorId === getUserId() ? formatNameUser(auction?.winner) : formatNameUser(auction?.creator)) : '';
  return capitalizeAllWorks(name);
};
