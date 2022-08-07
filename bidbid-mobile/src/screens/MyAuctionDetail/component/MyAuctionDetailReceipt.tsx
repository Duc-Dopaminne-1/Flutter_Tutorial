import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { CustomLine } from '@/components/CustomeLine';
import { CustomText } from '@/components/CustomText';
import { formatPrice } from '@/shared/processing';
import { isIOS, isIphoneX } from '@/shared/devices';
import { Auction, AUCTION_TYPE } from '@/models';

interface Prop {
  data: Auction;
  tabLabel?: string;
}

export function MyAuctionDetailReceipt(props: Prop): ReactElement {
  const { winningBid, isBiddee, receipt, systemFeeAmount, donationPercent, donationAmount, winningPrice, amount, type } = props.data;
  const { biddeeCancelFee, bidderCancelFee, biddeeTotal, biddeeAbsence, bidderTotal, bidderAbsence } = receipt;
  const isRaffleAuction = type === AUCTION_TYPE.RAFFLE;

  const renderBidder = () => {
    let titleBid = '';
    if ((biddeeAbsence > 0 && bidderAbsence === 0) || (biddeeCancelFee > 0 && bidderCancelFee === 0)) {
      titleBid = language('refund');
    }
    const winBid = winningPrice ? winningPrice : winningBid?.price || 0;
    const winBidValue = formatPrice(winBid);
    const bidderCancelFeeValue = formatPrice(bidderCancelFee);
    const bidderAbsenceValue = formatPrice(bidderAbsence);
    const biddeeCancelFeeValue = `${formatPrice(biddeeCancelFee)} ${language('bonus')}`;
    const biddeeAbsenceValue = `${formatPrice(biddeeAbsence)} ${language('bonus')}`;
    const bidderTotalValue = formatPrice(Math.abs(bidderTotal));
    const bidderReceiptPaid = formatPrice(receipt?.bidderPaid ?? winningPrice ?? winningBid?.price);

    return (
      <View>
        {!isRaffleAuction ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={`${language('winningBid')} ${titleBid}`}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={winBidValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {isRaffleAuction && receipt?.bidderPaid > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={`${language('bidderPaid')} ${titleBid}`}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={bidderReceiptPaid}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {bidderCancelFee > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BidderCancel')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={bidderCancelFeeValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {bidderAbsence > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BidderAbsence')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={bidderAbsenceValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {biddeeCancelFee > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BiddeeCancel')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={biddeeCancelFeeValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {biddeeAbsence > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BiddeeAbsence')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={biddeeAbsenceValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        <CustomLine lineStyle={styles.lineTotal} />

        <CustomText
          containerStyle={styles.row}
          title={bidderTotal > 0 ? language('totalEarn') : language('totalPay')}
          titleStyle={styles.textTotal}
          contentStyle={styles.textTotal}
          content={bidderTotalValue}
        />
      </View>
    );
  };

  const renderBiddee = () => {
    let titleBid = '';
    if (biddeeAbsence > 0 && bidderAbsence > 0) {
      titleBid = language('refunded');
    } else if ((biddeeAbsence > 0 && bidderAbsence === 0) || biddeeCancelFee > 0) {
      titleBid = isRaffleAuction ? language('refunded') : language('refundedBidder');
    }
    const winBid = amount ?? winningPrice ?? winningBid?.price;
    const winBidValue = formatPrice(winBid);
    const systemFeeAmountValue = formatPrice(systemFeeAmount);
    const biddeeCancelFeeValue = formatPrice(biddeeCancelFee);
    const biddeeAbsenceValue = formatPrice(biddeeAbsence);
    const bidderCancelFeeValue = `${formatPrice(bidderCancelFee)} ${language('bonus')}`;
    const bidderAbsenceValue = `${formatPrice(bidderAbsence)} ${language('bonus')}`;
    const donationAmountValue = donationPercent > 0 ? formatPrice(donationAmount) : '';
    const biddeeTotalValue = formatPrice(Math.abs(biddeeTotal));
    const title = isRaffleAuction ? `${language('purchasePrice')} ${titleBid}` : `${language('winningBid')} ${titleBid}`;

    return (
      <View>
        <CustomText
          containerStyle={styles.row}
          title={title}
          titleStyle={styles.text}
          contentStyle={styles.textContent}
          content={winBidValue}
        />
        <CustomLine lineStyle={styles.line} />

        {systemFeeAmount > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('bidbidFee')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={systemFeeAmountValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {biddeeCancelFee > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BiddeeCancel')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={biddeeCancelFeeValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {biddeeAbsence > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BiddeeAbsence')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={biddeeAbsenceValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {bidderCancelFee > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BidderCancel')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={bidderCancelFeeValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {bidderAbsence > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={language('BidderAbsence')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={bidderAbsenceValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        {donationPercent > 0 ? (
          <>
            <CustomText
              containerStyle={styles.row}
              title={`${language('donatingAuction')} (${donationPercent * 100}%)`}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={donationAmountValue}
            />
            <CustomLine lineStyle={styles.line} />
          </>
        ) : null}

        <CustomLine lineStyle={styles.lineTotal} />
        <CustomText
          containerStyle={styles.row}
          title={biddeeTotal > 0 ? language('totalEarn') : language('totalPay')}
          titleStyle={styles.textTotal}
          contentStyle={styles.textTotal}
          content={biddeeTotalValue}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/*Bid Price*/}
      <View style={styles.wrapItem}>{isBiddee ? renderBiddee() : renderBidder()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
    paddingHorizontal: 16,
  },
  wrapItem: {
    marginTop: 16,
    borderRadius: 10,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border_grey_light,
  },
  row: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textTotal: {
    fontSize: isIphoneX() ? fonts.size.s14 : fonts.size.s13,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    textAlign: 'left',
    fontWeight: isIOS ? '600' : 'bold',
  },
  text: {
    flex: 1,
    fontSize: isIphoneX() ? fonts.size.s14 : fonts.size.s13,
    color: colors.gray_last_time,
    fontFamily: fonts.family.PoppinsRegular,
    textAlign: 'left',
  },
  textContent: {
    fontSize: fonts.size.s13,
    color: colors.gray_last_time,
    fontWeight: '500',
    fontFamily: fonts.family.PoppinsRegular,
  },
  line: {
    marginVertical: 12,
  },
  lineTotal: {
    marginTop: -13,
    marginBottom: 12,
    backgroundColor: colors.blue_600,
  },
});
