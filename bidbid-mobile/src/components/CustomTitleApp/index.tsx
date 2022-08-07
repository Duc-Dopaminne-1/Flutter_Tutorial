import * as React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomText } from '@/components/CustomText';
import { isIOS } from '../../shared/devices';

interface Props {
  containerStyle?: ViewStyle;
  textTitleStyle?: TextStyle;
}
export function CustomTitleApp(props: Props) {
  const { containerStyle, textTitleStyle } = props;
  return (
    <View style={containerStyle}>
      <CustomText numberOfLines={1} titleStyle={[styles.textTitle, textTitleStyle]} title="BidBid" />
    </View>
  );
}

const styles = StyleSheet.create({
  textTitle: {
    color: colors.white,
    fontSize: 45,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: isIOS ? '600' : 'bold',
  },
});
