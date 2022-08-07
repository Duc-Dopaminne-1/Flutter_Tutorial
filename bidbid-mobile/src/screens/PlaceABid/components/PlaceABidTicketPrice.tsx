import React, { ReactElement, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { PlaceABidContext } from '@/screens/PlaceABid/PlaceABidContext';
import { formatPriceAuction } from '@/shared/discovery';

export function PlaceABidTicketPrice(): ReactElement {
  const {
    auction: { entryPrice },
  } = useContext(PlaceABidContext);

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>{language('ticketPriceLower')}</Text>
      <View style={styles.body}>
        <Text style={styles.textPrice}>{formatPriceAuction(entryPrice)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  textTitle: {
    paddingHorizontal: 20,
    fontSize: fonts.size.s16,
    fontWeight: fonts.fontWeight.bold,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textPrice: {
    paddingHorizontal: 20,
    fontSize: fonts.size.s16,
    fontWeight: '500',
    color: colors.blue_700,
    fontFamily: fonts.family.PoppinsRegular,
  },
  body: {
    marginTop: 20,
    backgroundColor: colors.white,
  },
});
