import React, { ReactElement } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { setPrice } from '@/redux/placeABid/actions';
import { currencyFormat } from '../PlaceABid';
import { formatPrice } from '@/shared/processing';

const CONTAINER: ViewStyle = {
  marginTop: 10,
  justifyContent: 'center',
  backgroundColor: colors.white,
};

const TITLE: TextStyle = {
  paddingHorizontal: 20,
  fontSize: fonts.size.s16,
  fontWeight: '500',
  color: colors.gray_900,
  fontFamily: fonts.family.PoppinsRegular,
};

const WRAP_ITEM: ViewStyle = {
  flexWrap: 'wrap',
};
const ITEM: ViewStyle = {
  minWidth: 90,
  paddingHorizontal: 16,
  paddingVertical: 8,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  borderColor: colors.blue_700,
  borderWidth: 1,
  marginHorizontal: 15,
  marginVertical: 6,
  backgroundColor: colors.bg_white,
};

const PRICE_TEXT: TextStyle = {
  fontSize: fonts.size.s14,
  fontFamily: fonts.family.PoppinsRegular,
  color: colors.white,
  fontWeight: '500',
  textAlign: 'left',
};

export function PlaceABidEndItNowPrice(): ReactElement {
  const dispatch = useDispatch();
  const { auction, price } = useSelector((state: RootState) => {
    return state.placeABid;
  });

  const endNowPrice = auction.endNowPrice ? currencyFormat(auction.endNowPrice) : '0.00';

  const itemOnPressed = () => {
    dispatch(setPrice(endNowPrice));
  };

  const isSelected = parseFloat(price.replace(/,/g, '')) === auction.endNowPrice;
  const backgroundColor = isSelected ? colors.blue_700 : colors.white;
  const textColor = isSelected ? colors.white : colors.blue_700;
  const value = formatPrice(parseFloat(endNowPrice?.replace(/,/g, '')));
  return (
    <View style={CONTAINER}>
      <Text style={TITLE}>{language('placeABid.endItNowPrice')}</Text>
      <View style={WRAP_ITEM}>
        <TouchableOpacity style={[ITEM, { backgroundColor: backgroundColor }]} onPress={itemOnPressed}>
          <Text style={[PRICE_TEXT, { color: textColor }]}>{value}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
