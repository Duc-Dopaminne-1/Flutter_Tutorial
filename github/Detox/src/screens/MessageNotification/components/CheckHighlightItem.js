import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';

type CheckHighlightItemProps = {
  checked: Boolean,
  title: String,
  onPress: Function,
  style: ViewStyle,
};

const CheckHighlightItem = ({checked, title, onPress, style}: CheckHighlightItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.container(checked), style]}
      onPress={onPress}>
      {checked && <Ionicons name="md-checkmark-circle" size={16} color={COLORS.PRIMARY_A100} />}
      <Text style={styles.txtTitle(checked)}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: checked => ({
    backgroundColor: checked ? COLORS.PRIMARY_A10 : COLORS.NEUTRAL_DIVIDER,
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.PADDING_8,
    paddingVertical: SIZES.PADDING_4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.BORDER_RADIUS_100,
    flexDirection: 'row',
  }),
  txtTitle: checked => ({
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: checked ? COLORS.PRIMARY_A100 : COLORS.TEXT_DARK_10,
    marginLeft: checked ? SIZES.MARGIN_4 : 0,
  }),
});
export default CheckHighlightItem;
