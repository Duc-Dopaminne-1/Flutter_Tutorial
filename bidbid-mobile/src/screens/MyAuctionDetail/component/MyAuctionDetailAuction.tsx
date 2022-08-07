import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { CustomLine } from '@/components/CustomeLine';
import { CustomText } from '@/components/CustomText';
import { formatPrice } from '@/shared/processing';
import { isIphoneX } from '@/shared/devices';
import { RootState } from '@/redux/reducers';
import { useSelector } from 'react-redux';
import { Auction, AUCTION_TYPE } from '@/models';
import { formatPriceAuction } from '@/shared/discovery';
import { getUserId } from '@/redux/user/selector';

interface Prop {
  data: Auction;
  tabLabel?: string;
}

export function MyAuctionDetailAuction(props: Prop): ReactElement {
  const user = useSelector((state: RootState) => {
    return state.user;
  });

  const {
    reservePrice,
    winningBid,
    donationPercent,
    endNowPrice = 0,
    winner,
    type,
    winningPrice,
    soldTickets,
    entryPrice,
    orders,
  } = props.data;

  const isRaffleAuction = type === AUCTION_TYPE.RAFFLE;
  const winBid = winningPrice ? winningPrice : winningBid?.price || 0;
  const isBidder = winner ? winner.id === user.data.id : false;

  const renderEndNowPrice = () => {
    if (!isBidder) {
      if (endNowPrice && endNowPrice !== 0 && endNowPrice !== 0.0) {
        const endNowPriceValue = formatPrice(endNowPrice);
        return (
          <>
            <CustomLine lineStyle={styles.line} />
            <CustomText
              containerStyle={styles.row}
              title={language('endPrice')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={endNowPriceValue}
            />
          </>
        );
      }
      return null;
    } else {
      if (endNowPrice && endNowPrice !== 0 && endNowPrice !== 0.0) {
        const endNowPriceValue = formatPrice(endNowPrice);
        return (
          <>
            <CustomLine lineStyle={styles.line} />
            <CustomText
              containerStyle={styles.row}
              title={language('endPrice')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={endNowPriceValue}
            />
          </>
        );
      }
      return null;
    }
  };

  const renderReservePrice = () => {
    if (!isBidder) {
      return (
        reservePrice && (
          <>
            <CustomLine lineStyle={styles.line} />
            <CustomText
              containerStyle={styles.row}
              title={language('minimumReservePrice')}
              titleStyle={styles.text}
              contentStyle={styles.textContent}
              content={formatPrice(reservePrice || 0)}
            />
          </>
        )
      );
    } else {
      return null;
    }
  };

  const renderDonating = () => {
    if (!isBidder) {
      return (
        <>
          <CustomLine lineStyle={styles.line} />
          <CustomText
            containerStyle={styles.row}
            title={language('donating', { total: donationPercent * 100 })}
            titleStyle={styles.text}
            contentStyle={styles.textContent}
            content={''}
          />
        </>
      );
    }
    return null;
  };

  const renderTicketPrice = () => {
    if (isRaffleAuction) {
      return (
        <>
          <CustomText
            containerStyle={styles.row}
            title={language('ticketPrice')}
            titleStyle={styles.text}
            contentStyle={styles.textContent}
            content={formatPriceAuction(entryPrice)}
          />
        </>
      );
    }
    return null;
  };

  const renderTotalTicket = () => {
    if (isRaffleAuction) {
      let totalPrice = 0;
      orders.map(item => {
        if (item.userId === getUserId()) {
          totalPrice += item.quantity;
        }
      });
      const content = isBidder ? totalPrice : soldTickets.toString();
      return (
        <>
          <CustomLine lineStyle={styles.line} />
          <CustomText
            containerStyle={styles.row}
            title={language('numberTickets')}
            titleStyle={styles.text}
            contentStyle={styles.textContent}
            content={content.toString()}
          />
        </>
      );
    }
    return null;
  };

  const winnidBidValue = formatPrice(winBid);

  return (
    <View style={styles.container}>
      {/*Bid Price*/}
      <View style={styles.wrapItem}>
        {!isRaffleAuction ? (
          <CustomText
            containerStyle={styles.row}
            title={language('winningBid')}
            titleStyle={styles.text}
            contentStyle={styles.textContent}
            content={winnidBidValue}
          />
        ) : null}

        {renderTicketPrice()}
        {renderTotalTicket()}

        {renderDonating()}

        {renderEndNowPrice()}
        {renderReservePrice()}
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: isIphoneX() ? fonts.size.s14 : fonts.size.s13,
    color: colors.gray_last_time,
    fontFamily: fonts.family.PoppinsRegular,
    textAlign: 'left',
  },
  textContent: {
    fontSize: isIphoneX() ? fonts.size.s14 : fonts.size.s13,
    color: colors.gray_last_time,
    fontWeight: '500',
    fontFamily: fonts.family.PoppinsRegular,
    textAlign: 'left',
  },
  line: { marginVertical: 12 },
});
