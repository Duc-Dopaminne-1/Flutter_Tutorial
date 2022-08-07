import React, { ReactElement } from 'react';
import { ViewStyle, Text, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { language } from '@/i18n';

const CONTAINER: ViewStyle = {
  minWidth: 90,
  paddingHorizontal: 16,
  paddingVertical: 8,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  marginHorizontal: 6,
  marginVertical: 6,
  borderWidth: 1,
  borderColor: colors.gray_400,
  backgroundColor: colors.white,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s14,
  fontFamily: fonts.family.PoppinsRegular,
  color: colors.gray_600,
  fontWeight: '500',
  textAlign: 'center',
};

interface PlaceABidSuggestedBidsItemProps {
  style?: ViewStyle;
  itemOnSelected?: (item: any, index: number) => void;
  item?: any;
  index?: number;
}

export function PlaceABidSuggestedBidsItem(props: PlaceABidSuggestedBidsItemProps): ReactElement {
  const { style = CONTAINER, item, index, itemOnSelected = () => {} } = props;

  const { price } = useSelector((state: RootState) => {
    return state.placeABid;
  });

  const itemPrice = item.value;

  const isSelected = price === itemPrice;
  const backgroundColor = isSelected ? colors.blue_700 : colors.transparent;
  const textColor = isSelected ? colors.white : colors.text_light_gray;
  const value = `${item.string} ${language('currency')}`;
  return (
    <TouchableOpacity style={[style, { backgroundColor: backgroundColor }]} onPress={() => itemOnSelected(item.value, index)}>
      <Text style={[TITLE, { color: textColor }]}>{value}</Text>
    </TouchableOpacity>
  );
}
