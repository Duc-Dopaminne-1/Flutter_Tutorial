/* eslint-disable react-native/no-inline-styles */
import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { Auction } from '@/models';
import { language } from '@/i18n';
import { currencyFormat } from '@/shared/processing';
import DefaultText from '@/components/CustomText/DefaultText';
import IconAuctionNoWinnerSVG from '@/components/SVG/IconAuctionNoWinnerSVG';

interface Props {
  auctionNoWinner?: Auction;
}

export default function MyAuctionsNoWinner(props: Props): ReactElement {
  // Use Props
  const { auctionNoWinner } = props;

  if (!auctionNoWinner) return null;

  const { winningBid, reservePrice } = auctionNoWinner;
  const minimumReservePrice = reservePrice ? currencyFormat(reservePrice) : null;
  const highestBidPrice = winningBid && winningBid.price ? currencyFormat(winningBid.price) : currencyFormat(0);

  return (
    <View style={styles.container}>
      {/* Image Description */}
      <View style={styles.iconNoWinnerWrapper}>
        <IconAuctionNoWinnerSVG />
      </View>

      {/* Text Description */}
      <View style={styles.textDescView}>
        <DefaultText {...{ style: styles.noWinnerTitleText }}>{language('myAuctionsScreen.noWinner')}</DefaultText>
        <DefaultText {...{ style: styles.noWinnerDescText }}>{language('myAuctionsScreen.noWinnerDesc')}</DefaultText>
      </View>

      {/* Auction Price Info */}
      <View style={styles.auctionPriceInfo}>
        {/* Highest Bid Price */}
        <View style={styles.priceInfoRowView}>
          <DefaultText {...{ style: styles.textStyle }}>{language('myAuctionsScreen.highestBidPrice')}</DefaultText>
          <DefaultText {...{ style: [styles.textStyle, { fontWeight: '500' }] }}>{`${highestBidPrice} ${language(
            'currency',
          )}`}</DefaultText>
        </View>

        {/* Line Break */}
        {minimumReservePrice && <View style={styles.lineBreakView} />}

        {/* Minimum Reserve Price */}
        {minimumReservePrice && (
          <View style={styles.priceInfoRowView}>
            <DefaultText {...{ style: styles.textStyle }}>{language('myAuctionsScreen.minimumReservePrice')}</DefaultText>
            <DefaultText {...{ style: [styles.textStyle, { fontWeight: '500' }] }}>{`${minimumReservePrice}  ${language(
              'currency',
            )}`}</DefaultText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    shadowColor: colors.bg_icon,
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
    marginVertical: 20,
    marginHorizontal: 25,
    overflow: 'visible',
    borderRadius: 10,
  } as ViewStyle,

  textDescView: {
    marginHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },

  // closeImage: {
  //   height: 18,
  //   width: 18,
  //   tintColor: colors.text_gray,
  //   resizeMode: 'cover',
  // },

  iconNoWinnerWrapper: {
    marginTop: 35,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noWinnerTitleText: {
    marginTop: 5,
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsSemiBold,
  },

  noWinnerDescText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: fonts.size.s13,
  },

  auctionPriceInfo: {
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 0.8,
    borderColor: colors.light_bg_beta,
    borderRadius: 10,
  },

  priceInfoRowView: {
    marginVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textStyle: {
    textAlign: 'center',
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },

  lineBreakView: {
    height: 0.5,
    opacity: 0.5,
    backgroundColor: colors.text_gray,
  },
});
