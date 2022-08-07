import React, { ReactElement, useContext } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import CloseSvg from '@/components/SVG/CloseSVG';
import { PlaceABidContext } from '@/screens/PlaceABid/PlaceABidContext';

const CONTAINER: ViewStyle = {
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.white,
  borderRadius: 20,
};

const WRAPPER_CLOSE_ICON: ViewStyle = {
  position: 'absolute',
  width: 50,
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  left: 10,
};

const DESCRIPTION: TextStyle = {
  fontSize: fonts.size.s18,
  color: colors.gray_900,
  fontFamily: fonts.family.PoppinsSemiBold,
};

export interface PlaceABidTitleProps {
  style?: ViewStyle;
  closeOnPressed?: () => void;
}

export function PlaceABidTitle(props: PlaceABidTitleProps): ReactElement {
  const { closeOnPressed } = props;
  const { isAuctionRaffle } = useContext(PlaceABidContext);
  const title = language(isAuctionRaffle ? 'purchaseTicket' : 'placeABid.title');

  return (
    <View style={CONTAINER}>
      <TouchableOpacity style={WRAPPER_CLOSE_ICON} onPress={closeOnPressed}>
        <CloseSvg />
      </TouchableOpacity>
      <DefaultText {...{ style: DESCRIPTION }}>{title}</DefaultText>
    </View>
  );
}
