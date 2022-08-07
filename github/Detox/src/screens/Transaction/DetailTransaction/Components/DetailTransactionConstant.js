import {StyleSheet} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal, small, tiny} from '../../../../assets/theme/metric';

const CommonDetailTransactionStyles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    minHeight: 100,
  },
  contentContainer: {
    marginVertical: small,
    minHeight: 120,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 15,
  },
  titleInActive: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.GRAY_BD,
  },
  timeText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_33,
  },
  buttonDetail: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 4,
    borderColor: COLORS.BLACK_33,
    padding: 9,
  },
  titleButtonDetail: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.BLACK_33,
  },
  buttonNext: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 12,
  },
  firstRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstRowTitleAndTime: {
    flexShrink: 1,
    marginRight: normal,
  },
  rowValue: {
    ...FONTS.regular,
    fontSize: 15,
    marginBottom: tiny,
  },
  buttonColor: {
    backgroundColor: COLORS.PRIMARY_A100,
    padding: 9,
    borderRadius: 4,
  },
  titleButtonColor: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.NEUTRAL_WHITE,
  },
  errorText: {
    ...FONTS.regular,
    color: COLORS.STATE_ERROR,
    fontSize: 12,
  },
});

const TransactionType = {
  Booking: 'Booking',
  Deposit: 'Deposit',
  Description: 'Description',
};

const DepositType = {
  Future: 'Future', // Chưa mở bán (ngày mở cọc trong tương lai) (only from transactionType == booking)
  Waiting: 'Waiting', // Chờ xác nhận cọc (only from transactionType == booking)
  OpeningDeposit: 'OpeningDeposit', // Đang mở cọc chờ user xác nhận (only from transactionType == booking)
  BookDeposited: 'BookDeposited', // Xác nhận chuyển giữ chỗ thành cọc
  Deposited: 'Deposited', //Xác nhận cọc (không đặt chỗ trước)
  DepositTransfer: 'DepositTransfer', // Chuyển xác nhận cọc
  DepositEnded: 'DepositEnded', // Xác nhận cọc kết thúc (phiên xác nhận cọc kết thúc hoặc có người khác xác nhận cọc)
  Nothing: 'Nothing', //Don't show anything
  RefundRequest: 'RefundRequest', // Đã gửi yêu cầu hoàn tiền đăt chỗ
  RefundRequestDeposit: 'RefundRequestDeposit', // Đã gửi yêu cầu hoàn tiền đặt cọc
  Refunded: 'Refunded', // Đã Hoàn tiền đặt chỗ
  RefundedDeposit: 'RefundedDeposit', // Đã Hoàn tiền đặt cọc
  WaitingPayment: 'WaitingPayment', // Chờ thanh toán đặt chỗ
  Cancelled: 'CancelledBooking', // Bị huỷ/ Từ Chối đặt chỗ
  WaitingPaymentDeposit: 'WaitingPaymentDeposit', // Chờ thanh toán đặt cọc
  CancelledDeposit: 'CancelledDeposit', //  Bị huỷ/ Từ Chối đặt cọc
};

const EndTransactionType = {
  Completed: 'Completed',
  TransferDeposit: 'TransferDeposit',
  Deposited: 'Deposited',
  InActive: 'InActive',
};

export {CommonDetailTransactionStyles, DepositType, EndTransactionType, TransactionType};
