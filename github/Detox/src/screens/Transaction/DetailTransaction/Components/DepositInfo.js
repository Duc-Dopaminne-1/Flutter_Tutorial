import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {medium, normal, small, tiny} from '../../../../assets/theme/metric';
import CustomButton from '../../../../components/Button/CustomButton';
import CountDownTimeComponent from '../../../../components/CountDownTimeComponent';
import {getTransactionDateTimeString} from '../../../../utils/TimerCommon';
import {
  ButtonTransfer,
  RowText,
  SectionComponent,
  SingleBottomButton,
  ViewDeposited,
  ViewTransferDeposited,
} from './DetailTransactionComponents';
import {
  CommonDetailTransactionStyles as commonStyles,
  DepositType,
  EndTransactionType,
  TransactionType,
} from './DetailTransactionConstant';

const styles = StyleSheet.create({
  viewButtons: {
    marginTop: normal,
    width: 240,
  },
  buttonTransfer: {
    marginTop: 8,
    borderColor: COLORS.PRIMARY_A100,
  },
  buttonRefund: {
    paddingHorizontal: normal,
    paddingVertical: small,
    marginBottom: 12,
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: tiny,
  },
  changeProduct: {
    paddingHorizontal: normal,
    paddingVertical: small,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: tiny,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  textRequestRefund: {
    ...FONTS.regular,
    fontSize: 12,
  },
  timeRequestRefund: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.GRAY_A3,
  },
});

const textOnlyTransferDepositOnce = translate('transaction.detail.onlyTransferDepositOnce');

const ContentBookDeposited = ({data, onPressTransfer}) => {
  return (
    <>{!data.isSaleSeasonClosed && <ButtonTransfer data={data} onPress={onPressTransfer} />}</>
  );
};

const ContentDeposited = ({data}) => {
  return (
    <>
      <ViewDeposited data={data} />
    </>
  );
};

const ContentTransferDeposited = ({data}) => {
  return <ViewTransferDeposited data={data} />;
};

const TextOnlyTransferDepositOnce = () => {
  return (
    <Text
      style={{
        marginTop: normal,
        marginBottom: medium,
        ...FONTS.regular,
        color: COLORS.GREY_BERMUDA,
      }}>
      {textOnlyTransferDepositOnce}
    </Text>
  );
};

const ContentEndedDeposit = ({data, onPressButtonRefund, onPressButtonTransfer}) => {
  return (
    <>
      <View style={styles.viewButtons}>
        {data?.refundReady && (
          <SingleBottomButton
            style={styles.buttonRefund}
            titleStyle={{color: COLORS.NEUTRAL_WHITE, ...FONTS.bold}}
            title={translate(STRINGS.REFUND_REQUEST_STATUS)}
            onPress={onPressButtonRefund}
          />
        )}
        {data.isCurrentSaleSeason && (
          <SingleBottomButton
            style={data.ableRequestRefund ? styles.changeProduct : styles.buttonRefund}
            titleStyle={{
              color: data.ableRequestRefund ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_WHITE,
              ...FONTS.bold,
            }}
            title={translate(STRINGS.TRANSFER_PRODUCT)}
            onPress={onPressButtonTransfer}
          />
        )}
        <TextOnlyTransferDepositOnce />
      </View>
    </>
  );
};

const ContentOpeningDeposit = ({onPressConfirmDeposit, onPressTransfer}) => {
  return (
    <View>
      <View style={styles.viewButtons}>
        <CustomButton
          title={translate(STRINGS.CONFIRM)}
          style={[commonStyles.buttonColor]}
          titleStyle={FONTS.bold}
          onPress={onPressConfirmDeposit}
        />
        <CustomButton
          title={translate(STRINGS.TRANSFER_PRODUCT)}
          style={[commonStyles.buttonDetail, styles.buttonTransfer]}
          titleStyle={{...FONTS.bold, color: COLORS.PRIMARY_A100}}
          onPress={onPressTransfer}
        />
      </View>
      <TextOnlyTransferDepositOnce />
    </View>
  );
};

const ContentWaiting = ({onPressTransfer}) => {
  return (
    <View>
      <View style={styles.viewButtons}>
        <CustomButton
          title={translate(STRINGS.TRANSFER_PRODUCT)}
          style={[commonStyles.buttonColor]}
          titleStyle={{...FONTS.bold}}
          onPress={onPressTransfer}
        />
      </View>
      <TextOnlyTransferDepositOnce />
    </View>
  );
};

export const ContentRefund = ({style, data, onPressRefund}) => {
  const nowTime = moment().toDate().getTime();
  return (
    <>
      {data?.refundReady && (
        <View style={[styles.viewButtons, style]}>
          <SingleBottomButton
            style={styles.buttonRefund}
            titleStyle={{color: COLORS.NEUTRAL_WHITE, ...FONTS.bold}}
            title={translate(
              data?.transactionType === TransactionType.Booking
                ? STRINGS.REFUND_REQUEST_STATUS
                : 'REFUND_REQUEST_DEPOSIT',
            )}
            onPress={onPressRefund}
          />
        </View>
      )}
      {!data?.refundReady && nowTime > data?.endDepositeDatetime && (
        <View style={[styles.viewButtons, style]}>
          <Text style={styles.textRequestRefund}>
            {translate('transaction.detail.refundRequestNote')}
          </Text>
          <Text style={styles.timeRequestRefund}>
            {getTransactionDateTimeString(data?.endDepositeDatetime)}
          </Text>
        </View>
      )}
    </>
  );
};

const getContentView = ({data, onPressTransfer, onPressRefund, onPressConfirmDeposit}) => {
  switch (data.depositType) {
    case DepositType.BookDeposited:
      return <ContentBookDeposited data={data} onPressTransfer={onPressTransfer} />;
    case DepositType.DepositTransfer:
      return <ContentTransferDeposited data={data} />;
    case DepositType.DepositEnded:
      return (
        <ContentEndedDeposit
          data={data}
          onPressButtonRefund={onPressRefund}
          onPressButtonTransfer={onPressTransfer}
        />
      );
    case DepositType.OpeningDeposit:
      return (
        <ContentOpeningDeposit
          data={data}
          onPressConfirmDeposit={onPressConfirmDeposit}
          onPressTransfer={onPressTransfer}
        />
      );
    case DepositType.Nothing:
      return <ContentEndTransaction data={data} />;
    case DepositType.Waiting:
      return <ContentWaiting onPressTransfer={onPressTransfer} />;
    case DepositType.CancelledDeposit:
    case DepositType.WaitingPaymentDeposit:
      return <ContentRefund data={data} onPressRefund={onPressRefund} />;
    case DepositType.Cancelled:
    case DepositType.WaitingPayment:
    case DepositType.Refunded:
    case DepositType.RefundRequest:
    case DepositType.Future:
    case DepositType.Deposited:
    default:
      return null;
  }
};

const ContentEndTransactionDone = () => {
  return <RowText text={`${translate(STRINGS.COMPLETED)}`} />;
};

const ContentEndTransactionTransfer = ({data}) => {
  return <ViewTransferDeposited data={data} />;
};

const ContentEndTransaction = ({data}) => {
  switch (data.endTransactionType) {
    case EndTransactionType.Completed:
      return <ContentEndTransactionDone data={data} />;
    case EndTransactionType.TransferDeposit:
      return <ContentEndTransactionTransfer data={data} />;
    case EndTransactionType.Deposited:
      return null;
    default:
      return null;
  }
};

const getRightViewFirstRow = ({data}) => {
  if (data.depositType !== DepositType.OpeningDeposit) {
    return null;
  }
  return <CountDownTimeComponent dateEnd={data?.endDepositeTimeInSecond ?? 0} />;
};

const DepositInfo = ({
  data,
  subTitle,
  onPressTransfer,
  onPressRefund,
  onPressConfirmDeposit,
  titleDepositStep,
}) => {
  return (
    <SectionComponent
      title={titleDepositStep}
      subTitle={subTitle}
      rightViewFirstRow={getRightViewFirstRow({data})}>
      <View style={commonStyles.contentContainer}>
        {getContentView({
          data,
          onPressTransfer,
          onPressRefund,
          onPressConfirmDeposit,
        })}
      </View>
    </SectionComponent>
  );
};

export default DepositInfo;
