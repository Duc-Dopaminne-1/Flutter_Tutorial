import React, { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { DurationProp } from '@/redux/auction';
import { localizeDuration } from '@/shared/processing';

interface Prop {
  item: DurationProp;
  onPress?: (item: DurationProp) => void;
  itemId?: number | string;
  style?: StyleProp<ViewStyle>;
}
function CreateAuctionDurationItem(prop: Prop) {
  const {
    item: { name, id },
    item,
    onPress,
    itemId,
    style,
  } = prop;

  return (
    <CustomButton
      onPress={() => {
        onPress(item);
      }}
      wrapBtn={styles.wrapBtnDuration}
      containerStyle={[
        styles.wrapCtnBtnDuration,
        itemId === id ? { backgroundColor: colors.blue_700, borderColor: colors.blue_700 } : {},
        style,
      ]}
      textStyle={[styles.textBtn, itemId === id ? { color: colors.white } : {}]}
      text={localizeDuration(name)}
    />
  );
}

export default memo(CreateAuctionDurationItem);

const styles = StyleSheet.create({
  wrapBtnDuration: {
    flex: null,
  },
  wrapCtnBtnDuration: {
    minHeight: null,
    height: null,
    paddingVertical: 8,
    borderRadius: 30,
    width: screenWidth / 3 - 25,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderColor: colors.gray_400,
    marginRight: 12,
    borderWidth: 1,
    paddingHorizontal: 2,
    marginTop: 12,
  },
  textBtn: {
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    letterSpacing: 0,
    fontWeight: null,
  },
});
